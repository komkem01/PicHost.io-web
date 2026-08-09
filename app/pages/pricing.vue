<template>
  <div class="min-h-screen bg-[#09090b] text-white font-sans selection:bg-blue-500/30 selection:text-blue-200">
    <!-- Hero Glows -->
    <div class="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      <div class="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/[0.08] rounded-full blur-[140px]"></div>
      <div class="absolute top-[40%] right-[-5%] w-[400px] h-[400px] bg-cyan-600/[0.05] rounded-full blur-[120px]"></div>
    </div>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-6 py-16">
      <!-- Title section -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 uppercase tracking-widest mb-4">
          {{ $t('pricing.title') }}
        </span>
        <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
          {{ $t('pricing.subtitle') }}
        </h1>
      </div>

      <!-- Pricing Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-20">
        <div
          v-for="plan in displayPlans"
          :key="plan.key"
          :class="[
            'relative rounded-2xl border p-8 flex flex-col justify-between backdrop-blur-xl transition-all',
            plan.highlighted
              ? 'border-2 border-blue-500/50 bg-blue-500/[0.04] shadow-2xl shadow-blue-500/10'
              : 'border-white/[0.08] bg-white/[0.02]'
          ]"
        >
          <div v-if="plan.badge" class="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-600 text-[11px] font-bold uppercase tracking-wider text-white">
            {{ plan.badge }}
          </div>
          <div>
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold text-white">{{ plan.name }}</h3>
            </div>
            <div class="flex items-baseline gap-1 mb-6">
              <span class="text-4xl font-extrabold text-white">{{ plan.price }}</span>
              <span v-if="plan.period" class="text-white/40 text-sm">{{ plan.period }}</span>
            </div>
            <p class="text-xs text-white/50 mb-6">{{ plan.desc }}</p>

            <div class="space-y-3 text-xs text-white/80 border-t border-white/[0.08] pt-6 mb-8">
              <div v-for="feat in plan.features" :key="feat" class="flex items-center gap-2.5">
                <svg class="w-4 h-4 text-blue-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                <span>{{ feat }}</span>
              </div>
            </div>
          </div>

          <NuxtLink
            :to="plan.cta.href"
            :class="[
              'w-full py-3 rounded-xl text-center font-semibold text-sm transition-all',
              plan.highlighted
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-600/25'
                : 'border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] text-white'
            ]"
          >
            {{ plan.cta.label }}
          </NuxtLink>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { formatBytes, formatCurrency } from '~/utils/format'

interface PublicPlanSetting {
  id?: string
  plan_key: string
  display_name: string
  monthly_price_thb: number
  storage_limit_bytes: number
  max_upload_mb: number
  watermark_removal: boolean
  api_access: boolean
  is_enabled: boolean
}

interface DisplayPlan {
  key: string
  name: string
  badge?: string
  price: string
  period: string
  desc: string
  highlighted: boolean
  features: string[]
  cta: {
    label: string
    href: string
  }
}

const SITE_URL = 'https://pichost.io'
const config = useRuntimeConfig()
const { user, fetchMe } = useAuth()
const { locale, t } = useI18n()

onMounted(async () => {
  try {
    await fetchMe()
  } catch {}
})

const defaultPlans: PublicPlanSetting[] = [
  {
    plan_key: 'free',
    display_name: 'Free',
    monthly_price_thb: 0,
    storage_limit_bytes: 1 * 1024 * 1024 * 1024,
    max_upload_mb: 5,
    watermark_removal: false,
    api_access: false,
    is_enabled: true,
  },
  {
    plan_key: 'basic',
    display_name: 'Basic',
    monthly_price_thb: 19,
    storage_limit_bytes: 10 * 1024 * 1024 * 1024,
    max_upload_mb: 15,
    watermark_removal: true,
    api_access: false,
    is_enabled: true,
  },
  {
    plan_key: 'pro',
    display_name: 'Pro',
    monthly_price_thb: 190,
    storage_limit_bytes: 100 * 1024 * 1024 * 1024,
    max_upload_mb: 50,
    watermark_removal: true,
    api_access: true,
    is_enabled: true,
  },
]

const { data: plansResponse } = useFetch<{ code: string; message: string; data: PublicPlanSetting[] }>(
  `${config.public.apiBase}/public/plans`,
  { lazy: true, server: false }
)

const publicPlans = computed<PublicPlanSetting[]>(() => {
  const apiPlans = (plansResponse.value?.data ?? []).filter((p) => p.is_enabled)
  return apiPlans.length > 0 ? apiPlans : defaultPlans
})

const displayPlans = computed<DisplayPlan[]>(() => {
  return publicPlans.value
    .slice()
    .sort((a, b) => a.monthly_price_thb - b.monthly_price_thb)
    .map((plan) => {
      const isFree = plan.monthly_price_thb <= 0
      const isLoggedIn = !!user.value
      const isCurrentPlan = (user.value?.plan ?? '').toLowerCase() === plan.plan_key.toLowerCase()

      const features: string[] = [
        t('pricing.features.storage', { size: formatBytes(plan.storage_limit_bytes) }),
        t('pricing.features.maxFileSize', { size: `${plan.max_upload_mb} MB` }),
      ]
      if (plan.watermark_removal) {
        features.push(t('pricing.features.noWatermark'))
      }
      if (plan.api_access) {
        features.push(t('pricing.features.apiAccess'))
      }

      let desc = t('pricing.free.desc')
      if (plan.plan_key === 'basic') desc = t('pricing.basic.desc')
      if (plan.plan_key === 'pro') desc = t('pricing.pro.desc')

      let badge = undefined
      if (plan.plan_key === 'basic') badge = t('pricing.basic.badge')
      if (plan.plan_key === 'pro') badge = t('pricing.pro.badge')

      return {
        key: plan.plan_key,
        name: plan.display_name,
        badge,
        price: isFree ? (locale.value === 'th' ? 'ฟรี' : 'Free') : formatCurrency(plan.monthly_price_thb, locale.value),
        period: isFree ? '' : t('pricing.monthly'),
        desc,
        highlighted: plan.plan_key === 'basic',
        features,
        cta: {
          label: isLoggedIn
            ? (isCurrentPlan ? t('pricing.currentPlan') : `Upgrade ${plan.display_name}`)
            : (isFree ? t('pricing.free.cta') : `Get ${plan.display_name}`),
          href: isLoggedIn ? '/settings/account?tab=plan' : '/auth/register',
        },
      }
    })
})

useSeoMeta({
  title: 'Pricing — PicHost.io Image Hosting',
  description: 'Compare PicHost.io free and paid plans. Get up to 100 GB storage, watermark removal, and API access.',
  ogTitle: 'Pricing — PicHost.io Image Hosting',
  ogDescription: 'Compare PicHost.io free and paid plans. Get up to 100 GB storage, watermark removal, and API access.',
  ogImage: `${SITE_URL}/og-image.png`,
  twitterCard: 'summary_large_image',
})

useHead({
  htmlAttrs: {
    lang: computed(() => locale.value)
  },
  link: [{ rel: 'canonical', href: `${SITE_URL}/pricing` }],
})
</script>
