<script setup lang="ts">

const formData = ref({
  email: '',
})

</script>

<template>
  <section class="bg-gray-50 dark:bg-gray-900">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div class="mb-6">
        <app-logo/>
      </div>
      <div class="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
        <h1 class="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          Forgot your password?
        </h1>
        <p class="font-light text-gray-500 dark:text-gray-400">Don't fret! Just type in your email and we will send you a code to reset your password!</p>
        <form class="mt-4 space-y-4 lg:mt-5 md:space-y-5" action="#">

          <UFormGroup class="my-4" name="email" label="Your email">
            <UInput class="w-full" type="email" block v-model="formData.email" placeholder="e.g. username@domain.com" required/>
          </UFormGroup>

          <UButton type="submit"  block>Reset password</UButton>

          <p class="text-sm font-light text-gray-500 dark:text-gray-400">
            Remember your password? <nuxt-link to="/auth/login" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign In</nuxt-link>
          </p>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>
