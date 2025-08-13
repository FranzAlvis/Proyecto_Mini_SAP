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
            <label class="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">Cantidad de Salida</label>
            <input 
              v-model.number="outputQuantity" 
              @blur="validateQuantity"
              @input="clearFieldError('outputQuantity')"
              type="number" 
              required 
              :max="selectedProduct.quantity"
              min="1"
              :class="[
                'w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200',
                quantityError || hasFieldError('outputQuantity')
                  ? 'border-red-300 focus:ring-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-700'
                  : 'border-slate-200 dark:border-gray-600 focus:ring-orange-500 bg-white dark:bg-gray-700 dark:text-gray-100'
              ]"
              placeholder="0"
            >
            <div v-if="quantityError || hasFieldError('outputQuantity')" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ quantityError || getFieldError('outputQuantity') }}
            </div>
            <div v-else-if="selectedProduct" class="mt-1 text-xs text-slate-500 dark:text-gray-400">
              Stock disponible: {{ selectedProduct.quantity }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">Precio de Venta (Unitario)</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-slate-500 dark:text-gray-400">$</span>
              </div>
              <input 
                v-model.number="sellingPrice" 
                @blur="validatePrice"
                @input="clearFieldError('sellingPrice')"
                type="number" 
                step="0.01"
                required 
                min="0.01"
                :class="[
                  'w-full pl-8 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200',
                  hasFieldError('sellingPrice')
                    ? 'border-red-300 focus:ring-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-700'
                    : 'border-slate-200 dark:border-gray-600 focus:ring-orange-500 bg-white dark:bg-gray-700 dark:text-gray-100'
                ]"
                placeholder="0.00"
              >
            </div>
            <div v-if="hasFieldError('sellingPrice')" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ getFieldError('sellingPrice') }}
            </div>
            <div v-else-if="selectedProduct && sellingPrice > 0" class="mt-1 text-xs text-slate-500 dark:text-gray-400">
              Total: ${{ (outputQuantity * sellingPrice).toFixed(2) }}
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div v-if="selectedProduct">
          <button 
            type="submit" 
            :disabled="!canSubmit"
            :class="[
              'w-full font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform',
              canSubmit
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            ]"
          >
            <div v-if="isSubmitting" class="flex items-center justify-center space-x-2">
              <svg class="animate-spin h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              <span>Procesando...</span>
            </div>
            <span v-else>Registrar Salida</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useValidation } from '@/composables/useValidation';

const emit = defineEmits(['product-output-submitted', 'show-notification']);

const props = defineProps({
  products: {
    type: Array,
    required: true
  }
});

const { validate, rules, hasFieldError, getFieldError, clearFieldError } = useValidation();

const searchQuery = ref('');
const searchResults = ref([]);
const selectedProduct = ref(null);
const outputQuantity = ref(1);
const sellingPrice = ref(0);
const isSubmitting = ref(false);

// Validation rules for the form
const validationRules = {
  selectedProduct: {
    name: 'Producto',
    rules: [rules.required]
  },
  outputQuantity: {
    name: 'Cantidad de salida',
    rules: [
      rules.required,
      rules.positiveNumber,
      rules.min(1)
    ]
  },
  sellingPrice: {
    name: 'Precio de venta',
    rules: [
      rules.required,
      rules.positiveNumber,
      rules.min(0.01)
    ]
  }
};

// Computed properties for validation
const isQuantityValid = computed(() => {
  return selectedProduct.value && outputQuantity.value > 0 && outputQuantity.value <= selectedProduct.value.quantity;
});

const quantityError = computed(() => {
  if (!selectedProduct.value) return null;
  if (outputQuantity.value > selectedProduct.value.quantity) {
    return `La cantidad no puede ser mayor a ${selectedProduct.value.quantity} (stock disponible)`;
  }
  return getFieldError('outputQuantity');
});

const canSubmit = computed(() => {
  return selectedProduct.value && 
         outputQuantity.value > 0 && 
         outputQuantity.value <= selectedProduct.value.quantity && 
         sellingPrice.value > 0 &&
         !isSubmitting.value;
});



const searchProducts = () => {
  if (searchQuery.value.length < 2) {
    searchResults.value = [];
    selectedProduct.value = null;
    clearFieldError('selectedProduct');
    return;
  }
  
  const filteredProducts = props.products.filter(p => 
    (p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    p.lot.toLowerCase().includes(searchQuery.value.toLowerCase())) &&
    p.quantity > 0
  );
  
  searchResults.value = filteredProducts;
  
  if (filteredProducts.length === 0) {
    emit('show-notification', 'No se encontraron productos con stock disponible', 'warning', 'Búsqueda');
  }
};

const selectProduct = (product) => {
  selectedProduct.value = product;
  searchQuery.value = product.name;
  searchResults.value = [];
  outputQuantity.value = 1;
  sellingPrice.value = product.cost; // Pre-fill with cost price as a default
  clearFieldError('selectedProduct');
  clearFieldError('outputQuantity');
  clearFieldError('sellingPrice');
};

const validateQuantity = () => {
  if (!selectedProduct.value) return;
  
  const formData = {
    selectedProduct: selectedProduct.value,
    outputQuantity: outputQuantity.value,
    sellingPrice: sellingPrice.value
  };
  
  validate(formData, {
    outputQuantity: validationRules.outputQuantity
  });
};

const validatePrice = () => {
  if (!sellingPrice.value) return;
  
  const formData = {
    selectedProduct: selectedProduct.value,
    outputQuantity: outputQuantity.value,
    sellingPrice: sellingPrice.value
  };
  
  validate(formData, {
    sellingPrice: validationRules.sellingPrice
  });
};

const submitForm = async () => {
  if (isSubmitting.value) return;
  
  const formData = {
    selectedProduct: selectedProduct.value,
    outputQuantity: outputQuantity.value,
    sellingPrice: sellingPrice.value
  };
  
  // Validate all fields
  const isValid = validate(formData, validationRules);
  
  // Additional custom validation for quantity vs stock
  if (selectedProduct.value && outputQuantity.value > selectedProduct.value.quantity) {
    emit('show-notification', 
      `La cantidad solicitada (${outputQuantity.value}) excede el stock disponible (${selectedProduct.value.quantity})`, 
      'error', 
      'Stock insuficiente'
    );
    return;
  }
  
  if (!isValid) {
    emit('show-notification', 'Por favor corrige los errores en el formulario', 'error', 'Validación');
    return;
  }
  
  isSubmitting.value = true;
  
  try {
    const outputData = {
      productId: selectedProduct.value.id,
      productName: selectedProduct.value.name,
      lot: selectedProduct.value.lot,
      quantity: outputQuantity.value,
      sellingPrice: sellingPrice.value,
      total: outputQuantity.value * sellingPrice.value
    };

    emit('product-output-submitted', outputData);
    
    // Reset state after successful submission
    selectedProduct.value = null;
    searchQuery.value = '';
    outputQuantity.value = 1;
    sellingPrice.value = 0;
    
    emit('show-notification', 'Salida de producto registrada exitosamente', 'success', '¡Éxito!');
    
  } catch (error) {
    emit('show-notification', 'Error al procesar la salida del producto', 'error', 'Error');
  } finally {
    isSubmitting.value = false;
  }
};
</script>
