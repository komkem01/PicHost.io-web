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
      titleTemplate: '%s — PicHost.io',
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'description', content: 'Upload any image and get a permanent shareable link in seconds. No account needed, no watermark, S3-backed storage. Free image hosting for developers and teams.' },
        { name: 'keywords', content: 'free image hosting, image upload, permanent image links, image sharing, image hosting without watermark, image CDN, image hosting API, free photo hosting' },
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
  runtimeConfig: {
    public: {
      apiBase: '/api/v1',
    },
  },
})
