<template>
  <div class="min-h-screen bg-[#FAFAFA] text-zinc-900 font-sans">
    <main class="pt-[24px]">
      <div class="max-w-7xl mx-auto px-6 py-10">
        <div class="mb-8">
          <h1 class="text-[22px] font-bold text-zinc-900">{{ $t('billing.payments.title') }}</h1>
          <p class="text-zinc-500 text-sm mt-1">{{ $t('billing.payments.subtitle') }}</p>
        </div>

        <div v-if="loading" class="space-y-4">
          <div class="h-16 rounded-xl bg-zinc-200 animate-pulse" />
          <div class="h-40 rounded-2xl bg-zinc-200 animate-pulse" />
        </div>

        <div v-else-if="payment" class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <!-- Left Column -->
          <div class="lg:col-span-7 space-y-4">
            <!-- Visual Progress Steps -->
            <div class="rounded-2xl border border-zinc-200 bg-white p-5 shadow-card">
              <p class="text-[12px] text-zinc-400 font-semibold uppercase tracking-wider mb-5">{{ $t('billing.payments.progressTitle') }}</p>
              
              <div class="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-4">
                <!-- Background Connecting Line (Desktop only) -->
                <div class="hidden md:block absolute top-[15px] left-8 right-8 h-[2px] bg-zinc-200 -z-10">
                  <div class="h-full bg-zinc-900 transition-all duration-500" :style="{ width: stepProgressWidth }" />
                </div>

                <!-- Step 1: Upload Slip -->
                <div class="flex md:flex-col items-center gap-3 md:gap-2 flex-1 w-full text-left md:text-center">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center border text-[13px] font-semibold transition-all shrink-0"
                    :class="step1Class">
                    <svg v-if="isStep1Completed" class="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                    </svg>
                    <span v-else>1</span>
                  </div>
                  <div>
                    <p class="text-[13px] font-semibold text-zinc-900">{{ $t('billing.payments.stepSubmitSlip') }}</p>
                    <p class="text-[11px] text-zinc-500 mt-0.5">{{ $t('billing.payments.stepSubmitSlipSub') }}</p>
                  </div>
                </div>

                <!-- Connecting Line for Mobile (vertical) -->
                <div class="md:hidden w-[2px] h-6 bg-zinc-200 ml-[15px] -my-3" :class="{'bg-zinc-900': payment.status !== 'expired'}" />

                <!-- Step 2: Review -->
                <div class="flex md:flex-col items-center gap-3 md:gap-2 flex-1 w-full text-left md:text-center">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center border text-[13px] font-semibold transition-all shrink-0"
                    :class="step2Class">
                    <svg v-if="payment.status === 'paid'" class="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                    </svg>
                    <svg v-else-if="isStep2Failed" class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                    <span v-else>2</span>
                  </div>
                  <div>
                    <p class="text-[13px] font-semibold" :class="payment.status === 'pending' ? 'text-zinc-900 font-bold' : 'text-zinc-900'">{{ $t('billing.payments.stepReview') }}</p>
                    <p class="text-[11px] text-zinc-500 mt-0.5">{{ step2Desc }}</p>
                  </div>
                </div>

                <!-- Connecting Line for Mobile (vertical) -->
                <div class="md:hidden w-[2px] h-6 bg-zinc-200 ml-[15px] -my-3" :class="{'bg-emerald-500': payment.status === 'paid', 'bg-red-500': isStep2Failed}" />

                <!-- Step 3: Upgraded -->
                <div class="flex md:flex-col items-center gap-3 md:gap-2 flex-1 w-full text-left md:text-center">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center border text-[13px] font-semibold transition-all shrink-0"
                    :class="step3Class">
                    <svg v-if="payment.status === 'paid'" class="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                    </svg>
                    <svg v-else-if="isStep2Failed" class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                    <span v-else>3</span>
                  </div>
                  <div>
                    <p class="text-[13px] font-semibold" :class="payment.status === 'paid' ? 'text-emerald-700' : 'text-zinc-900'">{{ $t('billing.payments.stepUpgrade') }}</p>
                    <p class="text-[11px] text-zinc-500 mt-0.5">{{ step3Desc }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Transaction Info -->
            <div class="rounded-2xl border p-5 shadow-card bg-white" :class="statusCardClass">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p class="text-[12px] text-zinc-500 mb-1">{{ $t('billing.payments.txStatusTitle') }}</p>
                  <p class="text-[18px] font-bold" :class="statusTextClass">{{ statusLabel }}</p>
                </div>
                <span class="text-[11px] font-semibold px-2.5 py-1 rounded-full border" :class="statusBadgeClass">
                  {{ payment.status.toUpperCase() }}
                </span>
              </div>
              <p class="text-[12px] text-zinc-500 mt-3">{{ $t('billing.payments.txId') }}: <span class="font-mono text-zinc-800" :title="payment.id">{{ readablePaymentId }}</span></p>
              <p class="text-[12px] text-zinc-500 mt-1.5">{{ $t('billing.payments.txRef') }}: <span class="font-mono text-zinc-800" :title="payment.checkout_reference">{{ readableCheckoutRef }}</span></p>
            </div>
          </div>

          <!-- Right Column -->
          <div class="lg:col-span-5 space-y-4">
            <div class="rounded-2xl border border-zinc-200 bg-white p-5 shadow-card space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="rounded-xl bg-zinc-50 border border-zinc-200 p-3.5">
                  <p class="text-[11px] text-zinc-400 mb-1">{{ $t('billing.payments.selectedPlan') }}</p>
                  <p class="text-[14px] font-semibold text-zinc-900">{{ planName }}</p>
                </div>
                <div class="rounded-xl bg-zinc-50 border border-zinc-200 p-3.5">
                  <p class="text-[11px] text-zinc-400 mb-1">{{ $t('billing.payments.amount') }}</p>
                  <p class="text-[14px] font-semibold text-zinc-900">฿{{ payment.amount_thb.toLocaleString() }} {{ payment.currency }}</p>
                </div>
                <div class="rounded-xl bg-zinc-50 border border-zinc-200 p-3.5">
                  <p class="text-[11px] text-zinc-400 mb-1">{{ $t('billing.payments.created') }}</p>
                  <p class="text-[14px] font-semibold text-zinc-900">{{ formatDateTime(payment.created_at) }}</p>
                </div>
                <div class="rounded-xl bg-zinc-50 border border-zinc-200 p-3.5">
                  <p class="text-[11px] text-zinc-400 mb-1">{{ $t('billing.payments.expires') }}</p>
                  <p class="text-[14px] font-semibold text-zinc-900">{{ formatDateTime(payment.expires_at) }}</p>
                </div>
              </div>

              <div v-if="payment.status === 'pending'" class="rounded-xl border p-4"
                :class="payment.slip_storage_id
                  ? 'border-amber-200 bg-amber-50'
                  : 'border-zinc-200 bg-zinc-50'">
                <template v-if="payment.slip_storage_id">
                  <p class="text-[13px] font-medium text-amber-900">{{ $t('billing.payments.awaitingReviewTitle') }}</p>
                  <p class="text-[12px] text-amber-800 mt-1">{{ $t('billing.payments.awaitingReviewDesc') }}</p>
                </template>
                <template v-else>
                  <p class="text-[13px] font-medium text-zinc-900">{{ $t('billing.payments.waitingPaymentTitle') }}</p>
                  <p class="text-[12px] text-zinc-600 mt-1">{{ $t('billing.payments.waitingPaymentDesc') }}</p>
                  <p class="text-[12px] text-zinc-600 mt-2 font-mono">{{ $t('billing.payments.timeRemaining') }} {{ remainingText }}</p>
                </template>
              </div>

              <div v-if="payment.status === 'paid'" class="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <p class="text-[13px] font-medium text-emerald-900">{{ $t('billing.payments.paidTitle') }}</p>
                <p class="text-[12px] text-emerald-800 mt-1">{{ $t('billing.payments.paidDesc') }}</p>
              </div>

              <div v-if="payment.status === 'failed' || payment.status === 'cancelled'" class="rounded-xl border border-red-200 bg-red-50 p-4">
                <p class="text-[13px] font-medium text-red-900">{{ $t('billing.payments.failedTitle') }}</p>
                <p class="text-[12px] text-red-800 mt-1">{{ $t('billing.payments.failedDesc') }}</p>
                <p v-if="reviewReason" class="text-[12px] text-red-900 mt-2">
                  {{ $t('billing.payments.rejectReason') }} <span class="font-medium">{{ reviewReason }}</span>
                </p>
              </div>

              <div class="flex flex-wrap gap-2 pt-2">
                <a
                  v-if="payment.status === 'pending' && payment.payment_url && !payment.slip_storage_id"
                  :href="payment.payment_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold bg-zinc-900 hover:bg-zinc-800 text-white transition-colors shadow-xs"
                >
                  {{ $t('billing.payments.openPaymentBtn') }}
                </a>
                <NuxtLink
                  v-if="payment.status === 'pending' && !payment.slip_storage_id"
                  :to="`/billing/slip/${payment.id}`"
                  class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold bg-zinc-900 hover:bg-zinc-800 text-white transition-colors shadow-xs"
                >
                  {{ $t('billing.payments.uploadSlipBtn') }}
                </NuxtLink>
                <button
                  @click="refreshNow"
                  :disabled="refreshing"
                  class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium border border-zinc-200 bg-white hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-zinc-700 shadow-xs cursor-pointer"
                >
                  {{ refreshing ? $t('billing.payments.refreshing') : $t('billing.payments.refreshBtn') }}
                </button>
                <NuxtLink
                  to="/settings/account?tab=plan"
                  class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium border border-zinc-200 bg-white hover:bg-zinc-50 transition-colors text-zinc-700 shadow-xs cursor-pointer"
                >
                  {{ $t('billing.payments.backToPlanBtn') }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-card">
          <p class="text-red-900 text-[14px] font-medium">{{ $t('common.error') }}</p>
        </div>
      </div>
    </main>

    <Teleport to="body">
      <Transition
        enter-from-class="opacity-0"
        enter-active-class="transition duration-200"
        leave-to-class="opacity-0"
        leave-active-class="transition duration-150"
      >
        <div
          v-if="refreshing"
          class="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs"
        >
          <div class="relative w-full max-w-[320px] rounded-2xl border border-zinc-200 bg-white shadow-modal p-6 flex flex-col items-center text-center">
            <!-- Animated Spinner -->
            <div class="relative w-10 h-10 flex items-center justify-center mb-4">
              <div class="absolute inset-0 rounded-full border-2 border-zinc-200"></div>
              <div class="absolute inset-0 rounded-full border-2 border-t-zinc-900 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            </div>

            <h3 class="text-zinc-900 font-semibold text-[14px] mb-1">{{ $t('billing.payments.modalCheckingTitle') }}</h3>
            <p class="text-zinc-500 text-[12px]">{{ $t('billing.payments.modalCheckingDesc') }}</p>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { PaymentTransaction } from '~/composables/useBilling'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const router = useRouter()
const { error: toastError, success } = useToast()
const { user, fetchMe, refreshMe } = useAuth()
const { getPayment, toPlanDisplayName } = useBilling()
const { t, locale } = useI18n()

useHead({
  htmlAttrs: {
    lang: computed(() => locale.value)
  }
})

const payment = ref<PaymentTransaction | null>(null)
const loading = ref(true)
const refreshing = ref(false)
const pollTimer = ref<ReturnType<typeof setInterval> | null>(null)
const countdownTimer = ref<ReturnType<typeof setInterval> | null>(null)
const nowMs = ref(Date.now())
const upgradedNotified = ref(false)

const paymentId = computed(() => String(route.params.id ?? '').trim())

function toReadableId(raw: string | null | undefined, prefix: string) {
  if (!raw) return '-'
  const cleaned = raw.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
  if (!cleaned) return '-'
  if (cleaned.length <= 8) return `${prefix}-${cleaned}`
  if (cleaned.length <= 12) return `${prefix}-${cleaned.slice(0, 4)}-${cleaned.slice(4)}`
  return `${prefix}-${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(-4)}`
}

const readablePaymentId = computed(() => toReadableId(payment.value?.id, 'PMT'))
const readableCheckoutRef = computed(() => toReadableId(payment.value?.checkout_reference, 'REF'))

const reviewReason = computed(() => {
  const p = payment.value as Record<string, any> | null
  if (!p) return ''

  const direct = p.review_reason ?? p.ReviewReason
  if (typeof direct === 'string' && direct.trim() !== '') {
    return direct.trim()
  }

  const meta = p.metadata
  if (meta && typeof meta === 'object') {
    const m = meta as Record<string, unknown>
    const fromMeta = m.review_reason ?? m.reject_reason ?? m.reason
    if (typeof fromMeta === 'string' && fromMeta.trim() !== '') {
      return fromMeta.trim()
    }
  }

  return ''
})

const statusLabel = computed(() => {
  const p = payment.value
  if (!p) return 'Unknown status'
  if (p.status === 'pending' && p.slip_storage_id) return 'Slip submitted – pending review'
  switch (p.status) {
    case 'pending':   return 'Pending confirmation'
    case 'paid':      return 'Paid'
    case 'failed':    return 'Payment failed'
    case 'cancelled': return 'Payment cancelled'
    case 'expired':   return 'Payment expired'
    default:          return 'Unknown status'
  }
})

const statusCardClass = computed(() => {
  const status = payment.value?.status
  if (status === 'paid') return 'border-emerald-200 bg-emerald-50'
  if (status === 'pending') return 'border-zinc-200 bg-zinc-50'
  return 'border-red-200 bg-red-50'
})

const statusTextClass = computed(() => {
  const status = payment.value?.status
  if (status === 'paid') return 'text-emerald-800'
  if (status === 'pending') return 'text-zinc-900'
  return 'text-red-800'
})

const statusBadgeClass = computed(() => {
  const status = payment.value?.status
  if (status === 'paid') return 'border-emerald-200 bg-emerald-100 text-emerald-800'
  if (status === 'pending') return 'border-zinc-200 bg-zinc-100 text-zinc-800'
  return 'border-red-200 bg-red-100 text-red-800'
})

const planName = computed(() => toPlanDisplayName(payment.value?.plan_key ?? '', user.value))

const remainingText = computed(() => {
  if (!payment.value) return '-'
  if (payment.value.status !== 'pending') return '-'
  const diffMs = new Date(payment.value.expires_at).getTime() - nowMs.value
  if (diffMs <= 0) return 'Expired'
  const totalSeconds = Math.floor(diffMs / 1000)
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds % 60
  return `${mins}m ${secs.toString().padStart(2, '0')}s`
})

function formatDateTime(dateTime: string) {
  const date = new Date(dateTime)
  return date.toLocaleString()
}

async function loadPayment() {
  if (!paymentId.value) return
  const data = await getPayment(paymentId.value)
  payment.value = data

  if (data.status === 'paid' && !upgradedNotified.value) {
    upgradedNotified.value = true
    await refreshMe()
    success('Payment confirmed. Your plan was upgraded.')
  }
}

function stopPolling() {
  if (!pollTimer.value) return
  clearInterval(pollTimer.value)
  pollTimer.value = null
}

function stopCountdown() {
  if (!countdownTimer.value) return
  clearInterval(countdownTimer.value)
  countdownTimer.value = null
}

function ensureCountdown() {
  stopCountdown()
  if (payment.value?.status !== 'pending') return
  countdownTimer.value = setInterval(() => {
    nowMs.value = Date.now()
  }, 1000)
}

function ensurePolling() {
  stopPolling()
  if (payment.value?.status !== 'pending') return
  pollTimer.value = setInterval(async () => {
    try {
      await loadPayment()
      if (payment.value?.status !== 'pending') {
        stopPolling()
        stopCountdown()
      }
    } catch {
      // ignore transient polling errors
    }
  }, 4000)
}

async function refreshNow() {
  refreshing.value = true
  try {
    await loadPayment()
    ensurePolling()
    ensureCountdown()
  } catch (err: any) {
    const msg = err?.data?.data?.error || err?.data?.message || 'Failed to refresh payment status.'
    toastError(msg)
  } finally {
    refreshing.value = false
  }
}

const isStep1Completed = computed(() => !!payment.value?.slip_storage_id)

const stepProgressWidth = computed(() => {
  if (!payment.value) return '0%'
  if (payment.value.status === 'paid') return '100%'
  if (payment.value.status === 'pending' && payment.value.slip_storage_id) return '50%'
  if (payment.value.status === 'failed' || payment.value.status === 'cancelled' || payment.value.status === 'expired') return '100%'
  return '0%'
})

const step1Class = computed(() => {
  if (isStep1Completed.value) return 'border-emerald-200 bg-emerald-50 text-emerald-800'
  return 'border-zinc-300 bg-zinc-100 text-zinc-900 font-bold'
})

const isStep2Failed = computed(() => {
  const status = payment.value?.status
  return status === 'failed' || status === 'cancelled' || status === 'expired'
})

const step2Class = computed(() => {
  if (!payment.value) return 'border-zinc-200 text-zinc-400 bg-zinc-50'
  if (payment.value.status === 'paid') return 'border-emerald-200 bg-emerald-50 text-emerald-800'
  if (isStep2Failed.value) return 'border-red-200 bg-red-50 text-red-800'
  if (payment.value.status === 'pending' && payment.value.slip_storage_id) {
    return 'border-zinc-900 bg-zinc-900 text-white font-bold'
  }
  return 'border-zinc-200 text-zinc-400 bg-zinc-50'
})

const step2Desc = computed(() => {
  if (!payment.value) return t('billing.payments.stepReviewSub')
  if (payment.value.status === 'paid') return t('billing.payments.stepReviewApproved')
  if (isStep2Failed.value) return t('billing.payments.stepReviewFailed')
  if (payment.value.status === 'pending' && payment.value.slip_storage_id) return t('billing.payments.stepReviewVerifying')
  return t('billing.payments.stepReviewWaiting')
})

const step3Class = computed(() => {
  if (!payment.value) return 'border-zinc-200 text-zinc-400 bg-zinc-50'
  if (payment.value.status === 'paid') return 'border-emerald-200 bg-emerald-50 text-emerald-800'
  if (isStep2Failed.value) return 'border-red-200 bg-red-50 text-red-800'
  return 'border-zinc-200 text-zinc-400 bg-zinc-50'
})

const step3Desc = computed(() => {
  if (!payment.value) return t('billing.payments.stepUpgradeSub')
  if (payment.value.status === 'paid') return t('billing.payments.stepUpgradeActive')
  if (isStep2Failed.value) return t('billing.payments.stepUpgradeFailed')
  return t('billing.payments.stepUpgradeSub')
})

onMounted(async () => {
  await fetchMe()
  try {
    await loadPayment()
    ensurePolling()
    ensureCountdown()
  } catch (err: any) {
    const msg = err?.data?.data?.error || err?.data?.message || 'Failed to load payment.'
    toastError(msg)
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  stopPolling()
  stopCountdown()
})
</script>
