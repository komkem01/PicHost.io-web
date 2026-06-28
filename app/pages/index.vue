<template>
  <main class="min-h-screen bg-[#09090b] text-white font-sans">

    <!-- Navbar -->
    <header class="border-b border-white/[0.06] bg-[#09090b]/90 backdrop-blur-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between relative">
        <NuxtLink to="/" class="flex items-center gap-1.5">
          <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3 21h18M2.25 12V4.5A2.25 2.25 0 0 1 4.5 2.25h15A2.25 2.25 0 0 1 21.75 4.5V12" />
          </svg>
          <span class="text-blue-500 text-[17px] font-bold tracking-tight">PicHost</span><span class="text-white text-[17px] font-light tracking-tight">.io</span>
        </NuxtLink>

        <nav class="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
          <a href="#features" class="text-[13px] text-white/55 hover:text-white px-3.5 py-2 rounded-lg hover:bg-white/[0.04] transition-colors">Features</a>
          <a href="#pricing" class="text-[13px] text-white/55 hover:text-white px-3.5 py-2 rounded-lg hover:bg-white/[0.04] transition-colors">Pricing</a>
        </nav>

        <div class="flex items-center gap-2">
          <template v-if="user">
            <NuxtLink to="/dashboard" class="text-[13px] text-white/60 hover:text-white px-3.5 py-2 rounded-lg hover:bg-white/[0.04] transition-colors">Dashboard</NuxtLink>
            <NuxtLink to="/upload" class="text-[13px] text-white font-medium bg-blue-600 hover:bg-blue-500 px-3.5 py-2 rounded-lg transition-colors">Upload</NuxtLink>
          </template>
          <template v-else>
            <NuxtLink to="/upload" class="text-[13px] text-white/80 font-medium border border-white/20 hover:border-white/40 hover:bg-white/[0.04] px-3.5 py-2 rounded-lg transition-colors">
              Try Free
            </NuxtLink>
            <NuxtLink to="/auth/login" class="text-[13px] text-white/55 hover:text-white px-3.5 py-2 rounded-lg hover:bg-white/[0.04] transition-colors">Sign in</NuxtLink>
            <NuxtLink to="/auth/register" class="text-[13px] text-white font-medium bg-blue-600 hover:bg-blue-500 px-3.5 py-2 rounded-lg transition-colors">Get started</NuxtLink>
          </template>
        </div>
      </div>
    </header>

    <!-- Hero -->
    <section class="max-w-7xl mx-auto px-6 pt-28 pb-24 text-center">
      <div class="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[11.5px] px-3 py-1.5 rounded-full mb-10 font-medium">
        <span class="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span>
        {{ heroBadgeText }}
      </div>

      <h1 class="text-5xl md:text-[68px] font-bold tracking-tight leading-[1.1] mb-6">
        Upload an image.<br />
        <span class="text-blue-500">Get a link.</span>
      </h1>
      <p class="text-white/40 text-lg max-w-xl mx-auto mb-12 leading-relaxed">
        Drag in any image and share the permanent URL in seconds.
        No login required — free forever.
      </p>

      <div class="flex flex-col sm:flex-row gap-3 justify-center mb-20">
        <NuxtLink
          to="/upload"
          class="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-7 py-3 rounded-xl font-semibold transition-colors text-[14px] shadow-lg shadow-blue-600/20"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Upload now — it's free
        </NuxtLink>
        <NuxtLink
          to="/auth/register"
          class="inline-flex items-center justify-center gap-2 border border-white/[0.12] hover:border-white/25 text-white/60 hover:text-white px-7 py-3 rounded-xl font-medium transition-colors text-[14px]"
        >
          Create account
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </NuxtLink>
      </div>

      <!-- Social proof strip -->
      <div class="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[12.5px] text-white/30">
        <span class="flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
          Permanent links
        </span>
        <span class="flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
          Watermark removal on Basic
        </span>
        <span class="flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
          S3-backed storage
        </span>
        <span class="flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
          No registration required
        </span>
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="max-w-7xl mx-auto px-6 py-24">
      <div class="text-center mb-16">
        <p class="text-blue-500 text-[12px] font-semibold uppercase tracking-widest mb-3">Features</p>
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Everything you need to host images</h2>
        <p class="text-white/40 max-w-lg mx-auto text-[15px]">Built for developers, designers, and teams who need reliable image hosting with zero friction.</p>
      </div>

      <div class="grid md:grid-cols-3 gap-4">
        <div
          v-for="feat in features"
          :key="feat.title"
          class="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 hover:border-blue-500/30 hover:bg-blue-500/[0.03] transition-all"
        >
          <div class="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mb-4" v-html="feat.icon"></div>
          <h3 class="text-[15px] font-semibold text-white mb-2">{{ feat.title }}</h3>
          <p class="text-white/40 text-[13px] leading-relaxed">{{ feat.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section id="pricing" class="max-w-7xl mx-auto px-6 py-24">
      <div class="text-center mb-16">
        <p class="text-blue-500 text-[12px] font-semibold uppercase tracking-widest mb-3">Pricing</p>
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Simple, transparent pricing</h2>
        <p class="text-white/40 max-w-lg mx-auto text-[15px]">Start free — upgrade only when you need more storage or higher file upload limits.</p>
      </div>

      <div class="flex flex-col md:flex-row flex-wrap justify-center gap-6">
        <div
          v-for="plan in plans"
          :key="plan.key"
          :class="[
            'w-full md:w-[320px] rounded-2xl border p-6 flex flex-col transition-all',
            plan.highlighted
              ? 'border-blue-500/50 bg-blue-600/[0.08] relative shadow-lg shadow-blue-500/5'
              : 'border-white/[0.07] bg-white/[0.02]'
          ]"
        >
          <div v-if="plan.highlighted" class="absolute -top-3 left-1/2 -translate-x-1/2">
            <span class="bg-blue-600 text-white text-[11px] font-bold px-3 py-1 rounded-full">Most Popular</span>
          </div>
          <p class="text-[12px] font-semibold text-white/50 uppercase tracking-widest mb-2">{{ plan.name }}</p>
          <div class="mb-5">
            <span class="text-3xl font-bold text-white">{{ plan.price }}</span>
            <span v-if="plan.period" class="text-white/35 text-sm ml-1">{{ plan.period }}</span>
          </div>
          <ul class="space-y-2.5 mb-8 flex-1">
            <li v-for="item in plan.features" :key="item" class="flex items-start gap-2 text-[13px] text-white/55">
              <svg class="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              {{ item }}
            </li>
          </ul>
          <NuxtLink
            :to="plan.cta.href"
            :class="[
              'text-center text-[13px] font-semibold py-2.5 rounded-xl transition-colors',
              plan.highlighted
                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                : 'border border-white/[0.12] hover:border-white/25 text-white/60 hover:text-white'
            ]"
          >
            {{ plan.cta.label }}
          </NuxtLink>
        </div>
        <div v-if="plans.length === 0" class="w-full rounded-2xl border border-white/[0.07] bg-white/[0.02] p-10 text-center text-[13px] text-white/40">
          No plans available right now.
        </div>
      </div>
    </section>



    <!-- CTA Banner -->
    <section class="max-w-7xl mx-auto px-6 pb-24">
      <div class="rounded-2xl border border-blue-500/20 bg-blue-600/[0.06] px-8 py-12 text-center">
        <h2 class="text-3xl font-bold text-white mb-3">Ready to start hosting?</h2>
        <p class="text-white/40 mb-8 max-w-md mx-auto text-[15px]">Upload your first image right now — no account required. Sign up later to keep it forever.</p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <NuxtLink to="/upload" class="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-7 py-3 rounded-xl font-semibold transition-colors text-[14px] shadow-lg shadow-blue-600/20">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Upload now
          </NuxtLink>
          <NuxtLink to="/auth/register" class="inline-flex items-center justify-center border border-white/[0.12] hover:border-white/25 text-white/60 hover:text-white px-7 py-3 rounded-xl font-medium transition-colors text-[14px]">
            Create free account
          </NuxtLink>
        </div>
      </div>
    </section>

    <footer class="border-t border-white/[0.06] py-10">
      <div class="max-w-7xl mx-auto px-6 flex items-center justify-center text-[13px] text-white/25">
        <div class="flex items-center gap-1.5">
          <svg class="w-4 h-4 text-blue-500/50" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3 21h18M2.25 12V4.5A2.25 2.25 0 0 1 4.5 2.25h15A2.25 2.25 0 0 1 21.75 4.5V12" />
          </svg>
          <span class="text-blue-500/60 font-bold">PicHost</span><span class="text-white/25 font-light">.io</span>
          <span class="mx-2">·</span>
          <span>© 2026 All rights reserved.</span>
        </div>
      </div>
    </footer>
  </main>
</template>

<script setup lang="ts">
const SITE_URL = 'https://pichost.io'
const OG_IMAGE = `${SITE_URL}/og-image.png`
const { user, fetchMe } = useAuth()
const config = useRuntimeConfig()

const ldJson = computed(() => {
  const isLoggedIn = !!user.value

  const webAppDescription = isLoggedIn
    ? 'Fast image hosting for signed-in users. Upload JPEG, PNG, WebP, GIF, AVIF images and share permanent CDN-backed URLs.'
    : 'Free, fast image hosting. Upload JPEG, PNG, WebP, GIF, AVIF images and share permanent CDN-backed URLs. No login required for guest uploads.'

  const offers = [
    { '@type': 'Offer', name: 'Guest', price: '0', priceCurrency: 'THB', description: 'Upload up to 10 images with 50 MB total, no account required. Images expire after 24 hours.' },
    { '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'THB', description: '1 GB storage, 200 images, permanent links.' },
    { '@type': 'Offer', name: 'Basic', price: '19', priceCurrency: 'THB', description: '10 GB storage, unlimited images, API access.' },
    { '@type': 'Offer', name: 'Pro', price: '190', priceCurrency: 'THB', description: '100 GB storage, all formats including HEIC.' },
  ]

  const featureList = [
    'No account required for guest uploads',
    'Permanent shareable links',
    'S3-backed reliable storage',
    'REST API access',
    'Watermark removal on Basic',
  ]

  const faqEntities = [
    { '@type': 'Question', name: 'What is PicHost.io?', acceptedAnswer: { '@type': 'Answer', text: 'PicHost.io is a free image hosting service that lets you upload images and get permanent, shareable CDN-backed URLs instantly. No account is required for guest uploads.' } },
    { '@type': 'Question', name: 'Is PicHost.io free to use?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. PicHost.io is free forever. Guests can upload up to 10 images (50 MB) without creating an account. Free accounts get 1 GB and 200 images. Paid plans start at low monthly rates.' } },
    { '@type': 'Question', name: 'Do I need an account to upload images?', acceptedAnswer: { '@type': 'Answer', text: 'No. You can upload images as a guest without creating any account. Guest images are stored for 24 hours. Create a free account to make your images permanent.' } },
    { '@type': 'Question', name: 'How long do guest images last?', acceptedAnswer: { '@type': 'Answer', text: 'Guest images (uploaded without an account) expire after 24 hours. Images uploaded by registered users are permanent and never expire unless you delete them.' } },
    { '@type': 'Question', name: 'What image formats does PicHost.io support?', acceptedAnswer: { '@type': 'Answer', text: 'PicHost.io supports JPEG and PNG for guest uploads. Free accounts support JPEG, PNG, and WebP. Basic plan adds GIF and AVIF. Pro plan supports all formats including HEIC.' } },
    { '@type': 'Question', name: 'Does PicHost.io add a watermark to images?', acceptedAnswer: { '@type': 'Answer', text: 'Free plan and Guest uploads include a watermark to help promote our service. Upgrade to Basic to remove the watermark.' } },
  ]

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'PicHost.io',
        description: 'Free image hosting — upload images and share permanent links instantly.',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_URL}/upload`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'WebApplication',
        '@id': `${SITE_URL}/#webapp`,
        name: 'PicHost.io',
        url: SITE_URL,
        description: webAppDescription,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web',
        offers: isLoggedIn ? offers.filter((offer) => offer.name !== 'Guest') : offers,
        featureList: isLoggedIn ? featureList.filter((feature) => !feature.toLowerCase().includes('guest')) : featureList,
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'PicHost.io',
        url: SITE_URL,
        logo: `${SITE_URL}/favicon.svg`,
      },
      {
        '@type': 'FAQPage',
        mainEntity: isLoggedIn
          ? faqEntities.filter((entity) => {
              const questionText = String((entity as any).name ?? '').toLowerCase()
              const answerText = String(((entity as any).acceptedAnswer?.text ?? '')).toLowerCase()
              return !questionText.includes('guest') && !answerText.includes('guest')
            })
          : faqEntities,
      },
    ],
  }
})

useSeoMeta({
  title: 'PicHost.io — Free Image Hosting, No Login Required',
  ogTitle: 'PicHost.io — Free Image Hosting, No Login Required',
  description: 'Upload any image and get a permanent shareable link in seconds. No account needed, S3-backed storage, remove watermark on Basic. Free image hosting for developers and teams.',
  ogDescription: 'Upload any image and get a permanent shareable link in seconds. No account needed, S3-backed storage, remove watermark on Basic. Free image hosting for developers and teams.',
  ogImage: OG_IMAGE,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogUrl: SITE_URL,
  ogType: 'website',
  ogSiteName: 'PicHost.io',
  twitterCard: 'summary_large_image',
  twitterTitle: 'PicHost.io — Free Image Hosting, No Login Required',
  twitterDescription: 'Upload any image and get a permanent link instantly. No account, remove watermark on Basic. Free forever.',
  twitterImage: OG_IMAGE,
  robots: 'index, follow',
})

useHead(() => ({
  link: [{ rel: 'canonical', href: SITE_URL }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(ldJson.value),
    },
  ],
}))

const heroBadgeText = computed(() => {
  return user.value ? 'Welcome back — continue uploading instantly' : 'No account required — upload instantly'
})

interface PublicPlanSetting {
  plan_key: string
  display_name: string
  monthly_price_thb: number
  storage_limit_bytes: number
  image_limit: number
  max_upload_mb: number
  is_enabled: boolean
  allow_private: boolean
  custom_domain: boolean
  api_access: boolean
  priority_support: boolean
  no_ads: boolean
  watermark_removal: boolean
}

interface LandingPlan {
  key: string
  name: string
  price: string
  period: string
  highlighted: boolean
  features: string[]
  cta: {
    label: string
    href: string
  }
}

const publicPlans = ref<PublicPlanSetting[]>([])

onMounted(async () => {
  void fetchMe()
  try {
    const res = await $fetch<{ code: string; message: string; data: PublicPlanSetting[] }>(
      `${config.public.apiBase}/public/plans`,
    )
    publicPlans.value = (res.data ?? []).filter((plan) => plan.is_enabled)
  } catch {
    publicPlans.value = []
  }
})

const baseFeatures = [
  {
    icon: `<svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"/></svg>`,
    title: 'Instant shareable links',
    desc: 'Every upload gets a permanent short URL and a direct CDN link. Ready to paste anywhere in seconds.',
  },
  {
    icon: `<svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 2.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125M3.75 15c0 2.278 3.694 4.125 8.25 4.125s8.25-1.847 8.25-4.125"/></svg>`,
    title: 'S3-backed storage',
    desc: 'Files stored in S3-compatible object storage. Durable, redundant, and scalable — your images never disappear.',
  },
  {
    icon: `<svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/></svg>`,
    title: 'No account needed',
    desc: 'Upload as a guest without registering. Sign up only when you need permanent storage or higher limits.',
  },
  {
    icon: `<svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"/></svg>`,
    title: 'Quota & usage tracking',
    desc: 'Real-time dashboard showing storage used, image count, and per-plan limits. Upgrade prompts when approaching quota.',
  },
]

const features = computed(() => {
  if (!user.value) return baseFeatures
  return baseFeatures.filter((feature) => feature.title !== 'No account needed')
})

function formatStorage(bytes: number) {
  if (bytes <= 0) return 'Unlimited storage'
  const gb = bytes / 1024 / 1024 / 1024
  if (gb >= 1) return `${Number.isInteger(gb) ? gb : gb.toFixed(1)} GB storage`
  const mb = bytes / 1024 / 1024
  return `${Number.isInteger(mb) ? mb : mb.toFixed(1)} MB storage`
}

function toPlanCard(plan: PublicPlanSetting): LandingPlan {
  const isFree = plan.monthly_price_thb <= 0
  const isLoggedIn = !!user.value
  const isCurrentPlan = (user.value?.plan ?? '').toLowerCase() === plan.plan_key.toLowerCase()
  const features = [
    formatStorage(plan.storage_limit_bytes),
    `Max ${plan.max_upload_mb} MB per file`,
    plan.image_limit > 0 ? `Up to ${plan.image_limit.toLocaleString()} images` : 'Unlimited images',
  ]

  if (plan.watermark_removal) {
    features.push('No watermark')
  } else {
    features.push('Watermarked images')
  }

  if (plan.api_access) features.push('API access')

  return {
    key: plan.plan_key,
    name: plan.display_name,
    price: isFree ? 'Free' : `฿${plan.monthly_price_thb.toLocaleString()}`,
    period: isFree ? '' : '/ mo',
    highlighted: plan.plan_key === 'basic',
    features,
    cta: {
      label: isLoggedIn
        ? (isCurrentPlan ? 'Current plan' : `Upgrade to ${plan.display_name}`)
        : (isFree ? 'Sign up free' : `Get ${plan.display_name}`),
      href: isLoggedIn ? '/settings/account?tab=plan' : '/auth/register',
    },
  }
}

const plans = computed<LandingPlan[]>(() => {
  return publicPlans.value
    .filter((plan) => plan.is_enabled)
    .sort((a, b) => a.monthly_price_thb - b.monthly_price_thb)
    .map(toPlanCard)
})


</script>

