<script setup lang="ts">
import {Bot} from '~/types/global'
import {useDeleteBot} from "~/composables/useDeleteBot";

const {bot} = defineProps<{bot: Bot}>()

const formatDate = (dateVal: string) => new Date(dateVal).toLocaleDateString()

const isDeletingBot = ref(false)

const handleDeleteBot = async () => {
  isDeletingBot.value = true
  await useDeleteBot(bot)
  isDeletingBot.value = false
}

</script>

<template>
  <UCard class="w-full sm:w-auto">
    <template #header>
      <div class="flex items-center mb-2">
        <div>
          <img class="rounded-full border-b border-green:500" width="48" height="48" :alt="bot.name"
               :src="`https://api.dicebear.com/6.x/personas/svg?seed=${bot.name}`" crossorigin="anonymous"/>
        </div>
        <div class="ml-3">
          <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ bot.name }}</h4>
          <p class="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[300px]">{{ bot.description }}</p>
        </div>
      </div>
    </template>

    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-5">
        <div class="flex gap-5">
          <div class="flex flex-col">
            <span class="text-xs inline-block">Data source</span>
            <span class="text-sm inline-block sentence-case text-primary-800">{{ bot.data_type }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs inline-block">Training Status</span>
            <span class="text-sm inline-block sentence-case text-primary-800">
              <UBadge :color="bot.training_complete ? 'primary' : 'orange'">{{
                  bot.training_complete ? 'Completed' : 'Pending'
                }}</UBadge> <span class="text-xs">({{ bot.trained_docs }} of {{ bot.total_docs }})</span>
            </span>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-5">
        <div class="flex gap-5">
          <div class="flex flex-col">
            <span class="text-xs inline-block">Created created</span>
            <span class="text-sm inline-block sentence-case text-primary-800">{{ formatDate(bot.created_at)  }}</span>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between gap-3">
        <UTooltip text="Delete bot">
          <UButton :loading="isDeletingBot" variant="ghost" color="red" icon="i-tabler-trash" @click="handleDeleteBot" />
        </UTooltip>
        <UButton :disabled="isDeletingBot" icon="i-tabler-play" :to="`/account/bots/${bot.id}`" label="View"/>
      </div>
    </template>
  </UCard>
</template>

<style scoped>

</style>
