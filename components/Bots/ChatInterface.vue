<script setup lang="ts">
// @ts-ignore
import markdownParser from "@nuxt/content/transformers/markdown";
import {useReCaptcha} from "vue-recaptcha-v3";
import {storeToRefs} from "pinia";
import {useBotsStore} from "~/store/bots";
import {ParsedContent} from "@nuxt/content/dist/runtime/types";

const botId = useRoute().params.botId as string

const isBotScreen = useRoute().path.includes('/bots/')

const {
  bot,
  isAwaitingResponse
} = storeToRefs(useBotsStore());

const { getBot, botIntro, sendBotMessage } = useBotsStore()

if (!bot.value?.id) {
  await getBot(botId)
}

const recaptchaInstance = useReCaptcha();

const messages = ref<{
  message?: ParsedContent
  sources?: {[k: string]: string | any}[]
  from?: string
}[]>([])

const message = ref('')

const isTraining = ref(false)

const checkTrainingStatus = async () => {
  if (!bot.value?.training_complete) {
    isTraining.value = true
    // keep checking if training is complete
    const interval = setInterval(async () => {
      await getBot(botId)
      if (bot.value?.training_failed) {
        isTraining.value = false
        clearInterval(interval)
        navigateTo('/account')
        // wait for page to load
        setTimeout(() => {
          useNuxtApp().$toast.error('Bot training failed, please try again.')
        }, 1000)
        return
      }
      if (bot.value?.training_complete) {
        isTraining.value = false
        clearInterval(interval)
        await getIntroMessage()
      }
    }, 5000)
  }
}

const getIntroMessage = async () => {
  const introMessage = await botIntro(botId)

  if (!isAwaitingResponse && !introMessage) {
    useNuxtApp().$toast.error('Bot is offline, please refresh the page to try again. If error persists, please contact support.')
  }

  if (introMessage) {
    messages.value.push({
      message: await markdownParser?.parse?.(
          Date.now().toString(),
          introMessage,
          {}
      )
    })
  }
}

onMounted( () => {
  checkTrainingStatus()

  setTimeout(() => {
    getIntroMessage()
  }, 1000)
})

const sessionId = ref('')

const isShareModalOpen = ref(false)

const shareLink = computed(() => {
  return `${window.location.origin}/chat/${botId}`
})

const onCopyLink = () => {
  navigator.clipboard.writeText(shareLink.value)
  useNuxtApp().$toast.success('Link copied to clipboard!')
  isShareModalOpen.value = false
}

const addMessage = async () => {

  if (isAwaitingResponse?.value) {
    return useNuxtApp().$toast.error('Please wait for the bot to respond before sending another message.')
  }

  if (!message.value) return

  messages.value.push({
    message: await markdownParser?.parse?.(
        Date.now().toString(),
        message.value,
            {}
    ),
    from: 'user'
  })

  const userMessage = message.value

  message.value = ''

  const chatBody = document.querySelector('#chat-body')

  if (chatBody) {
    chatBody.scrollTop = chatBody.scrollHeight
  }

  const token = await useRecaptchaToken('fetchWebsiteInfo', recaptchaInstance)

  await useNuxtApp().$toast.promise(
      sendBotMessage({
        botId,
        message: userMessage,
        sessionId: sessionId.value
      }, token).then(async (response) => {

        if (response) {
          sessionId.value = response.sessionId

          messages.value.push({
            message: await markdownParser?.parse?.(
                Date.now().toString(),
                response.text,
                {}
            ),
            sources: response.sourceDocuments,
            from: 'bot'
          })
          // scroll to chat body bottom

          if (chatBody) {
            chatBody.scrollTop = chatBody.scrollHeight
          }
        }
      }),
      {
        pending: 'Awaiting response...',
        success: 'Message sent!',
        error: 'Failed to send message'
      }
  )
}

</script>

<template>
  <div v-if="isTraining" class="absolute z-[999] bg-gray-800 top-0 bottom-0 left-0 right-0 w-full flex items-center justify-center">
    <div class="w-1/2 opacity-100">
      <div class="flex items-center justify-center">
        <div class="w-16 h-16 rounded-full bg-primary-200 flex items-center justify-center">
          <i class="i-tabler-robot text-3xl text-primary-500"></i>
        </div>
      </div>
      <div class="mt-5 text-center">
        <h1 class="text-2xl font-bold text-white dark:text-gray-100">Bot is training</h1>
        <p class="my-3">
            <span class="text-1xl inline-block sentence-case text-white">
              <UBadge :color="bot?.training_complete ? 'primary' : 'orange'">{{
                  bot?.training_complete ? 'Completed' : 'Pending'
                }}</UBadge> <span>({{ bot?.trained_docs }} of {{ bot?.total_docs }})</span>
            </span>
        </p>
        <p class="mt-2 text-sm text-white dark:text-gray-400">Please wait while we train your bot. This may take a few minutes.</p>
        <div>
          <UButton to="/accounts" size="lg" class="mt-5" label="Go Back" variant="link" color="primary" />
        </div>
      </div>
    </div>
  </div>

  <main class="md:ml-64 pt-2 mb-20" id="chat-body">

    <div class="py-3 pb-5 px-3 border-b border-gray-100 left-0 sm:left-auto justify-between flex items-center fixed z-10 bg-white dark:bg-black max-w-screen-md w-full"
         :class="{'top-0': !isBotScreen }">
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
      <div class="flex items-center justify-end">
        <UButton v-if="isBotScreen" @click="isShareModalOpen = true" size="sm" class="rounded-full" label="Share" icon="i-tabler-share" variant="ghost" color="gray" />
        <UButton v-else size="sm" class="rounded-full" label="Create your own" to="/account" icon="i-tabler-message-plus" variant="ghost" color="gray" />
      </div>
    </div>

    <!--  Chat body    -->
    <div class="mb-15 overflow-y-auto relative max-w-screen-md w-full flex flex-col justify-end gap-6" :class="{'bot-chat-interface': isBotScreen, 'chat-interface': !isBotScreen}">
      <div v-for="{message, from, sources} in messages">
        <div class="bottom-0 right-0 relative mx-auto bg-blue-500 text-white p-4 rounded-lg shadow-md" :class="{'bg-primary-500': from === 'user'}">
          <ContentRenderer
              :class="{'text-white': from === 'user'}"
              class="[&>p]:my-3
                [&>p]:text-sm
                [&>ul]:text-sm
                [&>ul]:mt-4
                [&>ul]:list-disc
                [&>ul]:pl-8
                [&>ul>li]:text-sm
                [&>ul>li]:my-2
                [&>ul>li]:hover:text-underlined
                [&>ul>li]:cursor-pointer
                [&>ol]:text-sm
                [&>ol]:mt-4
                [&>ol]:list-disc
                [&>ol]:pl-8
                [&>ol>li]:text-sm
                [&>ol>li]:my-2
                [&>ol>li]:hover:text-underlined
                [&>ol>li]:cursor-pointer"
              :value="message" />
          <div :class="from === 'user' ? 'bg-primary-500 right-2' : 'left-2'" class="absolute w-4 h-4 bg-blue-500 transform rotate-45 bottom-0"></div>
        </div>
        <div v-if="sources?.length && bot?.data_type === 'website'" class="my-2">
          <span class="text-sm italic">Sources:</span>
          <ul>
            <UAccordion color="primary" :items="sources.map((source) => {
                return {
                  label: source.metadata.title,
                  content: source.pageContent,
                  color: from === 'user' ? 'green' : 'blue'
                }
              })">
              <template #item="{item}">
                <UButton
                    :to="item?.metadata?.url"
                    :label="item?.title"
                    color="blue"
                    target="_blank"
                    variant="link"
                    size="sm"
                />
                <span>{{ item?.content }}</span>
              </template>
            </UAccordion>
          </ul>
        </div>
        <div v-if="sources?.length && bot?.data_type === 'documents'" class="my-2">
          <span class="text-sm italic">Sources:</span>
          <ul>
            <UAccordion color="primary" :items="sources.map((source) => {
                return {
                  label: `Page: ${source.metadata?.loc?.pageNumber} - Line: ${source.metadata?.loc?.lines?.from} - ${source.metadata?.loc?.lines?.to}`,
                  content: source.pageContent,
                  color: from === 'user' ? 'green' : 'blue'
                }
              })">
              <template #item="{item}">
                <UButton
                    :to="item?.metadata?.url"
                    :label="item?.title"
                    color="blue"
                    target="_blank"
                    variant="link"
                    size="sm"
                />
                <span>{{ item?.content }}</span>
              </template>
            </UAccordion>
          </ul>
        </div>
      </div>
      <div v-if="isAwaitingResponse" class="">
        <div class="bottom-0 relative right-0 mx-auto bg-blue-500 text-white p-4 rounded-lg shadow-md">
          <p>Please wait...</p>
          <div class="absolute w-4 h-4 bg-blue-500 transform rotate-45 bottom-0 left-2"></div>
        </div>
      </div>
    </div>

    <form @submit.prevent="addMessage" class="fixed bottom-0 w-full max-w-screen-md p-4 bg-gray-100 rounded left-0 right-0 sm:left-auto sm:right-auto">
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

  <UModal v-model="isShareModalOpen">
    <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Share</h3>
      </template>

      <UFormGroup help="" class="">
        <UInput disabled size="lg" class="min-w-screen-md w-full" id="bot-link" :value="shareLink">
          <template #trailing>
            <div class="pointer-events-auto">
              <UButton @click="onCopyLink" size="sm" class="rounded-full" label="Copy" icon="i-tabler-copy" variant="soft" color="primary" />
            </div>
          </template>
        </UInput>
      </UFormGroup>
    </UCard>
  </UModal>
</template>

<style scoped>

</style>
