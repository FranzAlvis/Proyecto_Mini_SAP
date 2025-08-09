<template>
  <div class="min-h-screen bg-slate-50 text-slate-800">
    <NotificationToast :notification="notification" />

    <Sidebar 
      :active-module="activeModule" 
      :user-name="user.name"
      :user-role="user.role"
      @set-active-module="activeModule = $event"
      @logout="logout"
    />

    <!-- Main Content -->
    <main class="ml-72 p-8">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-slate-800">{{ moduleTitle }}</h2>
          <p class="text-slate-500">Bienvenido de nuevo, {{ user.name }}</p>
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
        />

        <Accounting 
          v-if="activeModule === 'accounting'"
          :transactions="transactions"
        />

        <UserManagement 
          v-if="activeModule === 'users'"
          @create-user="handleCreateUser"
        />
      </div>
    </main>
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

const showNotification = (message, type = 'success') => {
  notification.value = { show: true, message, type };
  setTimeout(() => {
    notification.value.show = false;
  }, 3000);
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
    showNotification('Error al cargar los productos', 'error');
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
    // NOTE: In a real app, this would be an API call to a secure endpoint.
    // For demonstration, we'll just log the data and show a success message.
    console.log('Creating user:', userData);
    // await axios.post('http://localhost:3000/api/users', userData, {
    //     withCredentials: true
    // });
    showNotification(`Usuario '${userData.username}' creado con éxito`);
  } catch (error) {
    console.error('Error creating user:', error);
    const errorMessage = error.response?.data?.message || 'Error al crear el usuario';
    showNotification(errorMessage, 'error');
  }
};

onMounted(() => {
  checkAuth();
  fetchDashboardStats();
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