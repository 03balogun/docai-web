<script setup lang="ts">
import {useAuthStore} from "~/store/auth";
import {storeToRefs} from "pinia";
import {useRecaptchaToken} from "~/composables/useRecaptchaToken";
import {useReCaptcha} from "vue-recaptcha-v3";
const {signUpUser} = useAuthStore();
const {isSigningUp, registrationFieldErrors, registrationErrorMessage} = storeToRefs(useAuthStore());
const recaptchaInstance = useReCaptcha();

const formData = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const showPassword = ref(false)

const register = async () => {
  const token = await useRecaptchaToken('login', recaptchaInstance)

  useNuxtApp().$toast.promise(
      signUpUser(formData.value, token),
      {
        pending: 'Signing up...',
        error: {
          render({data}) {
            return h('div', data.message || 'An error occurred while creating your account.')
          },
        },
        success: 'Successfully signup. Redirecting...',
      },
  );
}

</script>

<template>
  <section class="bg-gray-50 h-screen w-screen dark:bg-gray-900">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div class="mb-6">
        <app-logo/>
      </div>
      <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Sign up for an account
          </h1>

          <app-alert color="error" outlined type="error" light v-if="registrationErrorMessage" :message="registrationErrorMessage" />

          <form @submit.prevent="register">

            <UFormGroup name="name" label="Name" :error="registrationFieldErrors?.name as string">
              <UInput class="w-full" block v-model="formData.name" placeholder="e.g. Thomas Kweku" required/>
            </UFormGroup>

            <UFormGroup class="my-4" name="email" label="Your email" :error="registrationFieldErrors?.email as string">
              <UInput class="w-full" type="email" block v-model="formData.email" placeholder="e.g. username@domain.com" required/>
            </UFormGroup>

            <UFormGroup name="password" label="Password" :error="registrationFieldErrors?.password as string">
              <UInput
                  class="w-full"
                  :type="showPassword ? 'text': 'password'"
                  block
                  v-model="formData.password"
                  :placeholder="showPassword ? 'password' : '••••••••'"
                  required
              >
                <template #trailing>
                  <div class="pointer-events-auto">
                    <UButton
                        @click="showPassword = !showPassword"
                        :icon="showPassword ? 'i-heroicons-eye-slash': 'i-heroicons-eye'"
                        aria-label="show password"
                        variant="link"
                        size="sm"
                        color="gray"
                        type="button"
                    />
                  </div>
                </template>
              </UInput>
            </UFormGroup>


            <div class="flex items-center justify-between my-4">
              <div class="flex items-center">
                <input checked id="remember" aria-describedby="remember" required type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
              </div>
              <div class="ml-3 text-sm">
                <label for="remember" class="text-gray-500 dark:text-gray-300">By signing up, you agree to HavenAI’s <nuxt-link to="/" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Terms of Use</nuxt-link> and <nuxt-link to="/" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Privacy Policy</nuxt-link>.
                </label>
              </div>
            </div>


            <UButton :loading="isSigningUp" block class="block w-full my-4" color="primary" type="submit">
              {{ isSigningUp ? 'Please wait...' : 'Sign up' }}
            </UButton>

            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              Already have an account? <nuxt-link to="/auth/login" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign In</nuxt-link>
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>
