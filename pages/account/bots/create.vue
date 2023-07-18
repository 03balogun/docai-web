<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useBotsStore} from "~/store/bots";
import {useRecaptchaToken} from "~/composables/useRecaptchaToken";
import {useReCaptcha} from "vue-recaptcha-v3";
const recaptchaInstance = useReCaptcha();

const { getWebsiteInfo, createBot } = useBotsStore();

const {
  isFetchingWebsiteInfo,
  websiteInfo,
  websiteInfoErrorMessage,
  createBotErrorMessage,
  isCreatingBot,
  createBotErrors
} = storeToRefs(useBotsStore());

useSeoMeta({
  title: 'Create a new chatbot'
})

const currentStep = ref(1)

const selectedLinks = ref([])

const formData = ref({
  name: '',
  description: '',
  dataType: '',
  linkType: 'multiple',
  baseUrl: '',
  urls: [],
  websiteInfo: {
    title: '',
    description: '',
    icon: '',
    links: []
  }
})

const fieldErrors = ref({
  name: '',
  description: '',
  dataType: '',
  hasMultipleLinks: '',
  baseUrl: '',
  urls: '',
  linkType: ''
})

const selectedDataType = ref({
  id: 'website',
  label: '',
})

const dataTypeOptions = [
  {id: 'website', label: 'Website'},
  {id: 'documents', label: 'Documents'},
]

watch(selectedDataType, (newValue) => {
  formData.value.dataType = newValue.id
})

const isValidForm1 = computed(() => {
  return !!formData.value.name && !!formData.value.description && !!formData.value.dataType
})

const websiteInfoTableColumn = [
  {
    key: 'link',
    label: 'Links'
  }
]

const websiteInfoTableData = computed(() => {
  return websiteInfo?.value?.links?.map((link) => {
    return {
      link: link
    }
  })
})

const fetchWebsiteInfo = async () => {
  const token = await useRecaptchaToken('fetchWebsiteInfo', recaptchaInstance)

  if (!token) {
    useNuxtApp().$toast.error('Please verify that you are not a robot.')
    return
  }

  if (!formData.value.baseUrl) {
    useNuxtApp().$toast.error('Please enter a valid URL.')
    return
  }

  await useNuxtApp().$toast.promise(
      getWebsiteInfo({url: formData.value.baseUrl, sourceType: formData.value.linkType}, token),
      {
        pending: 'Fetching website info...',
        error: {
          render({data}) {
            return h('div', data.message || 'An error occurred while fetching website info.')
          },
        },
        success: 'Successfully fetched website info.',
      })
}

const onBotSubmitted = async () => {

  if (currentStep.value === 1 && !isValidForm1.value) {
    fieldErrors.value.name = !formData.value.name ? 'Name is required' : ''
    fieldErrors.value.description = !formData.value.description ? 'Description is required' : ''
    fieldErrors.value.dataType = !formData.value.dataType ? 'Data source is required' : ''
    return
  }

  if (currentStep.value === 1) {
    currentStep.value = 2
    return
  }

  if (formData.value.dataType === 'website'){
    if (!websiteInfo.value?.links){
      return await fetchWebsiteInfo()
    }

    if (!selectedLinks.value.length) {
      return useNuxtApp().$toast.error('Please select at least one link.')
    }
  }

  const fileInput = window.document.getElementById('upload-document') as HTMLInputElement

  const isDocument = formData.value.dataType === 'documents'

  if (isDocument && !fileInput?.files?.length) {
    return useNuxtApp().$toast.error('Please upload at least one file.')
  }

  const token = await useRecaptchaToken('onBotSubmitted', recaptchaInstance)

  if (!token) {
    useNuxtApp().$toast.error('Please verify that you are not a robot.')
    return
  }

  useNuxtApp().$toast.promise(
      createBot({
            name: formData.value.name,
            description: formData.value.description,
            dataType: formData.value.dataType,
            urls: selectedLinks.value.map(({link}) => link),
            files: isDocument && fileInput?.files?.length ? fileInput?.files : undefined
          },
          token
      ),
      {
        pending: 'Creating bot...',
        error: {
          render({data}) {
            return h('div', data.message || 'An error occurred while creating bot.')
          },
        },
        success: 'Successfully created bot.',
      },
  );
}


const errorMessage = computed(() => {
  if (websiteInfoErrorMessage?.value) {
    return websiteInfoErrorMessage.value
  }

  if (createBotErrorMessage?.value) {
    return createBotErrorMessage.value
  }

  return ''
})


</script>

<template>
  <div class="max-w-screen-lg flex flex-col justify-between mx-auto pt-8">
    <div class="flex justify-start items-center mb-6">
      <UButton size="sm" to="/account/" icon="i-tabler-circle-arrow-left" label="back" variant="soft" />
    </div>
    <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
      Create a new chatbot
    </h1>
    <div class="max-w-md">
      <div class="m-auto w-full mt-8">
        <ol class="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base">
          <li class="flex md:w-full items-center sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700"
              :class="{'after:text-gray-200 dark:after:text-gray-500': currentStep !== 1, 'text-primary-600 dark:text-primary-500': currentStep === 1}"
          >
        <span
            class="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-red-200 dark:after:text-gray-500">
            <svg v-if="currentStep === 1" aria-hidden="true" class="w-4 h-4 mr-2 sm:w-5 sm:h-5" fill="currentColor"
                 viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd"
                                                                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                                              clip-rule="evenodd"></path></svg>
            <span v-if="currentStep !== 1" class="mr-2">1</span>
            Personal <span class="hidden sm:inline-flex sm:ml-2">Info</span>
        </span>
          </li>

          <li class="flex items-center after:mx-2"
              :class="{'after:text-gray-200 dark:after:text-gray-500': currentStep !== 2, 'text-primary-600 dark:text-primary-500': currentStep === 2}"
          >
            <svg v-if="currentStep === 2" aria-hidden="true" class="w-4 h-4 mr-2 sm:w-5 sm:h-5" fill="currentColor"
                 viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"></path>
            </svg>
            <span v-if="currentStep !== 2" class="mr-2">2</span>
            Data <span class="hidden sm:inline-flex sm:ml-2">source</span>
          </li>
        </ol>
      </div>
      <form class="space-y-8 md:space-y-6 mt-4" @submit.prevent="onBotSubmitted">

        <app-alert type="error" v-if="errorMessage" :message="errorMessage" />

        <div v-if="createBotErrors" class="bg-red-50 text-red-500 mt-6 p-3 rounded border-red-500">
          <ul class="list-disc pl-5">
            <li class="sentence-case" v-for="(error) in createBotErrors">{{error}}</li>
          </ul>
        </div>

        <!--        STEP 1 -->
        <template v-if="currentStep === 1">
          <UFormGroup name="name" label="Name" :error="formData.name && fieldErrors.name">
            <UInput v-model="formData.name" placeholder="e.g. [Document/Website] Name" required/>
          </UFormGroup>

          <UFormGroup name="description" label="Description" :error="!formData.description && fieldErrors.description">
            <UTextarea id="description" v-model="formData.description" placeholder="This bot will help you to..." />
          </UFormGroup>

          <UFormGroup name="dataType" label="Data source" :error="!formData.dataType && fieldErrors.dataType">
            <USelectMenu v-model="selectedDataType" :options="dataTypeOptions" required>
              <template #label>
                <span v-if="formData.dataType" class="truncate text-[12px]">{{ selectedDataType.label }}</span>
                <span class="text-gray-400" v-else>Select a data source...</span>
              </template>
            </USelectMenu>
          </UFormGroup>

          <div class="flex justify-end">
            <UButton type="submit" variant="solid">Next: configure data source</UButton>
          </div>
        </template>

        <!-- STEP 2 -->
        <template v-if="currentStep === 2">
          <template v-if="selectedDataType.id === 'website'">

            <UFormGroup class="w-full" name="website" label="Website URL" :error="!formData.baseUrl && fieldErrors.baseUrl">
              <div class="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div class="flex-1">
                  <UInput id="website" :loading="isFetchingWebsiteInfo" v-model="formData.baseUrl" placeholder="e.g. https://xyz.com" required />
                </div>
                <UButton :disabled="isFetchingWebsiteInfo" @click="()=> fetchWebsiteInfo()" type="button" label="Fetch links" color="primary" variant="outline"  />
              </div>
            </UFormGroup>

            <UCard v-if="websiteInfo">
              <template #header>
                <div class="flex items-center mb-2">
                  <div>
                    <UAvatar :alt="formData.name" :src="websiteInfo.icon" />
                  </div>
                  <div class="ml-3">
                    <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ websiteInfo.title }}</h4>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ websiteInfo.description }}</p>
                  </div>
                </div>
              </template>
              <template v-if="websiteInfoTableData?.length">
                <h4 class="text-md text-gray-600">{{selectedLinks.length}} of {{websiteInfoTableData.length}} Links selected</h4>
                <div class="max-h-[400px] overflow-y-auto">
                  <UTable
                      :loading="isFetchingWebsiteInfo"
                      v-model="selectedLinks"
                      :columns="websiteInfoTableData.length ? websiteInfoTableColumn : undefined"
                      :rows="websiteInfoTableData"
                      :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading link details...' }"
                      :ui="{ td: { base: 'truncate'} }"
                  />
                </div>
              </template>
            </UCard>

          </template>
          <template v-if="selectedDataType.id === 'documents'">
            <UFormGroup class="w-full" help="You can't only upload pdf, doc, docx, and txt file - Max of 5 files." name="upload-document" label="Upload document" :error="!formData.baseUrl && fieldErrors.baseUrl">
              <div class="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div class="flex-1">
                  <UInput
                      type="file"
                      id="upload-document"
                      :loading="isFetchingWebsiteInfo"
                      accept=".pdf,.docx,.doc,.txt"
                      max="5"
                      multiple
                      required
                  />
                </div>
              </div>
            </UFormGroup>
          </template>

          <div class="flex justify-between mt-20">
            <UButton :disabled="isCreatingBot" type="button" variant="outline" @click="currentStep--">Back</UButton>
            <UButton :loading="isCreatingBot" type="submit" variant="solid">Submit & Train bot</UButton>
          </div>
        </template>

      </form>
    </div>
  </div>
</template>

<style scoped></style>
