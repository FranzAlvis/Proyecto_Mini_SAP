<template>
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="notification.show" class="fixed top-4 right-4 z-50 max-w-sm w-full sm:w-auto">
      <div :class="notificationClasses" class="rounded-xl shadow-lg p-4 border backdrop-blur-sm">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <!-- Success Icon -->
            <div v-if="notification.type === 'success'" class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <!-- Error Icon -->
            <div v-else-if="notification.type === 'error'" class="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
              <svg class="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <!-- Warning Icon -->
            <div v-else-if="notification.type === 'warning'" class="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg class="h-4 w-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <!-- Info Icon -->
            <div v-else class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <div class="ml-3 flex-1">
            <p :class="textClasses" class="text-sm font-medium">{{ notification.title || getDefaultTitle() }}</p>
            <p :class="messageClasses" class="text-xs mt-1">{{ notification.message }}</p>
          </div>
          <div class="ml-4 flex-shrink-0">
            <button
              @click="$emit('close')"
              :class="buttonClasses"
              class="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  notification: {
    type: Object,
    required: true
  }
});

defineEmits(['close']);

const notificationClasses = computed(() => {
  const baseClasses = 'bg-white dark:bg-gray-800';
  switch (props.notification.type) {
    case 'success':
      return `${baseClasses} border-green-200 dark:border-green-700`;
    case 'error':
      return `${baseClasses} border-red-200 dark:border-red-700`;
    case 'warning':
      return `${baseClasses} border-yellow-200 dark:border-yellow-700`;
    default:
      return `${baseClasses} border-blue-200 dark:border-blue-700`;
  }
});

const textClasses = computed(() => {
  switch (props.notification.type) {
    case 'success':
      return 'text-green-800 dark:text-green-200';
    case 'error':
      return 'text-red-800 dark:text-red-200';
    case 'warning':
      return 'text-yellow-800 dark:text-yellow-200';
    default:
      return 'text-blue-800 dark:text-blue-200';
  }
});

const messageClasses = computed(() => {
  return 'text-gray-600 dark:text-gray-300';
});

const buttonClasses = computed(() => {
  switch (props.notification.type) {
    case 'success':
      return 'text-green-400 hover:text-green-500 focus:ring-green-500';
    case 'error':
      return 'text-red-400 hover:text-red-500 focus:ring-red-500';
    case 'warning':
      return 'text-yellow-400 hover:text-yellow-500 focus:ring-yellow-500';
    default:
      return 'text-blue-400 hover:text-blue-500 focus:ring-blue-500';
  }
});

const getDefaultTitle = () => {
  switch (props.notification.type) {
    case 'success':
      return '¡Éxito!';
    case 'error':
      return 'Error';
    case 'warning':
      return 'Advertencia';
    default:
      return 'Información';
  }
};
</script>
