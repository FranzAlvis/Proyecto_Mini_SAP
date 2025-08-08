<template>
  <!-- Edit Product Modal -->
  <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
    <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md m-4">
      <h3 class="text-2xl font-bold text-slate-800 mb-6">Editar Producto</h3>
      <form @submit.prevent="submitEdit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-600 mb-1">Nombre</label>
          <input v-model="editingProduct.name" type="text" required class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500">
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-600 mb-1">Categoría</label>
          <input v-model="editingProduct.category" type="text" required class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500">
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-600 mb-1">Cantidad</label>
          <input v-model.number="editingProduct.quantity" type="number" required class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500">
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-600 mb-1">Fecha de Vencimiento</label>
          <input v-model="editingProduct.expirationDate" type="date" required class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500">
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-600 mb-1">Costo</label>
          <input v-model.number="editingProduct.cost" type="number" step="0.01" required class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500">
        </div>
        <div class="flex justify-end space-x-4 pt-4">
          <button type="button" @click="closeModal" class="px-6 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancelar</button>
          <button type="submit" class="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg hover:shadow-lg transition-all duration-200">Guardar Cambios</button>
        </div>
      </form>
    </div>
  </div>

  <div class="space-y-6">
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="p-6 border-b border-slate-200">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-semibold text-slate-800">Inventario</h3>
              <p class="text-sm text-slate-500">Gestión de productos en almacén</p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button class="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              Exportar
            </button>
            <button class="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg hover:shadow-lg transition-all duration-200">
              Filtrar
            </button>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Producto</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Categoría</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Cantidad</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Costo</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Vencimiento</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Estado</th>
              <th v-if="userRole === 'ADMIN'" class="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="product in products" :key="product.id" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4">
                <span class="font-medium text-slate-800">{{ product.name }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {{ product.category }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center space-x-2">
                  <span class="font-medium text-slate-800">{{ product.quantity }}</span>
                  <span class="text-sm text-slate-500">unidades</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="font-medium text-slate-800">{{ formatCurrency(product.cost) }}</span>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-slate-800">{{ formatDate(product.expirationDate) }}</div>
                <div class="text-xs text-slate-500">{{ getExpirationStatus(product.expirationDate) }}</div>
              </td>
              <td class="px-6 py-4">
                <span :class="getStatusClass(product.expirationDate)" class="inline-flex px-2 py-1 text-xs font-medium rounded-full">
                  {{ getStatus(product.expirationDate) }}
                </span>
              </td>
              <td v-if="userRole === 'ADMIN'" class="px-6 py-4">
                <div class="flex items-center space-x-2">
                  <button @click="openModal(product)" class="p-2 text-slate-500 hover:text-emerald-600 rounded-full hover:bg-emerald-50 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z"/></svg>
                  </button>
                  <button @click="confirmDelete(product.id)" class="p-2 text-slate-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="products.length === 0" class="text-center py-12">
        <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-slate-800 mb-2">No hay productos</h3>
        <p class="text-slate-500 mb-6">Comienza agregando tu primer producto al inventario</p>
        <button 
          @click="$emit('setActiveModule', 'products')"
          class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          Agregar Producto
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const props = defineProps({
  products: {
    type: Array,
    required: true
  },
  userRole: {
    type: String,
    default: 'USER'
  }
});

const emit = defineEmits(['setActiveModule', 'update-product', 'delete-product']);

const isModalOpen = ref(false);
const editingProduct = reactive({
  id: null,
  name: '',
  category: '',
  quantity: 0,
  expirationDate: '',
  cost: 0
});

const openModal = (product) => {
  Object.assign(editingProduct, {
    ...product,
    expirationDate: product.expirationDate.split('T')[0] // Format date for input
  });
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const submitEdit = () => {
  emit('update-product', { ...editingProduct });
  closeModal();
};

const formatCurrency = (value) => {
  if (typeof value !== 'number') {
    return '-';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

const confirmDelete = (productId) => {
  if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
    emit('delete-product', productId);
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getExpirationStatus = (dateString) => {
  const today = new Date();
  const expDate = new Date(dateString);
  const diffTime = expDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'Vencido';
  if (diffDays === 0) return 'Vence hoy';
  if (diffDays <= 7) return `${diffDays} días restantes`;
  return `${diffDays} días restantes`;
};

const getStatus = (dateString) => {
  const today = new Date();
  const expDate = new Date(dateString);
  const diffTime = expDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'Vencido';
  if (diffDays <= 7) return 'Por vencer';
  return 'Vigente';
};

const getStatusClass = (dateString) => {
  const today = new Date();
  const expDate = new Date(dateString);
  const diffTime = expDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'bg-red-100 text-red-800';
  if (diffDays <= 7) return 'bg-amber-100 text-amber-800';
  return 'bg-green-100 text-green-800';
};
</script>
