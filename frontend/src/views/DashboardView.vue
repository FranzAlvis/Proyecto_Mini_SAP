<template>
  <div class="min-h-screen bg-slate-50 text-slate-800">
    <NotificationToast :notification="notification" />

    <Sidebar 
      :active-module="activeModule" 
      :user-name="user.name"
      @set-active-module="activeModule = $event"
      @logout="logout"
    />

    <!-- Main Content -->
    <main class="ml-72 p-8">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-slate-800 capitalize">{{ activeModule === 'products' ? 'Entrada Proveedor' : activeModule }}</h2>
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
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, reactive } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

import Sidebar from '@/components/dashboard/Sidebar.vue';
import DashboardHome from '@/components/dashboard/DashboardHome.vue';
import ProductEntry from '@/components/dashboard/ProductEntry.vue';
import WarehouseList from '@/components/dashboard/WarehouseList.vue';
import NotificationToast from '@/components/dashboard/NotificationToast.vue';

const router = useRouter();
const user = ref({ name: 'Usuario' });
const activeModule = ref('dashboard'); // dashboard, products, warehouse
const products = ref([]);
const notification = ref({ show: false, message: '', type: 'success' });

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

onMounted(() => {
  checkAuth();
  fetchDashboardStats();
});

watch(activeModule, (newModule) => {
  if (newModule === 'warehouse') {
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