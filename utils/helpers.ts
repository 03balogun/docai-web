import {ErrorType, FormatError, FormatErrorType, ObjectData} from "~/types/global";



export const formatError = (errorPayload: {data: FormatError}): FormatErrorType  => {
    let errors: string[] = []
    if(errorPayload.data?.errors) {
        // regex to uppercase first letter of a word
        const objectifyErrors = errorPayload.data.errors.reduce((acc: ObjectData, error: ErrorType) => {
            acc[error.field] = error.message
            return acc
        }, {})

        return {message: '', errors, objectifyErrors}
    }

    return {message: errorPayload?.data.message, errors}
}

