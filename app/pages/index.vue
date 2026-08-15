<template>
  <main class="min-h-screen bg-[#FAFAFA] text-zinc-900 font-sans">

    <!-- Hero -->
    <section class="max-w-7xl mx-auto px-6 pt-24 pb-20 text-center">
      <div class="inline-flex items-center gap-2 bg-zinc-100 border border-zinc-200 text-zinc-700 text-[11.5px] px-3.5 py-1.5 rounded-full mb-8 font-medium">
        <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
        {{ $t('hero.badge') }}
      </div>

      <h1 class="text-5xl md:text-[68px] font-bold tracking-tight leading-[1.1] mb-6 text-zinc-900">
        {{ $t('hero.titlePrefix') }}<br />
        <span class="text-zinc-900 font-bold">{{ $t('hero.titleHighlight') }}</span>
      </h1>
      <p class="text-zinc-500 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
        {{ $t('hero.subtitle') }}
      </p>

      <div class="flex flex-col sm:flex-row gap-3 justify-center mb-16">
        <NuxtLink
          to="/upload"
          class="inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white px-7 py-3 rounded-xl font-semibold transition-colors text-[14px] shadow-sm cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          {{ $t('hero.ctaUpload') }}
        </NuxtLink>
        <NuxtLink
          to="/pricing"
          class="inline-flex items-center justify-center gap-2 border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 hover:text-zinc-900 px-7 py-3 rounded-xl font-medium transition-colors text-[14px] shadow-xs cursor-pointer"
        >
          {{ $t('hero.ctaPricing') }}
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </NuxtLink>
      </div>

      <!-- Social proof strip -->
      <div class="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[12.5px] text-zinc-500">
        <span class="flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
          {{ locale === 'th' ? 'ลิงก์ถาวร แชร์ได้ทุกที่' : 'Permanent shareable links' }}
        </span>
        <span class="flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
          {{ locale === 'th' ? 'ไม่มีลายน้ำ (Basic ขึ้นไป)' : 'No watermark on paid plans' }}
        </span>
        <span class="flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
          {{ locale === 'th' ? 'เก็บข้อมูลปลอดภัยบนระบบคลาวด์' : 'Secure cloud storage' }}
        </span>
        <span class="flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
          {{ locale === 'th' ? 'เชื่อมต่อกับแอปของคุณได้' : 'Works with your own app' }}
        </span>
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="max-w-7xl mx-auto px-6 py-20">
      <div class="text-center mb-16">
        <p class="text-zinc-500 text-[12px] font-semibold uppercase tracking-widest mb-3">{{ $t('nav.features') }}</p>
        <h2 class="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">{{ $t('features.title') }}</h2>
        <p class="text-zinc-500 max-w-lg mx-auto text-[15px]">{{ $t('features.subtitle') }}</p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="feat in featureList"
          :key="feat.title"
          class="rounded-2xl border border-zinc-200 bg-white p-6 shadow-card hover:shadow-elevated transition-all"
        >
          <div class="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center mb-4 text-zinc-900" v-html="feat.icon"></div>
          <h3 class="text-[15px] font-semibold text-zinc-900 mb-2">{{ feat.title }}</h3>
          <p class="text-zinc-500 text-[13px] leading-relaxed">{{ feat.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section id="pricing" class="max-w-7xl mx-auto px-6 py-20">
      <div class="text-center mb-16">
        <p class="text-zinc-500 text-[12px] font-semibold uppercase tracking-widest mb-3">{{ $t('nav.pricing') }}</p>
        <h2 class="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">{{ $t('pricing.title') }}</h2>
        <p class="text-zinc-500 max-w-lg mx-auto text-[15px]">{{ $t('pricing.subtitle') }}</p>
      </div>

      <div class="flex flex-col md:flex-row flex-wrap justify-center gap-6">
        <div
          v-for="plan in plans"
          :key="plan.key"
          :class="[
            'w-full md:w-[320px] rounded-2xl border p-6 flex flex-col transition-all',
            plan.highlighted
              ? 'border-zinc-900 bg-white shadow-elevated relative'
              : 'border-zinc-200 bg-white shadow-card'
          ]"
        >
          <div v-if="plan.highlighted" class="absolute -top-3 left-1/2 -translate-x-1/2">
            <span class="bg-zinc-900 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-xs">{{ $t('pricing.pro.badge') }}</span>
          </div>
          <p class="text-[12px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">{{ plan.name }}</p>
          <div class="mb-5">
            <span class="text-3xl font-bold text-zinc-900">{{ plan.price }}</span>
            <span v-if="plan.period" class="text-zinc-400 text-sm ml-1">{{ plan.period }}</span>
          </div>
          <ul class="space-y-2.5 mb-8 flex-1">
            <li v-for="item in plan.features" :key="item" class="flex items-start gap-2 text-[13px] text-zinc-600">
              <svg class="w-3.5 h-3.5 text-zinc-900 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              {{ item }}
            </li>
          </ul>
          <NuxtLink
            :to="plan.cta.href"
            :class="[
              'text-center text-[13px] font-semibold py-2.5 rounded-xl transition-colors cursor-pointer',
              plan.highlighted
                ? 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-xs'
                : 'border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 hover:text-zinc-900'
            ]"
          >
            {{ plan.cta.label }}
          </NuxtLink>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { formatBytes, formatCurrency } from '~/utils/format'

const SITE_URL = 'https://pichost.io'
const { user, fetchMe } = useAuth()
const config = useRuntimeConfig()
const { t, locale } = useI18n()

useHead({
  title: computed(() => locale.value === 'th' ? 'PicHost.io - บริการฝากรูปภาพและวิดีโอออนไลน์' : 'PicHost.io - Online Image & Video Hosting'),
  htmlAttrs: {
    lang: computed(() => locale.value)
  }
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

const defaultPlans: PublicPlanSetting[] = [
  {
    plan_key: 'free',
    display_name: 'Free',
    monthly_price_thb: 0,
    storage_limit_bytes: 1 * 1024 * 1024 * 1024,
    image_limit: 100,
    max_upload_mb: 5,
    watermark_removal: false,
    api_access: false,
    is_enabled: true,
    allow_private: false,
    custom_domain: false,
    priority_support: false,
    no_ads: false
  },
  {
    plan_key: 'basic',
    display_name: 'Basic',
    monthly_price_thb: 19,
    storage_limit_bytes: 10 * 1024 * 1024 * 1024,
    image_limit: 1000,
    max_upload_mb: 15,
    watermark_removal: true,
    api_access: false,
    is_enabled: true,
    allow_private: false,
    custom_domain: false,
    priority_support: false,
    no_ads: true
  },
  {
    plan_key: 'pro',
    display_name: 'Pro',
    monthly_price_thb: 190,
    storage_limit_bytes: 100 * 1024 * 1024 * 1024,
    image_limit: 10000,
    max_upload_mb: 50,
    watermark_removal: true,
    api_access: true,
    is_enabled: true,
    allow_private: true,
    custom_domain: true,
    priority_support: true,
    no_ads: true
  },
]

const { data: plansResponse } = useFetch<{ code: string; message: string; data: PublicPlanSetting[] }>(
  `${config.public.apiBase}/public/plans`,
  { lazy: true, server: false }
)

const publicPlans = computed<PublicPlanSetting[]>(() => {
  const apiPlans = (plansResponse.value?.data ?? []).filter((plan) => plan.is_enabled)
  return apiPlans.length > 0 ? apiPlans : defaultPlans
})

onMounted(async () => {
  try {
    await fetchMe()
  } catch {}
})

const featureList = computed(() => [
  {
    icon: `<svg class="w-5 h-5 text-zinc-900" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"/></svg>`,
    title: t('features.fast.title'),
    desc: t('features.fast.desc'),
  },
  {
    icon: `<svg class="w-5 h-5 text-zinc-900" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 2.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125M3.75 15c0 2.278 3.694 4.125 8.25 4.125s8.25-1.847 8.25-4.125"/></svg>`,
    title: t('features.secure.title'),
    desc: t('features.secure.desc'),
  },
  {
    icon: `<svg class="w-5 h-5 text-zinc-900" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/></svg>`,
    title: t('features.api.title'),
    desc: t('features.api.desc'),
  },
  {
    icon: `<svg class="w-5 h-5 text-zinc-900" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"/></svg>`,
    title: t('features.analytics.title'),
    desc: t('features.analytics.desc'),
  },
])

function toPlanCard(plan: PublicPlanSetting): LandingPlan {
  const isFree = plan.monthly_price_thb <= 0
  const isLoggedIn = !!user.value
  const isCurrentPlan = (user.value?.plan ?? '').toLowerCase() === plan.plan_key.toLowerCase()
  const features = [
    t('pricing.features.storage', { size: formatBytes(plan.storage_limit_bytes) }),
    t('pricing.features.maxFileSize', { size: `${plan.max_upload_mb} MB` }),
  ]

  if (plan.watermark_removal) {
    features.push(t('pricing.features.noWatermark'))
  }
  if (plan.api_access) {
    features.push(t('pricing.features.apiAccess'))
  }

  return {
    key: plan.plan_key,
    name: plan.display_name,
    price: isFree ? (locale.value === 'th' ? 'ฟรี' : 'Free') : formatCurrency(plan.monthly_price_thb, locale.value),
    period: isFree ? '' : t('pricing.monthly'),
    highlighted: plan.plan_key === 'basic',
    features,
    cta: {
      label: isLoggedIn
        ? (isCurrentPlan ? t('pricing.currentPlan') : (locale.value === 'th' ? `อัปเกรดเป็น ${plan.display_name}` : `Upgrade to ${plan.display_name}`))
        : (isFree ? t('pricing.free.cta') : (locale.value === 'th' ? `เลือกแพ็กเกจ ${plan.display_name}` : `Get ${plan.display_name}`)),
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
