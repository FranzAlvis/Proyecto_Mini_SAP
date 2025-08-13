<template>
  <div class="bg-white dark:bg-gray-800 p-4 lg:p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300">
    <div class="flex items-center space-x-3 mb-6">
      <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
        </svg>
      </div>
      <div>
        <h3 class="text-xl lg:text-2xl font-bold text-slate-800 dark:text-gray-100">Gestión de Usuarios</h3>
        <p class="text-sm text-slate-500 dark:text-gray-400">Crear nuevos usuarios del sistema</p>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <!-- Campo de Nombre Completo -->
        <div>
          <label for="name" class="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-2">Nombre Completo</label>
          <input 
            type="text" 
            id="name" 
            v-model="user.name"
            @blur="() => validate(user, { name: validationRules.name })"
            @input="clearFieldError('name')"
            required
            :class="[
              'w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200',
              hasFieldError('name')
                ? 'border-red-300 focus:ring-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-700'
                : 'border-slate-200 dark:border-gray-600 focus:ring-blue-500 bg-slate-50 dark:bg-gray-700 dark:text-gray-100'
            ]"
            placeholder="Ej: Juan Pérez"
          />
          <div v-if="hasFieldError('name')" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ getFieldError('name') }}
          </div>
        </div>

        <!-- Campo de Nombre de Usuario -->
        <div>
          <label for="username" class="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-2">Nombre de Usuario</label>
          <input 
            type="text" 
            id="username" 
            v-model="user.username"
            @blur="() => validate(user, { username: validationRules.username })"
            @input="clearFieldError('username')"
            required
            :class="[
              'w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200',
              hasFieldError('username')
                ? 'border-red-300 focus:ring-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-700'
                : 'border-slate-200 dark:border-gray-600 focus:ring-blue-500 bg-slate-50 dark:bg-gray-700 dark:text-gray-100'
            ]"
            placeholder="Ej: juan.perez"
          />
          <div v-if="hasFieldError('username')" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ getFieldError('username') }}
          </div>
          <div v-else class="mt-1 text-xs text-slate-500 dark:text-gray-400">
            Solo letras, números, puntos, guiones y guiones bajos
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <!-- Campo de Contraseña -->
        <div>
          <label for="password" class="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-2">Contraseña</label>
          <input 
            type="password" 
            id="password" 
            v-model="user.password"
            @blur="() => validate(user, { password: validationRules.password })"
            @input="clearFieldError('password')"
            required
            :class="[
              'w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200',
              hasFieldError('password')
                ? 'border-red-300 focus:ring-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-700'
                : 'border-slate-200 dark:border-gray-600 focus:ring-blue-500 bg-slate-50 dark:bg-gray-700 dark:text-gray-100'
            ]"
            placeholder="Mínimo 8 caracteres"
          />
          <div v-if="hasFieldError('password')" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ getFieldError('password') }}
          </div>
          <div v-else class="mt-1 text-xs text-slate-500 dark:text-gray-400">
            Debe contener mayúscula, minúscula y número
          </div>
        </div>

        <!-- Campo de Rol -->
        <div>
          <label for="role" class="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-2">Rol de Usuario</label>
          <select 
            id="role" 
            v-model="user.role"
            required
            class="w-full px-4 py-3 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:text-gray-100"
          >
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
      </div>

      <!-- Botón de Envío -->
      <div class="flex justify-end pt-4">
        <button 
          type="submit" 
          :disabled="!canSubmit"
          :class="[
            'px-6 py-3 font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2',
            canSubmit
              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md hover:shadow-lg hover:scale-105 focus:ring-indigo-500'
              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          ]"
        >
          <div v-if="isSubmitting" class="flex items-center space-x-2">
            <svg class="animate-spin h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <span>Creando...</span>
          </div>
          <span v-else>Crear Usuario</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useValidation } from '@/composables/useValidation';

const emit = defineEmits(['create-user', 'show-notification']);

const { validate, rules, hasFieldError, getFieldError, clearFieldError } = useValidation();

const user = ref({
  name: '',
  username: '',
  password: '',
  role: 'user' // Rol por defecto
});

const isSubmitting = ref(false);

// Validation rules
const validationRules = {
  name: {
    name: 'Nombre completo',
    rules: [
      rules.required,
      rules.minLength(2),
      rules.maxLength(50)
    ]
  },
  username: {
    name: 'Nombre de usuario',
    rules: [
      rules.required,
      rules.minLength(3),
      rules.maxLength(20),
      rules.username
    ]
  },
  password: {
    name: 'Contraseña',
    rules: [
      rules.required,
      rules.password
    ]
  },
  role: {
    name: 'Rol',
    rules: [rules.required]
  }
};

const canSubmit = computed(() => {
  return user.value.name && 
         user.value.username && 
         user.value.password && 
         user.value.role &&
         !isSubmitting.value;
});

const handleSubmit = async () => {
  if (isSubmitting.value) return;
  
  // Validate all fields
  const isValid = validate(user.value, validationRules);
  
  if (!isValid) {
    emit('show-notification', 'Por favor corrige los errores en el formulario', 'error', 'Validación');
    return;
  }
  
  isSubmitting.value = true;
  
  try {
    emit('create-user', { ...user.value });
    
    // Reset form after successful submission
    user.value.name = '';
    user.value.username = '';
    user.value.password = '';
    user.value.role = 'user';
    
    emit('show-notification', 'Usuario creado exitosamente', 'success', '¡Éxito!');
    
  } catch (error) {
    emit('show-notification', 'Error al crear el usuario', 'error', 'Error');
  } finally {
    isSubmitting.value = false;
  }
};
</script>
