<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useBotsStore} from "~/store/bots";
import {useReCaptcha} from "vue-recaptcha-v3";
import {useDeleteBot} from "~/composables/useDeleteBot";

const {
  bot,
  isFetchingBot
} = storeToRefs(useBotsStore());


const messages = ref<{ message: string }[]>([])

const message = ref('')

const botId = useRoute().params.botId as string

const { getBot } = useBotsStore()

await getBot(botId)


const addMessage = () => {
  if (!message.value) return

  messages.value.push({
    message: message.value
  })

  message.value = ''
}

const handleDeleteBot = async () => {
  if (!bot?.value) return

  await useDeleteBot(bot.value)

  await navigateTo('/account')
}

</script>

<template>
  <div class="max-w-screen-lg flex flex-col justify-between mx-auto relative">
    <aside class="fixed top-0 w-64 h-screen pt-24 transition-transform bg-white border-l border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700 -translate-x-full">
      <div class="overflow-y-auto py-5 h-full bg-white dark:bg-gray-80 pt-20">
        <ul class="space-y-2">
          <li>
            <UButton size="lg" class="rounded-0 w-full" :class="{'bg-gray-50 text-gray-900': false}"  label="Try & Share" icon="i-tabler-message-2-bolt" variant="ghost" color="gray" />
          </li>
          <li>
            <UButton size="lg" class="w-full" label="Integration" icon="i-tabler-device-desktop-code" variant="ghost" color="gray" />
          </li>
          <li>
            <UButton size="lg" class="w-full" label="Data Source" icon="i-tabler-database-cog" variant="ghost" color="gray" />
          </li>
          <li>
            <span class="text-sm mt-5 capitalize text-gray-400 text-center inline-block pl-4">MORE</span>
          </li>
          <li>
            <UButton size="lg" class="w-full" label="Analytics" icon="i-tabler-device-analytics" variant="ghost" color="gray" />
          </li>
          <li>
            <UButton size="lg" class="w-full" label="Settings" icon="i-tabler-settings" variant="ghost" color="gray" />
          </li>
          <li>
            <UButton @click="handleDeleteBot" size="lg" class="w-full" label="Delete" icon="i-tabler-trash" variant="ghost" color="red" />
          </li>
        </ul>
      </div>
    </aside>
    <main class="md:ml-64 pt-2 mb-20">
      <!--  Chat header    -->
      <div class="py-3 px-3 border-b border-gray-100 items-center fixed z-10 bg-white dark:bg-black max-w-screen-md w-full">
        <div class="flex items-center mb-2">
          <div>
            <img class="rounded-full border-b border-green:500" width="48" height="48" :alt="bot?.name"
                 :src="`https://api.dicebear.com/6.x/personas/svg?seed=${bot?.name}`" crossorigin="anonymous"/>
          </div>
          <div class="ml-3">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ bot?.name }}</h4>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[300px]">{{ bot?.description }}</p>
          </div>
        </div>
      </div>

      <!--  Chat body    -->
      <div class="mb-15 overflow-y-auto relative max-w-screen-md w-full chat-interface flex flex-col justify-end gap-6">
        <div v-for="{message} in messages" class="">
          <div class="bottom-0 right-0 relative mx-auto bg-blue-500 text-white p-4 rounded-lg shadow-md">
            <p>{{message}}</p>
            <div class="absolute w-4 h-4 bg-blue-500 transform rotate-45 bottom-0 left-2"></div>
          </div>
        </div>
        <div class="">
          <div class="bottom-0 relative right-0 mx-auto bg-blue-500 text-white p-4 rounded-lg shadow-md">
            <p>Hello! This is a chat bubble.</p>
            <div class="absolute w-4 h-4 bg-blue-500 transform rotate-45 bottom-0 left-2"></div>
          </div>
        </div>
      </div>

      <form @submit.prevent="addMessage" class="fixed bottom-3 w-full max-w-screen-md p-4 bg-gray-100 rounded left-0 right-0 sm:left-auto sm:right-auto">
        <UFormGroup help="Message history will cleared after some period of inactivity." class="">
          <UInput v-model="message" size="lg" class="min-w-screen-md w-full" placeholder="Type your message...">
            <template #trailing>
              <div class="pointer-events-auto">
                <UButton :disabled="!message" type="submit" size="sm" class="rounded-full" label="Send" icon="i-tabler-send" variant="ghost" color="primary" />
              </div>
            </template>
          </UInput>
        </UFormGroup>
      </form>
    </main>


  </div>
</template>

<style scoped>


</style>
