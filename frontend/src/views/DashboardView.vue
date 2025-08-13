<template>
  <div class="min-h-screen bg-slate-50 dark:bg-gray-900 text-slate-800 dark:text-gray-100 transition-colors duration-200">
    <NotificationToast 
      :notification="notification" 
      @close="notification.show = false"
    />

    <!-- Mobile Menu Button -->
    <div class="mobile-menu-btn">
      <button
        @click="toggleSidebar"
        class="flex items-center justify-center p-3 rounded-xl bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 min-w-[48px] min-h-[48px]"
        aria-label="Toggle menu"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="!sidebarOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>

    <!-- Theme Toggle Button -->
    <div class="fixed top-4 right-4 z-[60]">
      <button
        @click="toggleTheme"
        class="flex items-center justify-center p-3 rounded-xl bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 min-w-[48px] min-h-[48px]"
        :aria-label="isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
      >
        <svg v-if="isDarkMode" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
        </svg>
      </button>
    </div>

    <!-- Mobile Overlay -->
    <div 
      v-if="sidebarOpen" 
      class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-[45]"
      @click="sidebarOpen = false"
    ></div>

    <Sidebar 
      :active-module="activeModule" 
      :user-name="user.name"
      :user-role="user.role"
      :is-open="sidebarOpen"
      @set-active-module="handleModuleChange"
      @logout="logout"
      @close="sidebarOpen = false"
    />

    <!-- Main Content -->
    <div class="lg:ml-72 min-h-screen bg-slate-50 dark:bg-gray-900 transition-all duration-300">
      <div class="p-6 max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-6 lg:mb-8">
          <h2 class="text-2xl lg:text-3xl font-bold text-slate-800 dark:text-gray-100">{{ moduleTitle }}</h2>
          <p class="text-slate-500 dark:text-gray-400 text-sm lg:text-base">Bienvenido de nuevo, {{ user.name }}</p>
        </div>

        <!-- Dynamic Content -->
        <DashboardHome 
          v-if="activeModule === 'dashboard'" 
          :dashboard-stats="dashboardStats"
          @set-active-module="activeModule = $event"
        />

        <ProductEntry 
          v-if="activeModule === 'products'" 
          @product-submitted="handleProductSubmit"
        />

        <WarehouseList 
          v-if="activeModule === 'warehouse'" 
          :products="products"
          :user-role="user.role"
          @set-active-module="activeModule = $event"
          @update-product="handleProductUpdate"
          @delete-product="handleProductDelete"
        />

        <ProductOutput 
          v-if="activeModule === 'product-output'"
          :products="products"
          @product-output-submitted="handleProductOutputSubmit"
          @show-notification="(message, type, title) => showNotification(message, type, title)"
        />

        <Accounting 
          v-if="activeModule === 'accounting'"
          :transactions="transactions"
        />

        <UserManagement 
          v-if="activeModule === 'users'"
          @create-user="handleCreateUser"
          @show-notification="(message, type, title) => showNotification(message, type, title)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, reactive, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

import Sidebar from '@/components/dashboard/Sidebar.vue';
import DashboardHome from '@/components/dashboard/DashboardHome.vue';
import ProductEntry from '@/components/dashboard/ProductEntry.vue';
import WarehouseList from '@/components/dashboard/WarehouseList.vue';
import ProductOutput from '@/components/dashboard/ProductOutput.vue';
import Accounting from '@/components/dashboard/Accounting.vue';
import UserManagement from '@/components/dashboard/UserManagement.vue';
import NotificationToast from '@/components/dashboard/NotificationToast.vue';

const router = useRouter();
const user = ref({ name: 'Usuario' });
const activeModule = ref('dashboard'); // dashboard, products, warehouse
const products = ref([]);
const transactions = ref([]);
const notification = ref({ show: false, message: '', type: 'success' });
const sidebarOpen = ref(false);
const isDarkMode = ref(false);

const moduleTitle = computed(() => {
  switch(activeModule.value) {
    case 'dashboard': return 'Dashboard';
    case 'products': return 'Entrada Proveedor';
    case 'product-output': return 'Salida de Producto';
    case 'warehouse': return 'Almacén';
    case 'accounting': return 'Contabilidad';
    case 'users': return 'Gestión de Usuarios';
    default: return 'Dashboard';
  }
});

const dashboardStats = reactive({
  totalProducts: 0,
  expiringSoon: 0,
  todayEntries: 0
});

const showNotification = (message, type = 'success', title = null) => {
  notification.value = { show: true, message, type, title };
  setTimeout(() => {
    notification.value.show = false;
  }, 4000);
};

// Theme management - Initialize immediately
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme) {
    isDarkMode.value = savedTheme === 'dark';
  } else {
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  
  applyTheme();
};

const applyTheme = () => {
  const htmlElement = document.documentElement;
  const bodyElement = document.body;
  
  // Remove both classes first to ensure clean state
  htmlElement.classList.remove('dark', 'light');
  bodyElement.classList.remove('dark', 'light');
  
  if (isDarkMode.value) {
    htmlElement.classList.add('dark');
    bodyElement.classList.add('dark');
    htmlElement.setAttribute('data-theme', 'dark');
  } else {
    htmlElement.classList.add('light');
    bodyElement.classList.add('light');
    htmlElement.setAttribute('data-theme', 'light');
  }
  
  // Set color scheme for better browser support
  htmlElement.style.colorScheme = isDarkMode.value ? 'dark' : 'light';
  
  // Force immediate style recalculation
  setTimeout(() => {
    htmlElement.style.display = 'none';
    htmlElement.offsetHeight; // Trigger reflow
    htmlElement.style.display = '';
  }, 0);
};

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
  applyTheme();
  showNotification(
    `Tema ${isDarkMode.value ? 'oscuro' : 'claro'} activado`,
    'success',
    'Tema cambiado'
  );
};

// Apply theme immediately when script loads - Enhanced for Tailwind v4
(() => {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const shouldBeDark = savedTheme ? savedTheme === 'dark' : prefersDark;
  
  const htmlElement = document.documentElement;
  const bodyElement = document.body;
  
  // Clean all theme classes
  htmlElement.classList.remove('dark', 'light');
  bodyElement.classList.remove('dark', 'light');
  
  if (shouldBeDark) {
    htmlElement.classList.add('dark');
    bodyElement.classList.add('dark');
    htmlElement.style.colorScheme = 'dark';
    htmlElement.setAttribute('data-theme', 'dark');
  } else {
    htmlElement.classList.add('light');
    bodyElement.classList.add('light');
    htmlElement.style.colorScheme = 'light';
    htmlElement.setAttribute('data-theme', 'light');
  }
  
  // Force immediate style recalculation
  htmlElement.style.display = 'none';
  htmlElement.offsetHeight; // Trigger reflow
  htmlElement.style.display = '';
})();

// Responsive sidebar management
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const handleModuleChange = (module) => {
  activeModule.value = module;
  // Close sidebar on mobile when module changes
  if (window.innerWidth < 1024) {
    sidebarOpen.value = false;
  }
};

const checkAuth = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/check-auth', {
      withCredentials: true
    });
    if (response.data.authenticated) {
      user.value = response.data.user;
      // TEMPORARY: Assign admin role for development purposes
      user.value.role = 'admin';
    } else {
      router.push('/login');
    }
  } catch (error) {
    console.error('Authentication check failed:', error);
    router.push('/login');
  }
};

const logout = async () => {
  try {
    await axios.post('http://localhost:3000/api/logout', {}, {
      withCredentials: true
    });
  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    router.push('/');
  }
};

const fetchDashboardStats = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/dashboard/stats', {
      withCredentials: true
    });
    Object.assign(dashboardStats, response.data);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    showNotification('Error al cargar las estadísticas', 'error');
  }
};

const fetchProducts = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/products', {
      withCredentials: true
    });
    products.value = response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

const fetchTransactions = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/transactions', {
      withCredentials: true
    });
    transactions.value = response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
  }
};

const handleProductSubmit = async (productData) => {
  try {
    await axios.post('http://localhost:3000/api/products', productData, {
      withCredentials: true
    });
    showNotification('Producto agregado con éxito');
    fetchDashboardStats();
    // Switch to warehouse view to see the new product
    activeModule.value = 'warehouse';
  } catch (error) {
    console.error('Error adding product:', error);
    showNotification('Error al agregar el producto', 'error');
  }
};

const handleProductOutputSubmit = async (outputData) => {
  try {
    // Call the new backend endpoint
    await axios.post('http://localhost:3000/api/products/output', outputData, {
      withCredentials: true
    });

    showNotification('Salida de producto registrada con éxito');
    
    // Refresh data from the server
    fetchProducts();
    fetchDashboardStats();

    // Optional: Add transaction to local list for immediate UI update in accounting
    const newTransaction = {
      id: Date.now(),
      date: new Date().toISOString(),
      ...outputData
    };
    transactions.value.unshift(newTransaction);

    // Switch to warehouse view to see the updated stock
    activeModule.value = 'warehouse';

  } catch (error) {
    console.error('Error registering product output:', error);
    const errorMessage = error.response?.data?.error || 'Error al registrar la salida del producto';
    showNotification(errorMessage, 'error');
  }
};

const handleProductUpdate = async (productData) => {
  try {
    await axios.put(`http://localhost:3000/api/products/${productData.id}`, productData, {
      withCredentials: true
    });
    showNotification('Producto actualizado con éxito');
    fetchProducts();
  } catch (error) {
    console.error('Error updating product:', error);
    showNotification('Error al actualizar el producto', 'error');
  }
};

const handleProductDelete = async (productId) => {
  try {
    await axios.delete(`http://localhost:3000/api/products/${productId}`, {
      withCredentials: true
    });
    showNotification('Producto eliminado con éxito');
    fetchProducts();
  } catch (error) {
    console.error('Error deleting product:', error);
    showNotification('Error al eliminar el producto', 'error');
  }
};

const handleCreateUser = async (userData) => {
  try {
    await axios.post('http://localhost:3000/api/users', userData, {
      withCredentials: true
    });
    showNotification(`Usuario '${userData.username}' creado con éxito`);
  } catch (error) {
    console.error('Error creating user:', error);
    const errorMessage = error.response?.data?.error || 'Error al crear el usuario';
    showNotification(errorMessage, 'error');
  }
};

onMounted(async () => {
  // Initialize theme immediately before anything else
  initializeTheme();
  
  await checkAuth();
  if (isAuthenticated.value) {
    await fetchProducts();
    await fetchUsers();
    await fetchDashboardStats();
    await fetchTransactions();
  }
});

watch(activeModule, (newModule) => {
  // Fetch products only if the list is empty, to avoid overwriting local changes
  if ((newModule === 'warehouse' || newModule === 'product-output') && products.value.length === 0) {
    fetchProducts();
  }
});
</script>

<style scoped>
/* Custom scrollbar for webkit browsers */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Animaciones adicionales */
@media (prefers-reduced-motion: no-preference) {
  .group:hover .group-hover\:scale-110 {
    animation: bounce 0.3s ease-in-out;
  }
}

@keyframes bounce {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .ml-72 {
    margin-left: 0;
  }
  
  aside {
    transform: translateX(-100%);
    transition: transform 0.3s ease-in-out;
  }
  
  aside.open {
    transform: translateX(0);
  }
}
</style>