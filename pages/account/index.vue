<script setup lang="ts">
import {useBotsStore} from "~/store/bots";
import {storeToRefs} from "pinia";

const { getBots } = useBotsStore();

const { bots } = storeToRefs(useBotsStore());

await getBots()

</script>

<template>
  <div class="max-w-screen-lg m-auto">
    <div class="flex justify-between items-center pt-8 px-2 sm:px-0 mb-8">
      <h4 class="text-2xl font-bold">
        Chatbots
      </h4>
      <UButton v-if="bots.data?.length" icon="i-tabler-message-circle-plus" to="/account/bots/create" label="Create New Bot" />
    </div>
    <div class="flex gap-4 flex-wrap">
      <bots-card v-if="bots.data?.length" v-for="bot in bots.data" :bot="bot" :key="bot.id"/>
      <div v-if="!bots.data?.length" class="flex flex-col w-full items-center justify-center py-6 gap-3">
        <span class="text-2xl inline-block my-6">Create your first bot 🎉</span>
        <UButton icon="i-tabler-message-circle-plus" to="/account/bots/create" label="Create New Bot" />
      </div>
    </div>
  </div>


</template>

<style scoped></style>
