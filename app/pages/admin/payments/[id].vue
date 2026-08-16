<template>
  <div class="p-6 md:p-8 space-y-6 max-w-6xl mx-auto">
    <!-- Top breadcrumb & back button -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <NuxtLink
          to="/admin/payments"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-700 transition shadow-xs"
        >
          <svg class="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          <span>{{ $t('common.back') }}</span>
        </NuxtLink>
        <span class="text-zinc-300">/</span>
        <h1 class="text-sm font-semibold text-zinc-900 font-mono truncate max-w-[200px] sm:max-w-md">
          {{ id }}
        </h1>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="fetchPayment"
          class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-700 transition shadow-xs cursor-pointer"
        >
          <svg class="w-3.5 h-3.5 text-zinc-500" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          <span>{{ $t('common.refresh') }}</span>
        </button>
      </div>
    </div>

    <div v-if="loading && !payment" class="py-24 text-center text-zinc-400 text-xs flex flex-col items-center gap-2">
      <svg class="w-6 h-6 animate-spin text-zinc-400" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
      <span>{{ $t('common.loading') }}</span>
    </div>

    <div v-else-if="!payment" class="py-24 text-center text-zinc-500 text-xs">
      Payment not found
    </div>

    <div v-else class="space-y-6">
      <!-- Status Banner & Quick Action Header -->
      <div class="p-6 rounded-2xl bg-white border border-zinc-200 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <span
            class="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5"
            :class="statusBadgeClass(payment.status)"
          >
            <span class="w-1.5 h-1.5 rounded-full" :class="statusDotClass(payment.status)"></span>
            {{ payment.status }}
          </span>
          <div>
            <div class="text-2xl font-bold text-zinc-900 tracking-tight">
              ฿{{ (payment.amount_thb ?? 0).toLocaleString() }} <span class="text-xs font-normal text-zinc-500 uppercase">{{ payment.currency || 'THB' }}</span>
            </div>
            <p class="text-xs text-zinc-500 mt-0.5 font-mono">Plan: <span class="font-semibold text-zinc-800 uppercase">{{ payment.plan_key }}</span></p>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="flex flex-wrap items-center gap-2">
          <template v-if="payment.status === 'pending'">
            <button
              @click="openConfirmModal('paid')"
              class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              <span>{{ $t('admin.payments.approveBtn') }}</span>
            </button>
            <button
              @click="openConfirmModal('failed')"
              class="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-medium transition shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
              <span>{{ $t('admin.payments.rejectBtn') }}</span>
            </button>
          </template>

          <template v-else-if="payment.status === 'paid'">
            <button
              @click="showRefundModal = true"
              class="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-medium transition shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
              </svg>
              <span>{{ $t('admin.payments.refundBtn') }}</span>
            </button>
          </template>
        </div>
      </div>

      <!-- Main 2-column Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left 2 Cols: Transaction & User Details -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Transaction Info Card -->
          <div class="p-6 rounded-2xl bg-white border border-zinc-200 shadow-card space-y-4">
            <h2 class="text-sm font-semibold text-zinc-900 flex items-center gap-2 border-b border-zinc-100 pb-3">
              <svg class="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
              </svg>
              <span>Transaction Overview</span>
            </h2>

            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-xs">
              <div>
                <dt class="text-zinc-400 font-medium">Transaction ID</dt>
                <dd class="mt-0.5 font-mono text-zinc-900 font-semibold select-all break-all">{{ payment.id }}</dd>
              </div>
              <div>
                <dt class="text-zinc-400 font-medium">Checkout Reference</dt>
                <dd class="mt-0.5 font-mono text-zinc-800 select-all break-all">{{ payment.checkout_reference || '-' }}</dd>
              </div>
              <div>
                <dt class="text-zinc-400 font-medium">Provider</dt>
                <dd class="mt-0.5 font-medium text-zinc-900 capitalize">{{ payment.provider }}</dd>
              </div>
              <div>
                <dt class="text-zinc-400 font-medium">Provider Reference</dt>
                <dd class="mt-0.5 font-mono text-zinc-800">{{ payment.provider_reference || '-' }}</dd>
              </div>
              <div>
                <dt class="text-zinc-400 font-medium">Created At</dt>
                <dd class="mt-0.5 font-mono text-zinc-700">{{ formatDate(payment.created_at) }}</dd>
              </div>
              <div>
                <dt class="text-zinc-400 font-medium">Expires At</dt>
                <dd class="mt-0.5 font-mono text-zinc-700">{{ formatDate(payment.expires_at) }}</dd>
              </div>
              <div v-if="payment.paid_at">
                <dt class="text-zinc-400 font-medium">Paid At</dt>
                <dd class="mt-0.5 font-mono text-emerald-700 font-semibold">{{ formatDate(payment.paid_at) }}</dd>
              </div>
              <div v-if="payment.reviewed_at">
                <dt class="text-zinc-400 font-medium">Reviewed At</dt>
                <dd class="mt-0.5 font-mono text-zinc-700">{{ formatDate(payment.reviewed_at) }}</dd>
              </div>
            </dl>

            <div v-if="payment.review_reason" class="pt-3 border-t border-zinc-100 text-xs">
              <span class="text-zinc-400 font-medium">Review Note / Reason:</span>
              <p class="mt-1 p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-800 font-medium">
                {{ payment.review_reason }}
              </p>
            </div>
          </div>

          <!-- User Information Card -->
          <div class="p-6 rounded-2xl bg-white border border-zinc-200 shadow-card space-y-4">
            <div class="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h2 class="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                <svg class="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                <span>Customer / User Details</span>
              </h2>
              <NuxtLink
                :to="`/admin/users/${payment.user_id}`"
                class="text-xs font-semibold text-blue-600 hover:text-blue-700 underline flex items-center gap-1"
              >
                <span>View Full User Profile</span>
                <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </NuxtLink>
            </div>

            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-xs">
              <div>
                <dt class="text-zinc-400 font-medium">User ID</dt>
                <dd class="mt-0.5 font-mono text-zinc-900 font-medium select-all">{{ payment.user_id }}</dd>
              </div>
              <div v-if="payment.user?.email">
                <dt class="text-zinc-400 font-medium">Email</dt>
                <dd class="mt-0.5 font-medium text-zinc-900">{{ payment.user.email }}</dd>
              </div>
              <div v-if="payment.user?.username">
                <dt class="text-zinc-400 font-medium">Username</dt>
                <dd class="mt-0.5 font-medium text-zinc-900">{{ payment.user.username }}</dd>
              </div>
              <div>
                <dt class="text-zinc-400 font-medium">Current User Plan</dt>
                <dd class="mt-0.5">
                  <span class="inline-flex items-center px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-800 font-mono font-semibold uppercase text-[11px]">
                    {{ payment.user?.plan || 'Free' }}
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          <!-- Metadata JSON -->
          <div class="p-6 rounded-2xl bg-white border border-zinc-200 shadow-card space-y-3">
            <h2 class="text-xs font-semibold text-zinc-700 uppercase tracking-wider">Raw Payload & Metadata</h2>
            <pre class="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 font-mono text-[11px] text-zinc-800 overflow-x-auto max-h-56">{{ JSON.stringify(payment.metadata || {}, null, 2) }}</pre>
          </div>
        </div>

        <!-- Right 1 Col: Transfer Slip Proof -->
        <div class="space-y-6">
          <div class="p-6 rounded-2xl bg-white border border-zinc-200 shadow-card space-y-4">
            <h2 class="text-sm font-semibold text-zinc-900 flex items-center gap-2 border-b border-zinc-100 pb-3">
              <svg class="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              <span>{{ $t('admin.payments.slipImage') }}</span>
            </h2>

            <div v-if="payment.slip_storage_id" class="space-y-3">
              <div class="relative group rounded-xl overflow-hidden border border-zinc-200 bg-zinc-50 aspect-3/4 flex items-center justify-center">
                <img
                  :src="getSlipUrl(payment.slip_storage_id)"
                  alt="Payment Slip"
                  class="w-full h-full object-contain cursor-pointer transition hover:scale-102"
                  @click="showSlipZoom = true"
                />
                <div class="absolute inset-0 bg-zinc-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center pointer-events-none">
                  <span class="px-3 py-1.5 rounded-xl bg-white text-zinc-900 text-xs font-semibold shadow-md">Click to Zoom</span>
                </div>
              </div>
              <div class="text-[11px] text-zinc-500 font-mono break-all text-center">
                Storage ID: {{ payment.slip_storage_id }}
              </div>
            </div>
            <div v-else class="py-16 text-center text-zinc-400 text-xs flex flex-col items-center gap-2">
              <svg class="w-8 h-8 text-zinc-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
              <span>No slip uploaded for this transaction</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirm / Reject Action Modal -->
    <Teleport to="body">
      <div v-if="actionModalStatus" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs">
        <div class="w-full max-w-md rounded-2xl bg-white border border-zinc-200 p-6 shadow-modal space-y-4">
          <div class="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h3 class="text-sm font-semibold text-zinc-900">
              {{ actionModalStatus === 'paid' ? 'Approve Payment Transaction' : 'Reject Payment Transaction' }}
            </h3>
            <button @click="actionModalStatus = null" class="text-zinc-400 hover:text-zinc-700 text-lg leading-none">&times;</button>
          </div>

          <div class="space-y-3 text-xs">
            <p class="text-zinc-600">
              {{ actionModalStatus === 'paid'
                ? 'Approving will immediately upgrade the user account to the selected plan and update plan expiration.'
                : 'Rejecting will mark the transaction as failed and inform the user.' }}
            </p>

            <div>
              <label class="block text-zinc-700 font-medium mb-1">Review Reason / Note (Optional)</label>
              <textarea
                v-model="actionReason"
                rows="3"
                placeholder="Add audit note or explanation for the user..."
                class="w-full p-3 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 shadow-xs"
              ></textarea>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button
              @click="actionModalStatus = null"
              class="px-4 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-700 cursor-pointer"
            >
              {{ $t('common.cancel') }}
            </button>
            <button
              @click="submitConfirmAction"
              :disabled="submitting"
              class="px-4 py-2 rounded-xl text-xs font-semibold text-white transition shadow-xs cursor-pointer flex items-center gap-1.5"
              :class="actionModalStatus === 'paid' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'"
            >
              <svg v-if="submitting" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>{{ actionModalStatus === 'paid' ? 'Confirm Approval' : 'Confirm Rejection' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Refund Action Modal -->
    <Teleport to="body">
      <div v-if="showRefundModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs">
        <div class="w-full max-w-md rounded-2xl bg-white border border-zinc-200 p-6 shadow-modal space-y-4">
          <div class="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h3 class="text-sm font-semibold text-zinc-900">Refund Payment</h3>
            <button @click="showRefundModal = false" class="text-zinc-400 hover:text-zinc-700 text-lg leading-none">&times;</button>
          </div>

          <div class="space-y-3 text-xs">
            <p class="text-zinc-600">
              Mark this payment as refunded. Please provide a reason for the audit trail.
            </p>

            <div>
              <label class="block text-zinc-700 font-medium mb-1">Refund Reason</label>
              <textarea
                v-model="refundReason"
                rows="3"
                placeholder="e.g. Customer requested cancellation / duplicate charge..."
                class="w-full p-3 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 shadow-xs"
              ></textarea>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button
              @click="showRefundModal = false"
              class="px-4 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-700 cursor-pointer"
            >
              {{ $t('common.cancel') }}
            </button>
            <button
              @click="submitRefundAction"
              :disabled="submitting"
              class="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-xs font-semibold text-white transition shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <svg v-if="submitting" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>Confirm Refund</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Slip Zoom Modal -->
    <Teleport to="body">
      <div v-if="showSlipZoom" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/80 backdrop-blur-xs" @click.self="showSlipZoom = false">
        <div class="relative max-w-3xl max-h-[90vh] bg-white p-4 rounded-2xl shadow-2xl flex flex-col items-center">
          <img :src="getSlipUrl(payment?.slip_storage_id)" class="max-w-full max-h-[75vh] object-contain rounded-xl" />
          <div class="w-full mt-3 flex justify-end">
            <button @click="showSlipZoom = false" class="px-4 py-1.5 rounded-xl bg-zinc-900 text-white text-xs font-medium cursor-pointer">
              {{ $t('common.close') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const route = useRoute()
const id = route.params.id as string

const payment = ref<any>(null)
const loading = ref(false)
const submitting = ref(false)

const actionModalStatus = ref<'paid' | 'failed' | null>(null)
const actionReason = ref('')
const showRefundModal = ref(false)
const refundReason = ref('')
const showSlipZoom = ref(false)

function statusBadgeClass(status: string) {
  switch (status) {
    case 'paid': return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    case 'pending': return 'bg-amber-50 text-amber-700 border border-amber-200'
    case 'refunded': return 'bg-purple-50 text-purple-700 border border-purple-200'
    case 'failed':
    case 'cancelled': return 'bg-red-50 text-red-700 border border-red-200'
    default: return 'bg-zinc-100 text-zinc-700 border border-zinc-200'
  }
}

function statusDotClass(status: string) {
  switch (status) {
    case 'paid': return 'bg-emerald-500'
    case 'pending': return 'bg-amber-500 animate-pulse'
    case 'refunded': return 'bg-purple-500'
    case 'failed':
    case 'cancelled': return 'bg-red-500'
    default: return 'bg-zinc-400'
  }
}

function getSlipUrl(storageId?: string) {
  if (!storageId) return ''
  return `/api/v1/storage/files/${storageId}`
}

function formatDate(iso?: string) {
  if (!iso) return '-'
  return new Date(iso).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

async function fetchPayment() {
  loading.value = true
  try {
    const res = await apiFetch<any>(`/admin/payments/${id}`)
    if (res.data) {
      payment.value = res.data
    }
  } catch (e) {
    console.error('Failed to load payment detail:', e)
  } finally {
    loading.value = false
  }
}

function openConfirmModal(status: 'paid' | 'failed') {
  actionModalStatus.value = status
  actionReason.value = ''
}

async function submitConfirmAction() {
  if (!actionModalStatus.value) return
  submitting.value = true
  try {
    await apiFetch(`/admin/payments/${id}/confirm`, {
      method: 'PATCH',
      body: {
        status: actionModalStatus.value,
        review_reason: actionReason.value || undefined,
        paid_amount_thb: actionModalStatus.value === 'paid' ? payment.value.amount_thb : undefined
      }
    })
    actionModalStatus.value = null
    await fetchPayment()
  } catch (e) {
    console.error('Failed to confirm payment:', e)
    alert('Failed to update payment status')
  } finally {
    submitting.value = false
  }
}

async function submitRefundAction() {
  submitting.value = true
  try {
    await apiFetch(`/admin/payments/${id}/refund`, {
      method: 'PATCH',
      body: {
        reason: refundReason.value || undefined
      }
    })
    showRefundModal.value = false
    await fetchPayment()
  } catch (e) {
    console.error('Failed to refund payment:', e)
    alert('Failed to refund payment')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchPayment()
})
</script>
