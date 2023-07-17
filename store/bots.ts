import {defineStore} from "pinia";
import {formatError} from "~/utils/helpers";
import {Bot, BotMeta, WebsiteInfo, CreateBotPayload, FormatError, ObjectData} from "~/types/global";
interface BotsState {
    bots: {
        meta?: BotMeta,
        data?: Bot[]
    }
    bot: Bot | null
    isFetchingWebsiteInfo: boolean
    websiteInfo: WebsiteInfo | null
    websiteInfoErrorMessage?: string | null
    websiteInfoErrors?: ObjectData
    createBotErrorMessage?: string
    createBotErrors?: ObjectData | null
    isCreatingBot?: boolean
    isFetchingBot?: boolean
    isAwaitingResponse?: boolean
}

type SendBotMessageResponse = {
    text: string
    sessionId: string
    sourceDocuments: {
        metadata?: {
            title?: string
            url?: string
        }
    }[]
}

export const useBotsStore = defineStore('bots', {
    state: (): BotsState => ({
        bots: {},
        bot: null,
        websiteInfo: null,
        isFetchingWebsiteInfo: false,
        websiteInfoErrorMessage: '',
        isCreatingBot: false,
        createBotErrors: null,
        isAwaitingResponse: false,
    }),
    actions: {
        async getWebsiteInfo(payload: {url: string; sourceType: string}, recaptchaToken: string) {
            this.websiteInfo = null
            this.websiteInfoErrorMessage = null
            this.isFetchingWebsiteInfo = true
            const { data, pending, error} = await useAPIFetch<{data: WebsiteInfo}, {data: FormatError}>('/website-info', {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: {
                    'X-Recaptcha-Token': recaptchaToken,
                }
            })

            this.isFetchingWebsiteInfo = pending.value

            if(data?.value) {
                this.websiteInfo = data.value.data
            }

            if (error.value) {
                const { objectifyErrors, message, errors } = formatError(error.value)

                this.websiteInfoErrors = objectifyErrors
                this.websiteInfoErrorMessage = message
                throw new Error(message)
            }
        },

        async createBot(payload: CreateBotPayload, recaptchaToken?: string) {
            this.createBotErrors = null
            this.createBotErrorMessage = ''
            this.isCreatingBot = true

            const { data, pending, error} = await useAPIFetch<{data: Bot}, {data: FormatError}>('/bots', {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: {
                    'X-Recaptcha-Token': recaptchaToken,
                }
            })

            this.isCreatingBot = pending.value

            if(data?.value) {
                navigateTo(`/account/bots/${data.value.data.id}`)
            }

            if (error.value) {
                const { objectifyErrors, message, errors } = formatError(error.value)

                this.createBotErrors = objectifyErrors
                this.createBotErrorMessage = message
                throw new Error(message)
            }
        },

        async getBots() {
            this.isFetchingBot = true

            const {data, pending, error} = await useAPIFetch<{
                data: {
                    data: Bot[],
                    meta: BotMeta
                }
            }, { data: FormatError }>('/bots')

            this.isFetchingBot = pending.value

            if (data?.value) {
                this.bots = data.value.data
            }

            if (error.value) {
                const {message} = formatError(error.value)

                throw new Error(message)
            }
        },

        async getBot(botId: string) {
            this.isFetchingBot = true

            const {data, pending, error} = await useAPIFetch<{
                data: Bot
            }, { data: FormatError }>(`/bots/${botId}`)

            this.isFetchingBot = pending.value

            if (data?.value) {
                this.bot = data.value.data
            }

            console.log('error', error.value)

            if (error.value) {
                const {message} = formatError(error.value)

                throw new Error(message)
            }
        },

        async deleteBot(botId: string) {
            const {error} = await useAPIFetch<{
                data: {
                    data: Bot[],
                    meta: BotMeta
                }
            }, { data: FormatError }>(`/bots/${botId}`, {
                method: 'DELETE'
            })

            if (!error.value) {
                await this.getBots()
            }

            if (error.value) {
                const {message} = formatError(error.value)

                throw new Error(message)
            }
        },

        async botIntro(botId: string): Promise<string | undefined> {
            this.isAwaitingResponse = true

            const {error, data, pending} = await useAPIFetch<{
                data: {
                    text: string
                }
            }, { data: FormatError }>(`/bots/${botId}/intro`)

            this.isAwaitingResponse = pending.value

            if (!error.value) {
                return data.value?.data.text
            }

            if (error.value) {
                const {message} = formatError(error.value)

                throw new Error(message)
            }
        },

        async sendBotMessage(payload: {message: string; botId: string; sessionId?: string}, recaptchaToken?: string): Promise<SendBotMessageResponse | undefined> {
            this.isAwaitingResponse = true

            const {error, data, pending} = await useAPIFetch<{
                data: SendBotMessageResponse
            }, { data: FormatError }>(`/bots/chat`, {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: {
                    'X-Recaptcha-Token': recaptchaToken,
                }
            })

            this.isAwaitingResponse = pending.value

            if (!error.value) {
                return data.value?.data
            }

            if (error.value) {
                const {message} = formatError(error.value)

                throw new Error(message)
            }
        }
    },
})
