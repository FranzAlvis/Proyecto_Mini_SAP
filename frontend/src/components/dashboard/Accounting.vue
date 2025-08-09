<template>
  <div class="space-y-6">
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <!-- Header -->
      <div class="flex items-center space-x-3 mb-6">
        <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 8h6m-5 4h.01M4 16h16M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div>
          <h3 class="text-xl font-semibold text-slate-800">Registro Contable</h3>
          <p class="text-sm text-slate-500">Historial de todas las transacciones de venta</p>
        </div>
      </div>

      <!-- Transactions Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Fecha</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Producto</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Lote</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Cantidad</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Precio Venta</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-200">
            <tr v-if="transactions.length === 0">
                <td colspan="6" class="px-6 py-12 text-center text-slate-500">
                    No hay transacciones registradas.
                </td>
            </tr>
            <tr v-for="tx in transactions" :key="tx.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{{ formatDate(tx.date) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{{ tx.productName }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{{ tx.lot }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-500">{{ tx.quantity }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-500">{{ formatCurrency(tx.sellingPrice) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-emerald-600">{{ formatCurrency(tx.total) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  transactions: {
    type: Array,
    required: true,
    default: () => []
  }
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}
</script>
