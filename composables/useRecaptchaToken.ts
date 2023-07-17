import {IReCaptchaComposition} from 'vue-recaptcha-v3';

export const useRecaptchaToken = async (action: string, captchaInstance?: IReCaptchaComposition) => {

    await captchaInstance?.recaptchaLoaded()

    // Execute reCAPTCHA with action "login".
    return captchaInstance?.executeRecaptcha(action)
}
