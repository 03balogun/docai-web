<script setup lang="ts">
const props = defineProps({
  class: {
    type: String,
  }
})
</script>
<template>
  <nuxt-link to="/auth/login" class="flex items-center text-2xl font-semibold text-gray-900 dark:text-white" :class="props.class">
    <img class="w-8 h-8 mr-2" src="/logo.svg" alt="logo">
  </nuxt-link>
</template>
