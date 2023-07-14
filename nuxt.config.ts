export default defineNuxtConfig({
    devtools: {enabled: true},
    colorMode: {
        preference: 'light'
    },
    ui: {
        safelistColors: ['red'],
        icons: ['tabler']
    },
    runtimeConfig: {
        public: {
            API_BASE_URL: process.env.API_BASE_URL || 'http://127.0.0.1:3333',
            RECAPTCHA_PUB_KEY: process.env.RECAPTCHA_PUB_KEY || '',
        },
    },
    modules: [
        '@pinia/nuxt',
        '@pinia-plugin-persistedstate/nuxt',
        '@nuxthq/ui',
        'nuxt-security'
    ],
    security: {
        headers: {
            crossOriginOpenerPolicy: 'credentialless',
            contentSecurityPolicy: {
                'img-src': ['*', 'data:']
            }
        }
    }
})
