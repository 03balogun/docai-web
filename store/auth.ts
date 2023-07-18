import {defineStore} from "pinia";
import {FormatError, ObjectData, User} from "~/types/global";
import {formatError} from "~/utils/helpers";

interface AuthState {
    user: User | null;
    token: string | null;
    authenticated: boolean;
    isAuthenticating: boolean;
    isSigningUp: boolean;
    registrationFieldErrors?: ObjectData
    registrationErrorMessage?: string
    loginErrorMessage?: string
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        user: null,
        token: null,
        authenticated: false,
        isAuthenticating: false,
        isSigningUp: false,
        registrationFieldErrors: {},
        registrationErrorMessage: '',
        loginErrorMessage: '',
    }),
    actions: {
        async authenticateUser(payload: { email: string; password: string }, recaptchaToken: string) {
            this.loginErrorMessage = ''
            const {data, pending, error} = await useAPIFetch<
                User,
                { data: FormatError }>('/auth/login', {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: {
                    'X-Recaptcha-Token': recaptchaToken,
                }
            })
            this.isAuthenticating = pending.value

            if (data?.value && data?.value?.token) {
                this.authenticated = true
                this.user = data.value
                this.token = data.value.token
                navigateTo('/account')
            }

            if (error.value) {
                const {message} = formatError(error.value)
                this.loginErrorMessage = message
                throw new Error(message)
            }
        },
        async signUpUser(payload: {email: string; password: string; name: string}, recaptchaToken?: string) {

            this.registrationFieldErrors = {}
            this.registrationErrorMessage = ''
            const { data, pending, error} = await useAPIFetch<User, { data: FormatError }>('/auth/register', {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: {
                    'X-Recaptcha-Token': recaptchaToken,
                }
            })

            this.isSigningUp = pending.value

            if(data?.value && data?.value?.token) {
                this.authenticated = true
                this.user = data.value
                this.token = data.value.token
                // TODO: Redirect to account confirmation page
                navigateTo('/account')
            }


            if (error.value) {
                const { objectifyErrors, message, errors } = formatError(error.value)

                this.registrationFieldErrors = objectifyErrors
                this.registrationErrorMessage = message

                throw new Error(message)
            }

        },
        async signOut(recaptchaToken?: string){
            this.authenticated = false
            this.user = null
            this.token = null
            navigateTo('/login')
            useAPIFetch('/auth/logout', {
                method: 'POST',
                headers: {
                    'X-Recaptcha-Token': recaptchaToken,
                }
            })
        }
    },
    persist: {
        paths: ['user', 'token', 'authenticated'],
    },
})
