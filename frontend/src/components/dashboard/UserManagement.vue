<template>
  <div class="bg-white p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
    <h3 class="text-2xl font-bold text-slate-800 mb-6">Gestión de Usuarios</h3>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Campo de Nombre de Usuario -->
        <div>
          <label for="username" class="block text-sm font-medium text-slate-600 mb-1">Nombre de Usuario</label>
          <input 
            type="text" 
            id="username" 
            v-model="user.username"
            required
            class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Ej: juan.perez"
          />
        </div>

        <!-- Campo de Contraseña -->
        <div>
          <label for="password" class="block text-sm font-medium text-slate-600 mb-1">Contraseña</label>
          <input 
            type="password" 
            id="password" 
            v-model="user.password"
            required
            class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Mínimo 8 caracteres"
          />
        </div>
      </div>

      <!-- Campo de Rol -->
      <div>
        <label for="role" class="block text-sm font-medium text-slate-600 mb-1">Rol de Usuario</label>
        <select 
          id="role" 
          v-model="user.role"
          required
          class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        >
          <option value="user">Usuario</option>
          <option value="admin">Administrador</option>
        </select>
      </div>

      <!-- Botón de Envío -->
      <div class="flex justify-end pt-4">
        <button 
          type="submit" 
          class="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Crear Usuario
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['create-user']);

const user = ref({
  username: '',
  password: '',
  role: 'user' // Rol por defecto
});

const handleSubmit = () => {
  // Validación básica
  if (!user.value.username || !user.value.password) {
    // En una app real, mostraríamos una notificación de error
    console.error('Nombre de usuario y contraseña son requeridos.');
    return;
  }

  emit('create-user', { ...user.value });

  // Limpiar el formulario
  user.value.username = '';
  user.value.password = '';
  user.value.role = 'user';
};
</script>
