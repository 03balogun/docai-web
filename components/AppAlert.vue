<script setup lang="ts">
const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'info',
  },
})

const alertColor = computed(() => {
  switch (props.type) {
    case 'error':
      return 'bg-red-50 text-red-800'
    case 'success':
      return 'bg-green-50 text-green-800'
    case 'warning':
      return 'bg-yellow-50 text-yellow-800'
    default:
      return 'bg-blue-50 text-blue-800'
  }
})

</script>

<template>
  <div class="rounded-md p-4" :class="alertColor">
    <div class="flex">
      <div class="ml-3">
        <p class="text-sm font-medium">
          {{ message }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
