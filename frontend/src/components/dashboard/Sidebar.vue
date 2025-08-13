<template>
  <aside :class="sidebarClasses">
    <!-- Close button for mobile -->
    <button 
      @click="$emit('close')"
      class="lg:hidden absolute top-4 right-4 p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>

    <!-- Header -->
    <div class="p-4 lg:p-6 border-b border-slate-200 dark:border-gray-700">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
          <span class="text-white font-bold text-sm lg:text-lg">S</span>
        </div>
        <div>
          <h1 class="text-lg lg:text-xl font-bold text-slate-800 dark:text-gray-100">Mini SAP</h1>
          <p class="text-xs lg:text-sm text-slate-500 dark:text-gray-400">Sistema de Gestión</p>
        </div>
      </div>
    </div>

    <!-- User Info -->
    <div class="p-4 lg:p-6">
      <div class="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-gray-700 rounded-xl">
        <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-slate-800 dark:text-gray-100 truncate">{{ userName }}</p>
          <p class="text-xs text-slate-500 dark:text-gray-400">{{ userRole === 'ADMIN' ? 'Administrador' : 'Usuario' }}</p>
        </div>
        <div class="w-2 h-2 bg-green-400 rounded-full"></div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="p-4 lg:p-6 space-y-1 lg:space-y-2 flex-1 overflow-y-auto">
      <div class="mb-4">
        <span class="text-xs font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-wider">MENÚ PRINCIPAL</span>
      </div>
      
      <a 
        href="#" 
        @click.prevent="$emit('set-active-module', 'dashboard')" 
        :class="[
          'flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group',
          activeModule === 'dashboard' 
            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25' 
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
        ]"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
          <polyline points="15,9 15,15 9,15"/>
        </svg>
        <span class="font-medium">Dashboard</span>
        <div class="ml-auto w-1.5 h-1.5 bg-current rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </a>

      <a 
        href="#" 
        @click.prevent="$emit('set-active-module', 'products')" 
        :class="[
          'flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group',
          activeModule === 'products' 
            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25' 
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
        ]"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
        </svg>
        <span class="font-medium">Entrada Proveedor</span>
        <div class="ml-auto w-1.5 h-1.5 bg-current rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </a>

      <a 
        href="#" 
        @click.prevent="$emit('set-active-module', 'product-output')" 
        :class="[
          'flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group',
          activeModule === 'product-output' 
            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25' 
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
        ]"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H3"></path>
        </svg>
        <span class="font-medium">Salida de Producto</span>
        <div class="ml-auto w-1.5 h-1.5 bg-current rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </a>

      <a 
        href="#" 
        @click.prevent="$emit('set-active-module', 'warehouse')" 
        :class="[
          'flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group',
          activeModule === 'warehouse' 
            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25' 
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
        ]"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
        </svg>
        <span class="font-medium">Almacén</span>
        <div class="ml-auto w-1.5 h-1.5 bg-current rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </a>

      <a 
        href="#" 
        @click.prevent="$emit('set-active-module', 'accounting')" 
        :class="[
          'flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group',
          activeModule === 'accounting' 
            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25' 
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
        ]"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 8h6m-5 4h.01M4 16h16M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span class="font-medium">Contabilidad</span>
        <div class="ml-auto w-1.5 h-1.5 bg-current rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </a>

      <!-- Admin Only: User Management -->
      <a 
        v-if="userRole === 'admin'"
        href="#" 
        @click.prevent="$emit('set-active-module', 'users')" 
        :class="[
          'flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group',
          activeModule === 'users' 
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25' 
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
        ]"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m13.292-8.152a4 4 0 11-5.292 0M18 21a6 6 0 00-9-5.197"></path>
        </svg>
        <span class="font-medium">Usuarios</span>
        <div class="ml-auto w-1.5 h-1.5 bg-current rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </a>
    </nav>

    <!-- Logout Button -->
    <div class="absolute bottom-6 left-6 right-6">
      <button 
        @click="$emit('logout')" 
        class="w-full flex items-center space-x-3 px-4 py-3 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
        </svg>
        <span class="font-medium">Cerrar Sesión</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  activeModule: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    default: 'Usuario'
  },
  userRole: {
    type: String,
    default: 'user'
  },
  isOpen: {
    type: Boolean,
    default: false
  }
});

defineEmits(['set-active-module', 'logout', 'close']);

const sidebarClasses = computed(() => {
  const baseClasses = 'fixed left-0 top-0 h-full w-72 border-r shadow-xl transition-all duration-300 z-[50] overflow-y-auto';
  const colorClasses = 'bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700';
  
  // Mobile: show/hide based on isOpen prop
  // Desktop (lg+): always visible
  const positionClasses = props.isOpen 
    ? 'translate-x-0' 
    : '-translate-x-full lg:translate-x-0';
  
  return `${baseClasses} ${colorClasses} ${positionClasses}`;
});
</script>
