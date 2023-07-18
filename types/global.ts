export type User = {
    id: string
    name: string
    email: string
    username: any
    provider: any
    token: string
}

export type ObjectData = { [key: string]: string | boolean | number | null | undefined }

export enum AlertType {
    INFO = 'info',
    SUCCESS = 'success',
    WARNING = 'warning',
    ERROR = 'error',
}

export type FormatErrorType = {
    message?: string;
    errors?: string[],
    objectifyErrors?: ObjectData
}

export type ErrorType = {
    rule: string
    field: string
    message: string
}

export type FormatError = {
    errors?: Array<ErrorType>
    message?: string
}

export type Bot = {
    id: string
    user_id: string
    name: string
    description: string
    avatar: string
    data_type: string
    created_at: string
    updated_at: string
    documents: Array<{
        id: string
        bot_id: string
        type: string
        name: string
        training_status: string
        created_at: string
        updated_at: string
    }>
    training_complete: boolean
    training_failed: boolean
    total_docs: number
    trained_docs: number
}

export type BotMeta = {
    total: number
    per_page: number
    current_page: number
    last_page: number
    first_page: number
    first_page_url: string
    last_page_url: string
    next_page_url: any
    previous_page_url: any
}

export type WebsiteInfo = {
    title: string
    description: string
    icon: string
    links: Array<string>
}

export type CreateBotPayload = {
    name: string
    description: string
    dataType: string
    urls?: Array<string>
    files?: FileList
    avatar?: string
}
