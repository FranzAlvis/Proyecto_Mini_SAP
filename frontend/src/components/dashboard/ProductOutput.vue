<template>
  <div class="space-y-6">
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <!-- Header -->
      <div class="flex items-center space-x-3 mb-6">
        <div class="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H3"></path>
          </svg>
        </div>
        <div>
          <h3 class="text-xl font-semibold text-slate-800">Salida de Producto</h3>
          <p class="text-sm text-slate-500">Busca un producto y registra la cantidad de salida</p>
        </div>
      </div>

      <!-- Search and Form -->
      <form @submit.prevent="submitForm" class="space-y-6">
        <!-- Product Search -->
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">Buscar Producto</label>
          <div class="relative">
            <input 
              v-model="searchQuery"
              @input="searchProducts"
              type="text" 
              class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              placeholder="Escribe el nombre, SKU o lote del producto"
            >
            <!-- Search results dropdown -->
            <div v-if="searchResults.length > 0" class="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg">
              <ul>
                <li 
                  v-for="product in searchResults" 
                  :key="product.id" 
                  @click="selectProduct(product)"
                  class="px-4 py-3 hover:bg-slate-100 cursor-pointer"
                >
                  {{ product.name }} - Lote: {{ product.lot }} (Disp: {{ product.quantity }})
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Selected Product Info -->
        <div v-if="selectedProduct" class="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <h4 class="text-sm font-semibold text-slate-600">Producto Seleccionado</h4>
                <p class="text-lg text-slate-800 font-bold">{{ selectedProduct.name }}</p>
            </div>
             <div>
                <h4 class="text-sm font-semibold text-slate-600">Cantidad Disponible</h4>
                <p class="text-lg text-slate-800 font-bold">{{ selectedProduct.quantity }}</p>
            </div>
        </div>

        <!-- Output Quantity and Price -->
        <div v-if="selectedProduct" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Cantidad de Salida</label>
            <input 
              v-model.number="outputQuantity" 
              type="number" 
              required 
              :max="selectedProduct.quantity"
              min="1"
              class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              placeholder="0"
            >
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Precio de Venta (Unitario)</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-slate-500">$</span>
              </div>
              <input 
                v-model.number="sellingPrice" 
                type="number" 
                step="0.01"
                required 
                min="0.01"
                class="w-full pl-8 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="0.00"
              >
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div v-if="selectedProduct">
          <button 
            type="submit" 
            class="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-200 transform hover:-translate-y-0.5"
          >
            Registrar Salida
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['product-output-submitted']);

const props = defineProps({
  products: {
    type: Array,
    required: true
  }
});

const searchQuery = ref('');
const searchResults = ref([]);
const selectedProduct = ref(null);
const outputQuantity = ref(1);
const sellingPrice = ref(0);



const searchProducts = () => {
  if (searchQuery.value.length < 2) {
    searchResults.value = [];
    selectedProduct.value = null;
    return;
  }
  searchResults.value = props.products.filter(p => 
    (p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    p.lot.toLowerCase().includes(searchQuery.value.toLowerCase())) &&
    p.quantity > 0
  );
};

const selectProduct = (product) => {
  selectedProduct.value = product;
  searchQuery.value = product.name;
  searchResults.value = [];
  outputQuantity.value = 1;
  sellingPrice.value = product.cost; // Pre-fill with cost price as a default
};

const submitForm = () => {
  if (!selectedProduct.value || outputQuantity.value <= 0 || outputQuantity.value > selectedProduct.value.quantity || sellingPrice.value <= 0) {
    // TODO: Show a user-friendly notification about the error
    console.error("Invalid data for submission. Check quantity and price.");
    return;
  }
  
  const outputData = {
    productId: selectedProduct.value.id,
    productName: selectedProduct.value.name,
    lot: selectedProduct.value.lot,
    quantity: outputQuantity.value,
    sellingPrice: sellingPrice.value,
    total: outputQuantity.value * sellingPrice.value
  };

  emit('product-output-submitted', outputData);
  
  // Reset state after submission
  selectedProduct.value = null;
  searchQuery.value = '';
  outputQuantity.value = 1;
  sellingPrice.value = 0;
};
</script>
