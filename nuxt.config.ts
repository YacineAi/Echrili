// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  nitro: {
    storage: {
      myFileSystem: {
        driver: 'fs',
        base: 'assets/',
      },
      
    },
  },
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    'nuxt-icon',
    ['@nuxtjs/google-fonts', {
        families: {
          Cairo: true,
          Inter: [200, 300, 400, 700, 800, 900],
        }
    }],
  ],
  

})

