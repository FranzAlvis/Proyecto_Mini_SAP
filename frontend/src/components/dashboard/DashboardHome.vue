<template>
  <div class="space-y-8">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 group">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
          </div>
          <div class="text-right">
            <p class="text-2xl font-bold text-slate-800">{{ dashboardStats.totalProducts }}</p>
            <p class="text-xs text-green-600 font-medium">+12% vs mes anterior</p>
          </div>
        </div>
        <h3 class="font-semibold text-slate-700 mb-1">Productos Totales</h3>
        <p class="text-xs text-slate-500">Total de productos en inventario</p>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 group">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="text-right">
            <p class="text-2xl font-bold text-slate-800">{{ dashboardStats.expiringSoon }}</p>
            <p class="text-xs text-red-600 font-medium">Requiere atención</p>
          </div>
        </div>
        <h3 class="font-semibold text-slate-700 mb-1">Por Vencer</h3>
        <p class="text-xs text-slate-500">Productos próximos a vencer</p>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 group">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
          </div>
          <div class="text-right">
            <p class="text-2xl font-bold text-slate-800">{{ dashboardStats.todayEntries }}</p>
            <p class="text-xs text-green-600 font-medium">Hoy</p>
          </div>
        </div>
        <h3 class="font-semibold text-slate-700 mb-1">Entradas Hoy</h3>
        <p class="text-xs text-slate-500">Productos ingresados hoy</p>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 group">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
            </svg>
          </div>
          <div class="text-right">
            <p class="text-2xl font-bold text-slate-800">{{ formattedTotalValue }}</p>
            <p class="text-xs text-green-600 font-medium">+8.2% vs ayer</p>
          </div>
        </div>
        <h3 class="font-semibold text-slate-700 mb-1">Valor Total</h3>
        <p class="text-xs text-slate-500">Valor total del inventario</p>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h3 class="text-lg font-semibold text-slate-800 mb-4">Acciones Rápidas</h3>
        <div class="grid grid-cols-2 gap-4">
          <button 
            @click="$emit('setActiveModule', 'products')"
            class="flex items-center space-x-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl hover:shadow-md transition-all duration-300 group"
          >
            <div class="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
            </div>
            <div class="text-left">
              <p class="font-medium text-slate-800">Nuevo Producto</p>
              <p class="text-xs text-slate-500">Registrar entrada</p>
            </div>
          </button>

          <button 
            @click="$emit('setActiveModule', 'warehouse')"
            class="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl hover:shadow-md transition-all duration-300 group"
          >
            <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <div class="text-left">
              <p class="font-medium text-slate-800">Ver Almacén</p>
              <p class="text-xs text-slate-500">Consultar inventario</p>
            </div>
          </button>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h3 class="text-lg font-semibold text-slate-800 mb-4">Alertas</h3>
        <div class="space-y-3">
          <div class="flex items-start space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div class="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p class="text-sm font-medium text-red-800">{{ dashboardStats.expiringSoon }} productos por vencer</p>
              <p class="text-xs text-red-600">En los próximos 7 días</p>
            </div>
          </div>
          <div class="flex items-start space-x-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div class="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p class="text-sm font-medium text-amber-800">Stock bajo</p>
              <p class="text-xs text-amber-600">{{ dashboardStats.lowStock }} productos con stock mínimo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>


import { computed } from 'vue';

defineEmits(['setActiveModule']);

const props = defineProps({
  dashboardStats: {
    type: Object,
    required: true
  }
});

const formattedTotalValue = computed(() => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(props.dashboardStats.totalValue || 0);
});
</script>
