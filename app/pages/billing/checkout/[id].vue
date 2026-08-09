<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

import type { BankInfo, PublicPlanSetting } from '~/composables/useBilling'

const route = useRoute()
const router = useRouter()
const { fetchMe } = useAuth()
const { listPublicPlans, getPaymentMethods, createCheckout } = useBilling()
const { error: toastError } = useToast()
const { t, locale } = useI18n()

useHead({
  htmlAttrs: {
    lang: computed(() => locale.value)
  }
})

const plan = ref<PublicPlanSetting | null>(null)
const bankInfo = ref<BankInfo | null>(null)
const loading = ref(true)
const submitting = ref(false)
const error = ref('')

const selectedProvider = ref<'omise' | 'manual'>('omise')

const planKey = computed(() => String(route.params.id ?? '').trim().toLowerCase())

async function load() {
  try {
    const [plans, b] = await Promise.all([
      listPublicPlans(),
      getPaymentMethods(),
    ])
    const found = plans.find((p) => p.plan_key.toLowerCase() === planKey.value)
    if (!found) {
      error.value = t('common.error')
      return
    }
    plan.value = found
    bankInfo.value = b
  } catch {
    error.value = t('common.error')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchMe()
  load()
})

async function proceedCheckout() {
  if (submitting.value || !plan.value) return
  submitting.value = true
  try {
    const tx = await createCheckout(plan.value.plan_key, selectedProvider.value)
    if (selectedProvider.value === 'manual') {
      router.push(`/billing/slip/${tx.id}`)
    } else {
      if (tx.payment_url) {
        window.location.href = tx.payment_url
      } else {
        router.push(`/billing/payments/${tx.id}`)
      }
    }
  } catch (err: any) {
    const msg = err?.data?.data?.error || err?.data?.message || 'Failed to initiate checkout'
    toastError(msg)
  } finally {
    submitting.value = false
  }
}

function goBack() {
  router.push('/settings/account?tab=plan')
}

const planName = computed(() => plan.value?.display_name ?? '')
const amountText = computed(() => formatCurrency(plan.value?.monthly_price_thb ?? 0, locale.value))
</script>

<template>
  <div class="min-h-dvh w-full flex flex-col items-center justify-start pt-8 sm:pt-12 pb-10 sm:pb-16 px-4 sm:px-6 overflow-x-hidden"
    style="background:#09090b">
    <div class="w-full max-w-7xl">
      <!-- Back -->
      <div class="flex items-center justify-between mb-6">
        <button class="flex items-center gap-1 text-sm text-white/50 hover:text-white/80 transition-colors"
          @click="goBack">
          ← {{ $t('common.back') }}
        </button>
        <LanguageSwitcher />
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center text-white/50 py-16">{{ $t('common.loading') }}</div>

      <!-- Error -->
      <div v-else-if="error" class="text-center text-red-400 py-16">{{ error }}</div>

      <template v-else-if="plan && bankInfo">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <!-- Left Column: Payment Method Options -->
          <div class="lg:col-span-7 space-y-4">
            <!-- Header -->
            <div class="mb-6">
              <h1 class="text-2xl font-bold text-white">{{ $t('billing.checkout.title') }}</h1>
              <p class="text-white/50 mt-1 text-sm">Select your preferred payment method to upgrade your account.</p>
            </div>

            <!-- Provider Selection Options -->
            <div class="space-y-3">
              <!-- Gateway Option (Omise / PromptPay QR / Credit Card) -->
              <div 
                @click="selectedProvider = 'omise'"
                class="rounded-2xl border p-4 sm:p-5 cursor-pointer transition-all flex items-start gap-4"
                :class="selectedProvider === 'omise' ? 'border-blue-500/80 bg-blue-500/[0.08] shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 'border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06]'"
              >
                <div class="mt-1 w-5 h-5 rounded-full border flex items-center justify-center shrink-0"
                  :class="selectedProvider === 'omise' ? 'border-blue-400 bg-blue-500' : 'border-white/30'">
                  <div v-if="selectedProvider === 'omise'" class="w-2 h-2 rounded-full bg-white" />
                </div>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <p class="text-white font-semibold">Payment Gateway (Automated)</p>
                    <span class="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase">Recommended</span>
                  </div>
                  <p class="text-white/50 text-sm mt-1">Pay instantly via PromptPay QR Code or Credit Card. Account upgrades automatically within seconds.</p>
                </div>
              </div>

              <!-- Manual Bank Transfer Option (Slip Upload) -->
              <div 
                @click="selectedProvider = 'manual'"
                class="rounded-2xl border p-4 sm:p-5 cursor-pointer transition-all flex items-start gap-4"
                :class="selectedProvider === 'manual' ? 'border-blue-500/80 bg-blue-500/[0.08] shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 'border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06]'"
              >
                <div class="mt-1 w-5 h-5 rounded-full border flex items-center justify-center shrink-0"
                  :class="selectedProvider === 'manual' ? 'border-blue-400 bg-blue-500' : 'border-white/30'">
                  <div v-if="selectedProvider === 'manual'" class="w-2 h-2 rounded-full bg-white" />
                </div>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <p class="text-white font-semibold">Direct Bank Transfer (Manual Slip Upload)</p>
                    <span class="text-[10px] font-medium tracking-wider px-2 py-0.5 rounded-full bg-white/[0.06] text-white/60 border border-white/10 uppercase">Fallback</span>
                  </div>
                  <p class="text-white/50 text-sm mt-1">Transfer directly to bank account and upload your payment slip for manual verification.</p>
                </div>
              </div>
            </div>

            <!-- Detailed Bank info if manual transfer is selected -->
            <div v-if="selectedProvider === 'manual'" class="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 sm:p-5 mt-4 space-y-4">
              <p class="text-white/50 text-xs uppercase tracking-wide">Bank Details for Direct Transfer</p>
              <div class="flex items-center gap-3">
                <div v-if="bankInfo.bank_logo_url" class="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                  <img :src="bankInfo.bank_logo_url" alt="bank logo" class="w-full h-full object-contain" />
                </div>
                <div class="w-10 h-10 rounded-xl bg-white/[0.07] flex items-center justify-center flex-shrink-0 text-white/40" v-else>
                  🏦
                </div>
                <div>
                  <p class="text-white font-medium">{{ bankInfo.bank_name }}</p>
                  <p class="text-white/50 text-sm">{{ bankInfo.bank_account_type }}</p>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="rounded-xl bg-white/[0.04] border border-white/[0.06] p-3">
                  <p class="text-white/40 text-xs mb-1">{{ $t('billing.slip.bankAccountInfo') }}</p>
                  <p class="text-white text-sm font-medium">{{ bankInfo.bank_account_name }}</p>
                </div>
                <div class="rounded-xl bg-white/[0.04] border border-white/[0.06] p-3">
                  <p class="text-white/40 text-xs mb-1">{{ $t('billing.slip.accountNumber') }}</p>
                  <p class="text-white text-sm font-mono font-bold tracking-wider">{{ bankInfo.bank_account_number }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Order Summary & Action -->
          <div class="lg:col-span-5 space-y-4 lg:pt-[84px]">
            <!-- Order summary -->
            <div class="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 sm:p-5">
              <p class="text-white/50 text-xs uppercase tracking-wide mb-3">{{ $t('billing.checkout.title') }}</p>
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p class="text-white font-semibold text-lg">{{ planName }} Plan</p>
                  <p class="text-white/40 text-sm">{{ $t('pricing.monthly') }}</p>
                </div>
                <p class="text-2xl font-bold text-blue-400">{{ amountText }}</p>
              </div>
            </div>

            <!-- Provider note -->
            <div class="rounded-xl border p-4 flex items-start gap-3"
              :class="selectedProvider === 'omise' ? 'border-blue-500/20 bg-blue-500/[0.06]' : 'border-yellow-500/20 bg-yellow-500/[0.05]'">
              <span class="text-lg mt-0.5" :class="selectedProvider === 'omise' ? 'text-blue-400' : 'text-yellow-400'">
                {{ selectedProvider === 'omise' ? '⚡' : '⚠' }}
              </span>
              <p class="text-sm leading-relaxed" :class="selectedProvider === 'omise' ? 'text-blue-300/90' : 'text-yellow-300/80'">
                <template v-if="selectedProvider === 'omise'">
                  Automated Gateway: Payment will be verified via secure webhook instantly.
                </template>
                <template v-else>
                  Manual Bank Transfer: Transfer exact amount <strong>{{ amountText }}</strong> and submit payment slip for admin review.
                </template>
              </p>
            </div>

            <!-- Actions -->
            <div class="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                class="w-full sm:flex-1 py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                :disabled="submitting"
                @click="proceedCheckout">
                <span v-if="submitting" class="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>{{ selectedProvider === 'omise' ? 'Pay Now via Gateway' : 'Proceed to Upload Slip' }}</span>
              </button>
              <button
                class="w-full sm:w-auto sm:px-6 py-3 rounded-xl border border-white/[0.08] text-white/60 hover:text-white hover:border-white/20 text-sm transition-colors"
                @click="goBack">
                {{ $t('common.cancel') }}
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
