import {IReCaptchaComposition, useReCaptcha} from 'vue-recaptcha-v3';

export const useRecaptchaToken = async (action: string) => {
    const recaptchaInstance = useReCaptcha();

    await recaptchaInstance?.recaptchaLoaded()

    // Execute reCAPTCHA with action "login".
    return recaptchaInstance?.executeRecaptcha(action)
}
