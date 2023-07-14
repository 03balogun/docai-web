<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useAuthStore} from "~/store/auth";
import {useRecaptchaToken} from "~/composables/useRecaptchaToken";
const { user } = storeToRefs(useAuthStore());


const avatar = `https://api.dicebear.com/6.x/personas/svg?seed=${user.value?.name}`

const signOut = async () => {
  const confirmed = confirm('Are you sure you want to sign out?')

  if(confirmed) {
    const token = await useRecaptchaToken('sign-out')

    await useAuthStore().signOut(token);
  }
}

const menuItems = [
  [{
    label: user?.value?.name || 'My Profile',
    avatar: {
      src: avatar,
      alt: user?.value?.name,
      crossorigin: "anonymous"
    }
  }],
  [
      {
    label: 'Home',
    icon: 'i-tabler-home',
    to: '/account'
  },{
    label: 'My Chatbots',
    icon: 'i-tabler-message-cog',
    to: '/account'
  }, {
    label: 'Billing',
    icon: 'i-heroicons-credit-card',
    click: () => {
      console.log('Edit')
    }
  }],
  [{
    label: 'Logout',
    icon: 'i-heroicons-arrow-left-on-rectangle text-red-500',
    class: 'text-red-500 bg-red-50 hover:bg-red-100',
    click: () => {
      signOut()
    }
  }]
]

</script>

<template>
  <div class="w-full fixed z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
    <nav class="bg-white border-gray-200 dark:bg-gray-900">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div class="flex items-center">
          <app-logo />
        </div>
        <div class="flex items-center md:order-2">
          <UDropdown label="My Profile" :items="menuItems" :popper="{ placement: 'auto' }">
            <div class="flex rounded-full p-1">
<!--              <UAvatar size="sm" :src="avatar" :alt="user?.name" crossorigin="anonymous"/>-->
              <img class="rounded-full border-4 border-gray-200 hover:border-green-200" width="48" height="48" :src="avatar" :alt="user?.name" crossorigin="anonymous"/>
            </div>
          </UDropdown>
        </div>
        <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="mobile-menu-2">
<!--          <ul class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">-->
<!--            <li>-->
<!--              <a href="#" class="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Chatbots</a>-->
<!--            </li>-->
<!--          </ul>-->
        </div>
      </div>
    </nav>
  </div>
</template>

<style scoped>

</style>
