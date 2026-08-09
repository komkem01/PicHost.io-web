<template>
  <div class="min-h-screen bg-[#09090b] text-white font-sans">
    <main class="pt-[24px]">
      <div class="max-w-7xl mx-auto px-6 py-10">
        <div class="mb-8">
          <h1 class="text-[22px] font-bold text-white">Payment Status</h1>
          <p class="text-white/35 text-sm mt-1">Track your payment verification process and upgrade state.</p>
        </div>

        <div v-if="loading" class="space-y-4">
          <div class="h-16 rounded-xl bg-white/[0.04] animate-pulse" />
          <div class="h-40 rounded-2xl bg-white/[0.03] animate-pulse" />
        </div>

        <div v-else-if="payment" class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <!-- Left Column -->
          <div class="lg:col-span-7 space-y-4">
            <!-- Visual Progress Steps -->
            <div class="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
              <p class="text-[12px] text-white/35 uppercase tracking-wider mb-5">Order Progress</p>
              
              <div class="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-4">
                <!-- Background Connecting Line (Desktop only) -->
                <div class="hidden md:block absolute top-[15px] left-8 right-8 h-[2px] bg-white/[0.06] -z-10">
                  <div class="h-full bg-blue-500 transition-all duration-500" :style="{ width: stepProgressWidth }" />
                </div>

                <!-- Step 1: Upload Slip -->
                <div class="flex md:flex-col items-center gap-3 md:gap-2 flex-1 w-full text-left md:text-center">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center border text-[13px] font-semibold transition-all shrink-0"
                    :class="step1Class">
                    <svg v-if="isStep1Completed" class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                    </svg>
                    <span v-else>1</span>
                  </div>
                  <div>
                    <p class="text-[13px] font-semibold text-white">Submit Slip</p>
                    <p class="text-[11px] text-white/40 mt-0.5">Slip uploaded</p>
                  </div>
                </div>

                <!-- Connecting Line for Mobile (vertical) -->
                <div class="md:hidden w-[2px] h-6 bg-white/[0.06] ml-[15px] -my-3" :class="{'bg-blue-500/50': payment.status !== 'expired'}" />

                <!-- Step 2: Review -->
                <div class="flex md:flex-col items-center gap-3 md:gap-2 flex-1 w-full text-left md:text-center">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center border text-[13px] font-semibold transition-all shrink-0"
                    :class="step2Class">
                    <svg v-if="payment.status === 'paid'" class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                    </svg>
                    <svg v-else-if="isStep2Failed" class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                    <span v-else>2</span>
                  </div>
                  <div>
                    <p class="text-[13px] font-semibold" :class="payment.status === 'pending' ? 'text-blue-300' : 'text-white'">Review Slip</p>
                    <p class="text-[11px] text-white/40 mt-0.5">{{ step2Desc }}</p>
                  </div>
                </div>

                <!-- Connecting Line for Mobile (vertical) -->
                <div class="md:hidden w-[2px] h-6 bg-white/[0.06] ml-[15px] -my-3" :class="{'bg-emerald-500/50': payment.status === 'paid', 'bg-red-500/50': isStep2Failed}" />

                <!-- Step 3: Upgraded -->
                <div class="flex md:flex-col items-center gap-3 md:gap-2 flex-1 w-full text-left md:text-center">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center border text-[13px] font-semibold transition-all shrink-0"
                    :class="step3Class">
                    <svg v-if="payment.status === 'paid'" class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                    </svg>
                    <svg v-else-if="isStep2Failed" class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                    <span v-else>3</span>
                  </div>
                  <div>
                    <p class="text-[13px] font-semibold" :class="payment.status === 'paid' ? 'text-emerald-300' : 'text-white'">Upgrade Plan</p>
                    <p class="text-[11px] text-white/40 mt-0.5">{{ step3Desc }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Transaction Info -->
            <div class="rounded-xl border p-5" :class="statusCardClass">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p class="text-[12px] text-white/45 mb-1">Transaction status</p>
                  <p class="text-[18px] font-bold" :class="statusTextClass">{{ statusLabel }}</p>
                </div>
                <span class="text-[11px] font-semibold px-2.5 py-1 rounded-full border" :class="statusBadgeClass">
                  {{ payment.status.toUpperCase() }}
                </span>
              </div>
              <p class="text-[12px] text-white/45 mt-3">Payment ID: <span class="font-mono text-white/80" :title="payment.id">{{ readablePaymentId }}</span></p>
              <p class="text-[12px] text-white/45 mt-1.5">Ref: <span class="font-mono text-white/80" :title="payment.checkout_reference">{{ readableCheckoutRef }}</span></p>
            </div>
          </div>

          <!-- Right Column -->
          <div class="lg:col-span-5 space-y-4">
            <div class="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3.5">
                  <p class="text-[11px] text-white/30 mb-1">Selected plan</p>
                  <p class="text-[14px] font-semibold">{{ planName }}</p>
                </div>
                <div class="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3.5">
                  <p class="text-[11px] text-white/30 mb-1">Amount</p>
                  <p class="text-[14px] font-semibold">฿{{ payment.amount_thb.toLocaleString() }} {{ payment.currency }}</p>
                </div>
                <div class="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3.5">
                  <p class="text-[11px] text-white/30 mb-1">Created</p>
                  <p class="text-[14px] font-semibold">{{ formatDateTime(payment.created_at) }}</p>
                </div>
                <div class="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3.5">
                  <p class="text-[11px] text-white/30 mb-1">Expires</p>
                  <p class="text-[14px] font-semibold">{{ formatDateTime(payment.expires_at) }}</p>
                </div>
              </div>

              <div v-if="payment.status === 'pending'" class="rounded-xl border p-4"
                :class="payment.slip_storage_id
                  ? 'border-yellow-500/20 bg-yellow-500/[0.05]'
                  : 'border-blue-500/20 bg-blue-500/[0.06]'">
                <template v-if="payment.slip_storage_id">
                  <p class="text-[13px] font-medium text-yellow-300">Slip Submitted — Awaiting Review</p>
                  <p class="text-[12px] text-yellow-300/70 mt-1">Our team is verifying your slip. Your plan will be upgraded within 1–24 hours. This page auto-refreshes every 4 seconds.</p>
                </template>
                <template v-else>
                  <p class="text-[13px] font-medium text-blue-300">Waiting for confirmation</p>
                  <p class="text-[12px] text-blue-300/70 mt-1">This page refreshes automatically every 4 seconds. Your plan will be upgraded automatically once payment is confirmed.</p>
                  <p class="text-[12px] text-blue-300/70 mt-2">Time remaining: {{ remainingText }}</p>
                </template>
              </div>

              <div v-if="payment.status === 'paid'" class="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4">
                <p class="text-[13px] font-medium text-emerald-300">Payment successful</p>
                <p class="text-[12px] text-emerald-300/70 mt-1">Your plan is upgraded and available immediately.</p>
              </div>

              <div v-if="payment.status === 'failed' || payment.status === 'cancelled'" class="rounded-xl border border-red-500/25 bg-red-500/[0.06] p-4">
                <p class="text-[13px] font-medium text-red-300">Payment was not approved</p>
                <p class="text-[12px] text-red-300/75 mt-1">Please submit a new payment with the correct transfer details.</p>
                <p v-if="reviewReason" class="text-[12px] text-red-200/85 mt-2">
                  Reason: <span class="font-medium">{{ reviewReason }}</span>
                </p>
              </div>

              <div class="flex flex-wrap gap-2 pt-2">
                <a
                  v-if="payment.status === 'pending' && payment.payment_url && !payment.slip_storage_id"
                  :href="payment.payment_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                >
                  Open payment page
                </a>
                <NuxtLink
                  v-if="payment.status === 'pending' && !payment.slip_storage_id"
                  :to="`/billing/slip/${payment.id}`"
                  class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                >
                  Upload slip
                </NuxtLink>
                <button
                  @click="refreshNow"
                  :disabled="refreshing"
                  class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {{ refreshing ? 'Refreshing…' : 'Refresh status' }}
                </button>
                <NuxtLink
                  to="/settings/account?tab=plan"
                  class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
                >
                  Back to Plan
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="rounded-2xl border border-red-500/15 bg-red-500/[0.03] p-5">
          <p class="text-red-300 text-[14px] font-medium">Unable to load payment.</p>
          <p class="text-red-300/70 text-[12px] mt-1">Please check transaction id and try again.</p>
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
          class="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        >
          <div class="relative w-full max-w-[320px] rounded-2xl border border-white/[0.08] bg-[#111113]/90 shadow-2xl p-6 flex flex-col items-center text-center">
            <!-- Top shimmer line -->
            <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/35 to-transparent rounded-t-2xl"></div>

            <!-- Animated Spinner with multiple rings or glow -->
            <div class="relative w-10 h-10 flex items-center justify-center mb-4">
              <div class="absolute inset-0 rounded-full border-2 border-blue-500/10"></div>
              <div class="absolute inset-0 rounded-full border-2 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
              <!-- Shimmer/glow dot -->
              <div class="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
            </div>

            <h3 class="text-white font-medium text-[14px] mb-1">Checking Status</h3>
            <p class="text-white/45 text-[12px]">Please wait a moment while we verify your transaction...</p>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

import type { PaymentTransaction } from '~/composables/useBilling'

const route = useRoute()
const router = useRouter()
const { error: toastError, success } = useToast()
const { user, fetchMe, refreshMe } = useAuth()
const { getPayment, toPlanDisplayName } = useBilling()

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
  if (status === 'paid') return 'border-emerald-500/30 bg-emerald-500/[0.06]'
  if (status === 'pending') return 'border-blue-500/30 bg-blue-500/[0.06]'
  return 'border-red-500/25 bg-red-500/[0.05]'
})

const statusTextClass = computed(() => {
  const status = payment.value?.status
  if (status === 'paid') return 'text-emerald-300'
  if (status === 'pending') return 'text-blue-300'
  return 'text-red-300'
})

const statusBadgeClass = computed(() => {
  const status = payment.value?.status
  if (status === 'paid') return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
  if (status === 'pending') return 'border-blue-500/30 bg-blue-500/10 text-blue-300'
  return 'border-red-500/30 bg-red-500/10 text-red-300'
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
  if (isStep1Completed.value) return 'border-emerald-500/35 bg-emerald-500/10 text-emerald-300'
  return 'border-blue-500/35 bg-blue-500/10 text-blue-300 ring-2 ring-blue-500/10'
})

const isStep2Failed = computed(() => {
  const status = payment.value?.status
  return status === 'failed' || status === 'cancelled' || status === 'expired'
})

const step2Class = computed(() => {
  if (!payment.value) return 'border-white/10 text-white/20'
  if (payment.value.status === 'paid') return 'border-emerald-500/35 bg-emerald-500/10 text-emerald-300'
  if (isStep2Failed.value) return 'border-red-500/35 bg-red-500/10 text-red-300'
  if (payment.value.status === 'pending' && payment.value.slip_storage_id) {
    return 'border-blue-500 bg-blue-500/15 text-blue-200 ring-4 ring-blue-500/15'
  }
  return 'border-white/10 text-white/20'
})

const step2Desc = computed(() => {
  if (!payment.value) return 'Pending review'
  if (payment.value.status === 'paid') return 'Slip approved'
  if (isStep2Failed.value) return 'Verification failed'
  if (payment.value.status === 'pending' && payment.value.slip_storage_id) return 'Verifying details'
  return 'Waiting for slip'
})

const step3Class = computed(() => {
  if (!payment.value) return 'border-white/10 text-white/20'
  if (payment.value.status === 'paid') return 'border-emerald-500/35 bg-emerald-500/10 text-emerald-300'
  if (isStep2Failed.value) return 'border-red-500/35 bg-red-500/10 text-red-300'
  return 'border-white/10 text-white/20'
})

const step3Desc = computed(() => {
  if (!payment.value) return 'Waiting for upgrade'
  if (payment.value.status === 'paid') return 'Plan active'
  if (isStep2Failed.value) return 'Failed'
  return 'Awaiting approval'
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
