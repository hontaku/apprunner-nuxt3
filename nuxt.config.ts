// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  vite: { mode: process.env.MODE || 'dev' },
  telemetry: false
})
