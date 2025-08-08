<template>
  <div v-if="notification.show" class="fixed bottom-4 right-4 z-50">
    <div :class="[
      'flex items-center space-x-3 px-6 py-4 rounded-xl shadow-lg max-w-sm transform transition-all duration-300',
      notification.type === 'success' 
        ? 'bg-emerald-500 text-white' 
        : 'bg-red-500 text-white'
    ]">
      <svg v-if="notification.type === 'success'" class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
      </svg>
      <svg v-else class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
      <span class="font-medium">{{ notification.message }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  notification: {
    type: Object,
    required: true
  }
});
</script>
