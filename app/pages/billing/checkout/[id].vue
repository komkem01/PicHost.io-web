<script setup lang="ts">
import { formatCurrency, formatBytes } from '~/utils/format'
import { OpenPaymentConflictError } from '~/composables/useBilling'
import type { BankInfo, PublicPlanSetting } from '~/composables/useBilling'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const router = useRouter()
const { fetchMe, resendVerification, user } = useAuth()
const { listPublicPlans, getPaymentMethods, createCheckout } = useBilling()
const { error: toastError, success: toastSuccess } = useToast()
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
const copiedAccNumber = ref(false)

const selectedProvider = ref<'omise' | 'manual'>('omise')

const isUnverified = computed(() => !!(user.value && !user.value.is_guest && !user.value.email_verified_at))

const resendingNotice = ref(false)
const noticeCooldown = ref(0)
const noticeSuccessMsg = ref('')
const noticeErrorMsg = ref('')
let noticeCooldownTimer: ReturnType<typeof setInterval> | null = null

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
    if (err instanceof OpenPaymentConflictError && err.paymentId) {
      toastError(t('billing.checkout.openPaymentConflictMsg'))
      router.push(`/billing/payments/${err.paymentId}`)
      return
    }

    const errMsg = err?.data?.data?.error || err?.data?.message || ''
    const msg = errMsg || t('common.error')
    toastError(msg)
  } finally {
    submitting.value = false
  }
}

function startNoticeCooldown(sec: number) {
  noticeCooldown.value = sec
  if (noticeCooldownTimer) clearInterval(noticeCooldownTimer)
  noticeCooldownTimer = setInterval(() => {
    noticeCooldown.value--
    if (noticeCooldown.value <= 0) {
      if (noticeCooldownTimer) clearInterval(noticeCooldownTimer)
      noticeCooldownTimer = null
    }
  }, 1000)
}

async function handleNoticeResend() {
  if (resendingNotice.value || noticeCooldown.value > 0) return
  resendingNotice.value = true
  noticeSuccessMsg.value = ''
  noticeErrorMsg.value = ''

  try {
    const msg = await resendVerification()
    const succMsg = locale.value === 'th' ? 'ส่งอีเมลยืนยันเรียบร้อยแล้ว! กรุณาตรวจสอบกล่องข้อความ หรือโฟลเดอร์ขยะ (Spam / Junk)' : (msg || 'Verification email sent! Please check your inbox or spam/junk folder.')
    noticeSuccessMsg.value = succMsg
    toastSuccess(succMsg)
    startNoticeCooldown(60)
  } catch (err: any) {
    const errMsg = err?.data?.message || err?.message || (locale.value === 'th' ? 'ไม่สามารถส่งอีเมลยืนยันได้' : 'Failed to send verification email')
    noticeErrorMsg.value = errMsg
    toastError(errMsg)
  } finally {
    resendingNotice.value = false
  }
}

onUnmounted(() => {
  if (noticeCooldownTimer) clearInterval(noticeCooldownTimer)
})

function copyAccountNumber() {
  if (!bankInfo.value?.bank_account_number) return
  navigator.clipboard.writeText(bankInfo.value.bank_account_number)
  copiedAccNumber.value = true
  toastSuccess(t('billing.checkout.copiedAccount'))
  setTimeout(() => {
    copiedAccNumber.value = false
  }, 2000)
}

function goBack() {
  router.push('/settings/account?tab=plan')
}

const planName = computed(() => {
  if (!plan.value) return ''
  return plan.value.display_name ?? plan.value.plan_key.toUpperCase()
})
const amountText = computed(() => formatCurrency(plan.value?.monthly_price_thb ?? 0, locale.value))
</script>

<template>
  <div class="min-h-screen w-full flex flex-col items-center justify-start pt-6 sm:pt-10 pb-16 sm:pb-24 px-4 sm:px-6 bg-[#FAFAFA] text-zinc-900 font-sans">
    <div class="w-full max-w-5xl space-y-6 sm:space-y-8">
      
      <!-- Top Navigation & Breadcrumb -->
      <div class="flex items-center justify-between">
        <button
          type="button"
          @click="goBack"
          class="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>{{ locale === 'th' ? 'กลับไปยังหน้าแพ็กเกจ' : 'Back to Plans' }}</span>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="py-24 text-center">
        <AppSpinner size="lg" class="mx-auto" />
      </div>

      <!-- Error State -->
      <div v-else-if="error || !plan || !bankInfo" class="rounded-2xl border border-red-200 bg-white p-8 text-center space-y-4 shadow-card">
        <p class="text-red-600 font-semibold">{{ error || $t('common.error') }}</p>
        <button @click="goBack" class="px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-semibold">
          {{ $t('common.cancel') }}
        </button>
      </div>

      <!-- Content -->
      <template v-else>
        <!-- Page Title & Header -->
        <div class="space-y-1 text-left border-b border-zinc-200/80 pb-6">
          <h1 class="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
            {{ $t('billing.checkout.title') }}
          </h1>
          <p class="text-zinc-500 text-xs sm:text-sm">
            {{ $t('billing.checkout.subtitle') }}
          </p>
        </div>

        <!-- Proactive, non-blocking notice for unverified accounts -->
        <div
          v-if="isUnverified"
          class="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-start gap-4"
        >
          <div class="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>

          <div class="flex-1 min-w-0 space-y-2">
            <p class="text-sm font-bold text-amber-900">
              {{ $t('billing.checkout.verifyNoticeTitle') }}
            </p>
            <p class="text-xs sm:text-sm text-amber-800/90 leading-relaxed">
              {{ $t('billing.checkout.verifyNoticeDesc') }}
            </p>

            <div v-if="noticeSuccessMsg" class="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200 inline-block">
              {{ noticeSuccessMsg }}
            </div>
            <div v-else-if="noticeErrorMsg" class="text-xs font-semibold text-red-700 bg-red-50 px-2.5 py-1.5 rounded-lg border border-red-200 inline-block">
              {{ noticeErrorMsg }}
            </div>

            <div class="pt-1">
              <button
                type="button"
                @click="handleNoticeResend"
                :disabled="resendingNotice || noticeCooldown > 0"
                class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <AppSpinner v-if="resendingNotice" size="sm" />
                <template v-if="noticeCooldown > 0">
                  {{ $t('billing.checkout.verifyNoticeCooldownBtn', { seconds: noticeCooldown }) }}
                </template>
                <template v-else-if="resendingNotice">
                  {{ $t('billing.checkout.verifyNoticeResendingBtn') }}
                </template>
                <template v-else>
                  {{ $t('billing.checkout.verifyNoticeResendBtn') }}
                </template>
              </button>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <!-- Left Column: Payment Options (7 cols) -->
          <div class="lg:col-span-7 space-y-6">
            <div class="space-y-4">
              <h2 class="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                {{ $t('billing.checkout.paymentMethod') }}
              </h2>

              <!-- Option 1: Automated PromptPay QR (Omise Gateway) -->
              <div 
                @click="selectedProvider = 'omise'"
                class="relative rounded-2xl border p-5 sm:p-6 cursor-pointer transition-all duration-200 flex items-start gap-4 bg-white group shadow-2xs"
                :class="selectedProvider === 'omise' ? 'border-zinc-900 ring-2 ring-zinc-900/10 shadow-md' : 'border-zinc-200/80 hover:border-zinc-300 hover:shadow-xs'"
              >
                <!-- Custom Radio Button -->
                <div class="mt-1 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors"
                  :class="selectedProvider === 'omise' ? 'border-zinc-900 bg-zinc-900' : 'border-zinc-300 group-hover:border-zinc-400'">
                  <div v-if="selectedProvider === 'omise'" class="w-2 h-2 rounded-full bg-white" />
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex flex-wrap items-center justify-between gap-2">
                    <div class="flex items-center gap-2.5">
                      <div class="w-9 h-9 rounded-xl bg-zinc-100 border border-zinc-200/60 flex items-center justify-center shrink-0">
                        <svg class="w-5 h-5 text-zinc-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p class="text-zinc-900 font-bold text-base">
                        {{ $t('billing.checkout.gatewayTitle') }}
                      </p>
                    </div>
                    <span class="text-[10px] font-extrabold tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 uppercase">
                      {{ $t('billing.checkout.gatewayBadge') }}
                    </span>
                  </div>
                  <p class="text-zinc-500 text-xs sm:text-sm mt-2 leading-relaxed pl-11">
                    {{ $t('billing.checkout.gatewayDesc') }}
                  </p>
                </div>
              </div>

              <!-- Option 2: Direct Bank Transfer (Manual Slip Upload) -->
              <div 
                @click="selectedProvider = 'manual'"
                class="relative rounded-2xl border p-5 sm:p-6 cursor-pointer transition-all duration-200 flex items-start gap-4 bg-white group shadow-2xs"
                :class="selectedProvider === 'manual' ? 'border-zinc-900 ring-2 ring-zinc-900/10 shadow-md' : 'border-zinc-200/80 hover:border-zinc-300 hover:shadow-xs'"
              >
                <!-- Custom Radio Button -->
                <div class="mt-1 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors"
                  :class="selectedProvider === 'manual' ? 'border-zinc-900 bg-zinc-900' : 'border-zinc-300 group-hover:border-zinc-400'">
                  <div v-if="selectedProvider === 'manual'" class="w-2 h-2 rounded-full bg-white" />
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex flex-wrap items-center justify-between gap-2">
                    <div class="flex items-center gap-2.5">
                      <div class="w-9 h-9 rounded-xl bg-zinc-100 border border-zinc-200/60 flex items-center justify-center shrink-0">
                        <svg class="w-5 h-5 text-zinc-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 10h18M3 14h18m-9-4v8m-4-8v8m8-8v8M4 10V6l8-3 8 3v4M4 21h16" />
                        </svg>
                      </div>
                      <p class="text-zinc-900 font-bold text-base">
                        {{ $t('billing.checkout.manualTitle') }}
                      </p>
                    </div>
                    <span class="text-[10px] font-semibold tracking-wider px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200/60 uppercase">
                      {{ $t('billing.checkout.manualBadge') }}
                    </span>
                  </div>
                  <p class="text-zinc-500 text-xs sm:text-sm mt-2 leading-relaxed pl-11">
                    {{ $t('billing.checkout.manualDesc') }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Expanded Bank Details Box when Direct Transfer is selected -->
            <Transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="transform -translate-y-2 opacity-0"
              enter-to-class="transform translate-y-0 opacity-100"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="transform translate-y-0 opacity-100"
              leave-to-class="transform -translate-y-2 opacity-0"
            >
              <div v-if="selectedProvider === 'manual'" class="rounded-2xl border border-zinc-200/80 bg-white shadow-sm p-5 sm:p-6 space-y-5">
                <div class="flex items-center justify-between border-b border-zinc-100 pb-3">
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h5m0 0v-5a2 2 0 00-2-2h-2a2 2 0 00-2 2v5" />
                    </svg>
                    <p class="text-xs font-bold uppercase tracking-wider text-zinc-500">
                      {{ $t('billing.checkout.bankDetailsTitle') }}
                    </p>
                  </div>
                  <span class="text-[11px] text-zinc-400 font-medium">PicHost.io Co., Ltd.</span>
                </div>

                <div class="flex items-center gap-4">
                  <div v-if="bankInfo.bank_logo_url" class="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-zinc-200/60 shadow-2xs">
                    <img :src="bankInfo.bank_logo_url" alt="bank logo" class="w-full h-full object-contain" />
                  </div>
                  <div v-else class="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200/60 flex items-center justify-center shrink-0">
                    <svg class="w-6 h-6 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 10h18M3 14h18m-9-4v8m-4-8v8m8-8v8M4 10V6l8-3 8 3v4M4 21h16" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-zinc-900 font-bold text-base">{{ bankInfo.bank_name }}</p>
                    <p class="text-zinc-500 text-xs sm:text-sm">{{ bankInfo.bank_account_type || 'Savings Account' }}</p>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div class="rounded-xl bg-zinc-50/80 border border-zinc-200/70 p-4">
                    <p class="text-zinc-400 text-xs font-semibold mb-1 uppercase tracking-wider">{{ $t('billing.checkout.accountName') }}</p>
                    <p class="text-zinc-900 text-sm font-bold">{{ bankInfo.bank_account_name }}</p>
                  </div>
                  <div class="rounded-xl bg-zinc-50/80 border border-zinc-200/70 p-4">
                    <p class="text-zinc-400 text-xs font-semibold mb-1 uppercase tracking-wider">{{ $t('billing.checkout.accountNumber') }}</p>
                    <div class="flex items-center justify-between gap-2">
                      <p class="text-zinc-900 text-base font-mono font-extrabold tracking-wider">{{ bankInfo.bank_account_number }}</p>
                      <button
                        type="button"
                        @click.stop="copyAccountNumber"
                        class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 font-semibold transition-all shadow-2xs cursor-pointer shrink-0">
                        <svg v-if="copiedAccNumber" class="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        <svg v-else class="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>{{ copiedAccNumber ? $t('billing.checkout.copiedAccount') : $t('billing.checkout.copyAccount') }}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Right Column: Order Summary (5 cols) -->
          <div class="lg:col-span-5 space-y-5">
            <div class="rounded-2xl border border-zinc-200/80 bg-white shadow-sm p-6 sm:p-7 space-y-6">
              <h2 class="text-xs font-extrabold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 pb-3">
                {{ $t('billing.checkout.summaryHeader') }}
              </h2>

              <!-- Plan & Price Row -->
              <div class="space-y-3">
                <div class="flex items-start justify-between">
                  <div>
                    <p class="text-zinc-900 font-black text-xl sm:text-2xl">{{ planName }}</p>
                    <p class="text-zinc-500 text-xs mt-0.5">{{ $t('billing.checkout.monthly') }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">{{ amountText }}</p>
                    <p class="text-[11px] text-zinc-400 font-medium">/ {{ $t('pricing.monthly').replace('/', '').trim() }}</p>
                  </div>
                </div>
              </div>

              <!-- Included Plan Benefits -->
              <div class="border-t border-zinc-100 pt-5 space-y-3">
                <p class="text-xs font-bold text-zinc-800 uppercase tracking-wider">{{ $t('billing.checkout.benefitsTitle') }}</p>
                <ul class="space-y-2.5 text-xs sm:text-sm text-zinc-600 font-medium">
                  <li class="flex items-center gap-2.5">
                    <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span>{{ $t('pricing.features.storage', { size: formatBytes(plan.storage_bytes) }) }}</span>
                  </li>
                  <li class="flex items-center gap-2.5">
                    <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span>{{ $t('pricing.features.maxFileSize', { size: formatBytes(plan.max_file_size_bytes) }) }}</span>
                  </li>
                  <li class="flex items-center gap-2.5">
                    <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span>{{ $t('pricing.features.bandwidth', { size: formatBytes(plan.monthly_bandwidth_bytes) }) }}</span>
                  </li>
                  <li v-if="plan.allow_api" class="flex items-center gap-2.5">
                    <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span>{{ $t('pricing.features.apiAccess') }}</span>
                  </li>
                </ul>
              </div>

              <!-- Total price row -->
              <div class="border-t border-zinc-200/80 pt-4 flex items-center justify-between">
                <span class="text-sm font-bold text-zinc-900">{{ $t('billing.checkout.totalLabel') }}</span>
                <span class="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">{{ amountText }}</span>
              </div>

              <!-- Action buttons -->
              <div class="space-y-3 pt-2">
                <button
                  class="w-full py-3.5 px-6 rounded-xl bg-zinc-900 hover:bg-zinc-800 active:scale-[0.99] text-white font-bold text-sm sm:text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  :disabled="submitting"
                  @click="proceedCheckout">
                  <span v-if="submitting" class="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>
                    {{ selectedProvider === 'omise' ? $t('billing.checkout.payGatewayBtn') : $t('billing.checkout.proceedSlipBtn') }}
                  </span>
                </button>

                <button
                  class="w-full py-2.5 rounded-xl border border-zinc-200/80 bg-white hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900 text-xs font-semibold transition-colors cursor-pointer"
                  @click="goBack">
                  {{ $t('common.cancel') }}
                </button>
              </div>
            </div>

            <!-- Security Trust Badges -->
            <div class="rounded-2xl border border-zinc-200/70 bg-white p-4 space-y-2.5 shadow-2xs">
              <div class="flex items-center gap-2.5 text-xs text-zinc-600 font-medium">
                <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>{{ $t('billing.checkout.securePayment') }}</span>
              </div>
              <div class="flex items-center gap-2.5 text-xs text-zinc-600 font-medium">
                <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>{{ $t('billing.checkout.instantActivation') }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
