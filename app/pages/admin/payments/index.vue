<template>
  <div class="p-8 w-full">

    <div class="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 class="text-[24px] font-bold tracking-tight text-white">Payment Transactions</h2>
        <p class="text-[12.5px] text-white/30 mt-1">Review slips and confirm manual bank-transfer payments</p>
      </div>
      <div v-if="!loading && !error" class="flex items-center gap-2 text-[12.5px]">
        <span class="tabular-nums font-semibold text-white/45 bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 py-1.5">
          {{ total.toLocaleString() }} total
        </span>
      </div>
    </div>

    <!-- stats row -->
    <div v-if="!loading && !error" class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
      <div class="rounded-2xl border border-yellow-500/20 bg-yellow-500/[0.06] px-4 py-3.5">
        <p class="text-[10.5px] uppercase tracking-widest text-yellow-300/70 mb-1">Pending w/ Slip</p>
        <p class="text-[24px] leading-none font-bold tabular-nums text-yellow-300">{{ pendingWithSlip.toLocaleString() }}</p>
      </div>
      <div class="rounded-2xl border border-blue-500/20 bg-blue-500/[0.06] px-4 py-3.5">
        <p class="text-[10.5px] uppercase tracking-widest text-blue-300/70 mb-1">Pending</p>
        <p class="text-[24px] leading-none font-bold tabular-nums text-blue-300">{{ pendingCount.toLocaleString() }}</p>
      </div>
      <div class="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-3.5">
        <p class="text-[10.5px] uppercase tracking-widest text-emerald-300/70 mb-1">Paid</p>
        <p class="text-[24px] leading-none font-bold tabular-nums text-emerald-300">{{ paidCount.toLocaleString() }}</p>
      </div>
      <div class="rounded-2xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3.5">
        <p class="text-[10.5px] uppercase tracking-widest text-red-300/70 mb-1">Failed/Cancelled</p>
        <p class="text-[24px] leading-none font-bold tabular-nums text-red-300">{{ failedCount.toLocaleString() }}</p>
      </div>
    </div>

    <!-- filters -->
    <div class="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-3.5 mb-4">
      <div class="flex items-center gap-2.5 flex-wrap">
        <select
          v-model="filterStatus"
          class="bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2.5 text-[13px] text-white/70 outline-none focus:border-violet-500/50 transition-colors cursor-pointer"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          v-model="filterSlip"
          class="bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2.5 text-[13px] text-white/70 outline-none focus:border-violet-500/50 transition-colors cursor-pointer"
        >
          <option value="all">All slips</option>
          <option value="with">With slip</option>
          <option value="without">Without slip</option>
        </select>
        <button @click="load" :disabled="loading" class="ml-auto px-4 py-2.5 rounded-xl text-[13px] font-medium border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] disabled:opacity-40 transition-colors">
          Refresh
        </button>
      </div>
    </div>

    <!-- loading / error -->
    <div v-if="loading" class="py-16 text-center text-white/30 text-[14px]">Loading…</div>
    <div v-else-if="error" class="rounded-2xl border border-red-500/15 bg-red-500/[0.03] p-5 text-red-300 text-[14px]">
      {{ error }}
    </div>

    <!-- table -->
    <div v-else-if="filtered.length === 0" class="py-16 text-center text-white/25 text-[14px]">
      No transactions found.
    </div>
    <div v-else class="rounded-2xl border border-white/[0.06] overflow-x-auto">
      <table class="w-full text-[12.5px]">
        <thead>
          <tr class="border-b border-white/[0.06] text-white/30 uppercase tracking-wider text-[10.5px]">
            <th class="px-4 py-3 text-left font-semibold">ID</th>
            <th class="px-4 py-3 text-left font-semibold">Plan</th>
            <th class="px-4 py-3 text-right font-semibold">Amount</th>
            <th class="px-4 py-3 text-left font-semibold">Status</th>
            <th class="px-4 py-3 text-left font-semibold">Slip</th>
            <th class="px-4 py-3 text-left font-semibold">Created</th>
            <th class="px-4 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/[0.04]">
          <tr
            v-for="tx in filtered"
            :key="tx.id"
            class="hover:bg-white/[0.025] transition-colors"
          >
            <td class="px-4 py-3 font-mono text-white/50 whitespace-nowrap" :title="tx.id">{{ toReadableId(tx.id, 'PMT') }}</td>
            <td class="px-4 py-3 font-semibold text-white/80">{{ tx.plan_key }}</td>
            <td class="px-4 py-3 text-right tabular-nums text-white/80">฿{{ tx.amount_thb.toLocaleString() }}</td>
            <td class="px-4 py-3">
              <span
                class="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold border"
                :class="statusBadgeClass(tx)"
              >
                {{ tx.status.toUpperCase() }}
              </span>
            </td>
            <td class="px-4 py-3">
              <template v-if="tx.slip_storage_id">
                <button
                  type="button"
                  @click="openSlip(tx.slip_storage_id)"
                  :disabled="openingSlipId === tx.slip_storage_id"
                  class="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors font-medium underline underline-offset-2"
                >
                  {{ openingSlipId === tx.slip_storage_id ? 'Opening...' : 'View slip' }}
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6m5-3h6v6m-11 5L21 3"/>
                  </svg>
                </button>
              </template>
              <span v-else class="text-white/20">—</span>
            </td>
            <td class="px-4 py-3 text-white/40 whitespace-nowrap">{{ formatDate(tx.created_at) }}</td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-2 justify-end">
                <button
                  v-if="tx.status === 'pending'"
                  @click="openConfirmModal(tx.id, 'paid')"
                  :disabled="confirming === tx.id"
                  class="px-3 py-1.5 rounded-lg text-[11.5px] font-semibold bg-emerald-600/80 hover:bg-emerald-500 text-white disabled:opacity-40 transition-colors"
                >
                  Confirm
                </button>
                <button
                  v-if="tx.status === 'pending'"
                  @click="openConfirmModal(tx.id, 'failed')"
                  :disabled="confirming === tx.id"
                  class="px-3 py-1.5 rounded-lg text-[11.5px] font-semibold bg-red-700/60 hover:bg-red-600 text-white disabled:opacity-40 transition-colors"
                >
                  Reject
                </button>
                <span v-if="tx.status !== 'pending'" class="text-white/20 text-[11.5px]">—</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- pagination -->
    <div v-if="total > limit" class="mt-4 flex items-center justify-between">
      <p class="text-[12px] text-white/30">Showing {{ offset + 1 }}–{{ Math.min(offset + limit, total) }} of {{ total }}</p>
      <div class="flex gap-2">
        <button
          :disabled="offset === 0"
          @click="goPage(-1)"
          class="px-3 py-1.5 rounded-lg text-[12px] border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] disabled:opacity-30 transition-colors"
        >
          Previous
        </button>
        <button
          :disabled="offset + limit >= total"
          @click="goPage(1)"
          class="px-3 py-1.5 rounded-lg text-[12px] border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] disabled:opacity-30 transition-colors"
        >
          Next
        </button>
      </div>
    </div>

    <Transition name="fade">
      <div
        v-if="confirmModal"
        class="fixed inset-0 z-40 bg-black/60 backdrop-blur-[1px] flex items-center justify-center px-4"
        @click.self="closeConfirmModal"
      >
        <div class="w-full max-w-md rounded-2xl border border-white/[0.1] bg-[#111216] p-5 shadow-2xl">
          <h3 class="text-[16px] font-semibold text-white">Confirm Action</h3>
          <p class="mt-2 text-[13px] text-white/60">
            Are you sure you want to
            <span class="font-semibold" :class="confirmModal.status === 'paid' ? 'text-emerald-300' : 'text-red-300'">
              {{ confirmModal.status === 'paid' ? 'approve' : 'reject' }}
            </span>
            transaction
            <span class="font-mono text-white/80" :title="confirmModal.id">{{ toReadableId(confirmModal.id, 'PMT') }}</span>
            ?
          </p>
          <p class="mt-1 text-[12px] text-white/35">Once confirmed, the status will be updated immediately.</p>

          <div v-if="confirmModal.status === 'failed'" class="mt-4">
            <label class="block text-[12px] text-white/55 mb-1.5">Rejection reason <span class="text-red-300">*</span></label>
            <textarea
              v-model="rejectReason"
              rows="3"
              placeholder="e.g. Amount does not match, invalid slip, unreadable transfer details"
              class="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2.5 text-[13px] text-white placeholder:text-white/25 outline-none focus:border-red-400/50 transition-colors resize-y"
            />
          </div>

          <div class="mt-5 flex items-center justify-end gap-2">
            <button
              @click="closeConfirmModal"
              :disabled="confirming === confirmModal.id"
              class="px-3 py-2 rounded-lg text-[12px] font-medium border border-white/[0.12] bg-white/[0.03] hover:bg-white/[0.07] disabled:opacity-40 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="submitConfirmAction"
              :disabled="confirming === confirmModal.id || (confirmModal.status === 'failed' && !rejectReason.trim())"
              class="px-3 py-2 rounded-lg text-[12px] font-semibold text-white disabled:opacity-40 transition-colors"
              :class="confirmModal.status === 'paid' ? 'bg-emerald-600/80 hover:bg-emerald-500' : 'bg-red-700/70 hover:bg-red-600'"
            >
              {{ confirming === confirmModal.id ? 'Saving...' : (confirmModal.status === 'paid' ? 'Confirm Approval' : 'Confirm Rejection') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- confirm modal feedback -->
    <Transition name="toast">
      <div
        v-if="toast"
        class="fixed bottom-6 right-6 z-50 rounded-2xl border px-5 py-3.5 text-[13px] font-medium shadow-xl"
        :class="toast.type === 'success'
          ? 'border-emerald-500/30 bg-emerald-900/80 text-emerald-200'
          : 'border-red-500/30 bg-red-900/80 text-red-200'"
      >
        {{ toast.message }}
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import type { PaymentTransaction } from '~/composables/useBilling'

const config = useRuntimeConfig()
const { adminListPayments, adminConfirmPayment } = useAdmin()

const loading = ref(false)
const error = ref('')
const rows = ref<PaymentTransaction[]>([])
const total = ref(0)
const limit = 50
const offset = ref(0)
const confirming = ref<string | null>(null)
const openingSlipId = ref<string | null>(null)
const confirmModal = ref<{ id: string; status: 'paid' | 'failed' } | null>(null)
const rejectReason = ref('')
const toast = ref<{ type: 'success' | 'error'; message: string } | null>(null)

const filterStatus = ref('')
const filterSlip = ref<'all' | 'with' | 'without'>('all')

const filtered = computed(() => {
  let list = rows.value
  if (filterStatus.value) list = list.filter(r => r.status === filterStatus.value)
  if (filterSlip.value === 'with') list = list.filter(r => !!r.slip_storage_id)
  if (filterSlip.value === 'without') list = list.filter(r => !r.slip_storage_id)
  return list
})

const pendingWithSlip = computed(() => rows.value.filter(r => r.status === 'pending' && r.slip_storage_id).length)
const pendingCount = computed(() => rows.value.filter(r => r.status === 'pending').length)
const paidCount = computed(() => rows.value.filter(r => r.status === 'paid').length)
const failedCount = computed(() => rows.value.filter(r => r.status === 'failed' || r.status === 'cancelled').length)

async function load() {
  loading.value = true
  error.value = ''
  try {
    const res = await adminListPayments(limit, offset.value)
    rows.value = res.data
    total.value = res.total
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Failed to load payments'
  } finally {
    loading.value = false
  }
}

function goPage(dir: 1 | -1) {
  offset.value = Math.max(0, offset.value + dir * limit)
  load()
}

function statusBadgeClass(tx: PaymentTransaction) {
  switch (tx.status) {
    case 'paid': return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
    case 'pending': return 'border-blue-500/30 bg-blue-500/10 text-blue-300'
    case 'failed': return 'border-red-500/30 bg-red-500/10 text-red-300'
    case 'cancelled': return 'border-orange-500/30 bg-orange-500/10 text-orange-300'
    default: return 'border-white/10 bg-white/5 text-white/40'
  }
}

function formatDate(iso: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' })
}

function toReadableId(raw: string | null | undefined, prefix: string) {
  if (!raw) return '-'
  const cleaned = raw.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
  if (!cleaned) return '-'
  if (cleaned.length <= 8) return `${prefix}-${cleaned}`
  if (cleaned.length <= 12) return `${prefix}-${cleaned.slice(0, 4)}-${cleaned.slice(4)}`
  return `${prefix}-${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(-4)}`
}

async function openSlip(storageId: string) {
  openingSlipId.value = storageId
  try {
    const res = await $fetch<{ data?: { presigned_url?: string; url?: string; presign_url?: string } }>(
      `${config.public.storagesServiceUrl}/storages/${storageId}/presign`,
    )
    const presignedUrl = res?.data?.presigned_url ?? res?.data?.presign_url ?? res?.data?.url
    if (!presignedUrl) {
      throw new Error('Presigned URL not found')
    }
    window.open(presignedUrl, '_blank', 'noopener,noreferrer')
  } catch (e: unknown) {
    showToast('error', e instanceof Error ? e.message : 'Unable to open slip')
  } finally {
    openingSlipId.value = null
  }
}

function openConfirmModal(id: string, status: 'paid' | 'failed') {
  confirmModal.value = { id, status }
  rejectReason.value = ''
}

function closeConfirmModal() {
  confirmModal.value = null
  rejectReason.value = ''
}

async function submitConfirmAction() {
  if (!confirmModal.value) return
  const { id, status } = confirmModal.value
  const reviewReason = status === 'failed' ? rejectReason.value.trim() : undefined
  if (status === 'failed' && !reviewReason) {
    showToast('error', 'Please provide a rejection reason')
    return
  }
  confirming.value = id
  try {
    await adminConfirmPayment(id, status, reviewReason)
    await load()
    showToast('success', status === 'paid' ? 'Payment confirmed ✓' : 'Payment rejected')
    closeConfirmModal()
  } catch (e: unknown) {
    showToast('error', e instanceof Error ? e.message : 'Action failed')
  } finally {
    confirming.value = null
  }
}

function showToast(type: 'success' | 'error', message: string) {
  toast.value = { type, message }
  setTimeout(() => { toast.value = null }, 3500)
}

onMounted(load)
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.toast-enter-active, .toast-leave-active { transition: opacity 0.25s, transform 0.25s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(8px); }
</style>
