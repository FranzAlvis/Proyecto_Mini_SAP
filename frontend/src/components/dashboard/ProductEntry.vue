<template>
  <div class="space-y-6">
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div class="flex items-center space-x-3 mb-6">
        <div class="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
        </div>
        <div>
          <h3 class="text-xl font-semibold text-slate-800">Registro de Producto</h3>
          <p class="text-sm text-slate-500">Completa la información del nuevo producto</p>
        </div>
      </div>

      <form @submit.prevent="submitForm" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">Nombre del Producto</label>
          <input 
            v-model="productForm.name" 
            type="text" 
            required 
            class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
            placeholder="Ej: Laptop Dell Inspiron"
          >
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">Categoría</label>
          <input 
            v-model="productForm.category" 
            type="text" 
            required 
            class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
            placeholder="Ej: Electrónicos"
          >
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">Fecha de Vencimiento</label>
          <input 
            v-model="productForm.expirationDate" 
            type="date" 
            required 
            class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
          >
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">Cantidad</label>
          <input 
            v-model="productForm.quantity" 
            type="number" 
            required 
            class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
            placeholder="0"
          >
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">Costo Unitario</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="text-slate-500">$</span>
            </div>
            <input 
              v-model="productForm.cost" 
              type="number" 
              step="0.01" 
              required 
              class="w-full pl-8 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
              placeholder="0.00"
            >
          </div>
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">Lote</label>
          <input 
            v-model="productForm.lot" 
            type="text" 
            required 
            class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
            placeholder="Ej: LOT2024001"
          >
        </div>

        <div class="md:col-span-2">
          <button 
            type="submit" 
            class="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <div class="flex items-center justify-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              <span>Registrar Producto</span>
            </div>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const emit = defineEmits(['product-submitted']);

const productForm = reactive({
  name: '',
  category: '',
  expirationDate: '',
  quantity: '',
  cost: '',
  lot: ''
});

const submitForm = () => {
  emit('product-submitted', { ...productForm });
  // Reset form after submission
  Object.keys(productForm).forEach(key => productForm[key] = '');
};
</script>
