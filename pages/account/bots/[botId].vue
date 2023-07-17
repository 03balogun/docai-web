<script setup lang="ts">

import {storeToRefs} from "pinia";
import {useBotsStore} from "~/store/bots";
import {useDeleteBot} from "~/composables/useDeleteBot";

const { bot } = storeToRefs(useBotsStore());
const { getBot } = useBotsStore()
const botId = useRoute().params.botId as string

await getBot(botId)

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
    <bots-chat-interface class="flex-1" />
  </div>
</template>

<style scoped>

</style>
