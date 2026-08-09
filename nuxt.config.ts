import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    head: {
      title: 'PicHost.io',
      // titleTemplate: '%s — PicHost.io',
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'description', content: 'Upload any image and get a permanent shareable link in seconds. No account needed, S3-backed storage, remove watermark on Basic. Free image hosting for developers and teams.' },
        { name: 'keywords', content: 'free image hosting, image upload, permanent image links, image sharing, image CDN, free photo hosting' },
        { name: 'theme-color', content: '#09090b' },
        { name: 'robots', content: 'index, follow' },
        // Open Graph defaults (overridden per-page by useSeoMeta)
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'PicHost.io' },
        { property: 'og:image', content: 'https://pichost.io/og-image.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        // Twitter Card defaults
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: 'https://pichost.io/og-image.png' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'sitemap', type: 'application/xml', href: '/sitemap.xml' },
      ],
    },
  },
  modules: ['@nuxtjs/i18n'],
  i18n: {
    locales: [
      { code: 'th', name: 'ไทย', file: 'th.json' },
      { code: 'en', name: 'English', file: 'en.json' }
    ],
    defaultLocale: 'th',
    strategy: 'no_prefix',
    lazy: false,
    langDir: '../i18n/locales',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8080/api/v1',
      storagesServiceUrl: process.env.NUXT_PUBLIC_STORAGES_SERVICE_URL || 'http://localhost:8080/api/v1',
    },
  },
})
