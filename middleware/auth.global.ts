import {storeToRefs} from "pinia";
import {useAuthStore} from "~/store/auth";

export default defineNuxtRouteMiddleware((to, from) => {

        const { authenticated } = storeToRefs(useAuthStore());

        if (!authenticated.value && !to.path.includes('auth')) {
            abortNavigation();
            return navigateTo('/auth/login')
        }

        if (authenticated.value && to.path.includes('auth')) {
            abortNavigation();
            return navigateTo('/account')
        }
})
