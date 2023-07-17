<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useAuthStore} from "~/store/auth";
import {useRecaptchaToken} from "~/composables/useRecaptchaToken";
import AppAlert from "~/components/AppAlert.vue";
import {useReCaptcha} from "vue-recaptcha-v3";

const {authenticateUser} = useAuthStore();
const {isAuthenticating, loginErrorMessage} = storeToRefs(useAuthStore());
const recaptchaInstance = useReCaptcha();



const formData = ref({
  email: '',
  password: '',
})

const showPassword = ref(false)

const login = async () => {

  const token = await useRecaptchaToken('login', recaptchaInstance)

  if (!token) {
    useNuxtApp().$toast.error('Please verify that you are not a robot.')
    return
  }

  useNuxtApp().$toast.promise(
      authenticateUser(formData.value, token),
      {
        pending: 'Authenticating...',
        error: {
          render({data}) {
            return h('div', data.message || 'An error occurred while authenticating.')
          },
        },
        success: 'Successfully authenticated. Redirecting...',
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
      <div
          class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Sign in to your account
          </h1>

          <app-alert type="error" v-if="loginErrorMessage" :message="loginErrorMessage" />

          <form class="space-y-8 md:space-y-6" @submit.prevent="login">
            <UFormGroup name="email" label="Your email">
              <UInput class="w-full" type="email" block v-model="formData.email" placeholder="e.g. username@domain.com" required/>
            </UFormGroup>

              <UFormGroup name="password" label="Password">
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

            <div class="flex items-center justify-end my-4">
              <nuxt-link to="/auth/forgot-password" class="text-sm font-medium text-primary-600 hover:underline dark:text-white">Forgot password?</nuxt-link>
            </div>

            <UButton :disabled="isAuthenticating" :loading="isAuthenticating" block class="block w-full" color="primary" type="submit">
              {{ isAuthenticating ? 'Please wait...' : 'Sign in' }}
            </UButton>


            <p class="text-sm font-light text-gray-500 dark:text-gray-400 mt-5">
              Don’t have an account yet?
              <nuxt-link to="/auth/register" class="font-medium text-primary-600 hover:underline dark:text-primary-500">
                Sign up
              </nuxt-link>
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>
