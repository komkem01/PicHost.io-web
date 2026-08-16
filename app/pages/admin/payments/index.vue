<template>
  <div class="p-8 w-full">

    <div class="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 class="text-[24px] font-bold tracking-tight text-zinc-900">Payment Transactions</h2>
        <p class="text-[12.5px] text-zinc-500 mt-1">Review slips and confirm manual bank-transfer payments</p>
      </div>
      <div v-if="!loading && !error" class="flex items-center gap-2 text-[12.5px]">
        <span class="tabular-nums font-semibold text-zinc-700 bg-zinc-100 border border-zinc-200 rounded-xl px-3 py-1.5">
          {{ total.toLocaleString() }} total
        </span>
      </div>
    </div>

    <!-- stats row -->
    <div v-if="!loading && !error" class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
      <div class="rounded-2xl border border-amber-200 bg-amber-50/60 px-4 py-3.5">
        <p class="text-[10.5px] uppercase tracking-widest text-amber-800/70 font-semibold mb-1">Pending w/ Slip</p>
        <p class="text-[24px] leading-none font-bold tabular-nums text-amber-700">{{ pendingWithSlip.toLocaleString() }}</p>
      </div>
      <div class="rounded-2xl border border-blue-200 bg-blue-50/60 px-4 py-3.5">
        <p class="text-[10.5px] uppercase tracking-widest text-blue-800/70 font-semibold mb-1">Pending</p>
        <p class="text-[24px] leading-none font-bold tabular-nums text-blue-700">{{ pendingCount.toLocaleString() }}</p>
      </div>
      <div class="rounded-2xl border border-emerald-200 bg-emerald-50/60 px-4 py-3.5">
        <p class="text-[10.5px] uppercase tracking-widest text-emerald-800/70 font-semibold mb-1">Paid</p>
        <p class="text-[24px] leading-none font-bold tabular-nums text-emerald-700">{{ paidCount.toLocaleString() }}</p>
      </div>
      <div class="rounded-2xl border border-red-200 bg-red-50/60 px-4 py-3.5">
        <p class="text-[10.5px] uppercase tracking-widest text-red-800/70 font-semibold mb-1">Failed/Cancelled</p>
        <p class="text-[24px] leading-none font-bold tabular-nums text-red-700">{{ failedCount.toLocaleString() }}</p>
      </div>
    </div>

    <!-- filters -->
    <div class="rounded-2xl border border-zinc-200 bg-white shadow-card p-3.5 mb-4">
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div class="flex flex-col sm:flex-row items-center gap-2.5 flex-1 max-w-xl">
          <div class="w-full sm:w-52">
            <AppSelect
              v-model="filterStatus"
              :options="statusOptions"
            />
          </div>
          <div class="w-full sm:w-52">
            <AppSelect
              v-model="filterSlip"
              :options="slipOptions"
            />
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="handleExport"
            class="h-10 px-4 inline-flex items-center justify-center gap-1.5 rounded-xl text-[13px] font-medium border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 transition-colors shadow-xs cursor-pointer"
          >
            <svg class="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            <span>{{ $t('common.exportCsv') }}</span>
          </button>
          <button
            @click="load"
            :disabled="loading"
            class="h-10 px-4 inline-flex items-center justify-center gap-2 rounded-xl text-[13px] font-medium border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 disabled:opacity-40 transition-colors shadow-xs cursor-pointer"
          >
            <svg class="w-3.5 h-3.5 text-zinc-500" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            <span>{{ $t('common.refresh') }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- loading / error -->
    <div v-if="loading" class="py-16 text-center text-zinc-400 text-[14px]">Loading…</div>
    <div v-else-if="error" class="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 text-[14px]">
      {{ error }}
    </div>

    <!-- table -->
    <div v-else-if="filtered.length === 0" class="py-16 text-center text-zinc-400 text-[14px]">
      No transactions found.
    </div>
    <div v-else class="rounded-2xl border border-zinc-200 bg-white shadow-card overflow-x-auto">
      <table class="w-full text-[12.5px]">
        <thead class="bg-zinc-50">
          <tr class="border-b border-zinc-200 text-zinc-500 uppercase tracking-wider text-[10.5px]">
            <th class="px-4 py-3.5 text-left font-semibold">ID</th>
            <th class="px-4 py-3.5 text-left font-semibold">Plan</th>
            <th class="px-4 py-3.5 text-right font-semibold">Amount</th>
            <th class="px-4 py-3.5 text-left font-semibold">Status</th>
            <th class="px-4 py-3.5 text-left font-semibold">Slip</th>
            <th class="px-4 py-3.5 text-left font-semibold">Created</th>
            <th class="px-4 py-3.5 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-200">
          <tr
            v-for="tx in filtered"
            :key="tx.id"
            class="hover:bg-zinc-50/80 transition-colors"
          >
            <td class="px-4 py-3.5 font-mono text-zinc-500 whitespace-nowrap" :title="tx.id">{{ toReadableId(tx.id, 'PMT') }}</td>
            <td class="px-4 py-3.5 font-semibold text-zinc-900">{{ tx.plan_key }}</td>
            <td class="px-4 py-3.5 text-right tabular-nums font-semibold text-zinc-900">฿{{ tx.amount_thb.toLocaleString() }}</td>
            <td class="px-4 py-3.5">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold border"
                :class="statusBadgeClass(tx)"
              >
                {{ tx.status.toUpperCase() }}
              </span>
            </td>
            <td class="px-4 py-3.5">
              <template v-if="tx.slip_storage_id">
                <button
                  type="button"
                  @click="openSlip(tx.slip_storage_id)"
                  :disabled="openingSlipId === tx.slip_storage_id"
                  class="h-8 px-2.5 inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 transition-colors font-medium text-[12px] shadow-2xs"
                  title="ดูรายละเอียดสลิป"
                >
                  <svg class="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.573 16.49 16.638 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  <span>{{ openingSlipId === tx.slip_storage_id ? 'Opening...' : $t('admin.payments.slipImage') }}</span>
                </button>
              </template>
              <span v-else class="text-zinc-400">—</span>
            </td>
            <td class="px-4 py-3.5 text-zinc-500 whitespace-nowrap">{{ formatDate(tx.created_at) }}</td>
            <td class="px-4 py-3.5">
              <div class="flex items-center gap-1.5 justify-end">
                <NuxtLink
                  :to="`/admin/payments/${tx.id}`"
                  class="h-8 px-2.5 inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-[12px] font-medium transition-colors shadow-2xs"
                  title="ดูรายละเอียดการชำระเงิน"
                >
                  <svg class="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  <span>{{ $t('common.viewDetails') }}</span>
                </NuxtLink>
                <button
                  v-if="tx.status === 'pending'"
                  @click="openConfirmModal(tx.id, 'paid')"
                  :disabled="confirming === tx.id"
                  class="h-8 px-2.5 inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100/70 text-emerald-700 text-[12px] font-medium disabled:opacity-40 transition-colors shadow-2xs cursor-pointer"
                  title="อนุมัติการชำระเงิน"
                >
                  <svg class="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span>{{ $t('admin.payments.approveBtn') }}</span>
                </button>
                <button
                  v-if="tx.status === 'pending'"
                  @click="openConfirmModal(tx.id, 'failed')"
                  :disabled="confirming === tx.id"
                  class="h-8 px-2.5 inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100/70 text-red-700 text-[12px] font-medium disabled:opacity-40 transition-colors shadow-2xs cursor-pointer"
                  title="ปฏิเสธการชำระเงิน"
                >
                  <svg class="w-3.5 h-3.5 text-red-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                  <span>{{ $t('admin.payments.rejectBtn') }}</span>
                </button>
                <button
                  v-if="tx.status === 'paid'"
                  @click="openRefundModal(tx.id)"
                  :disabled="confirming === tx.id"
                  class="px-3 py-1.5 rounded-xl text-[11.5px] font-semibold bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 disabled:opacity-40 transition-colors cursor-pointer"
                >
                  Refund
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- pagination -->
    <AppPagination
      v-model:page="currentPage"
      :total="total"
      :limit="limit"
      @change="load"
    />

    <Transition name="fade">
      <div
        v-if="confirmModal"
        class="fixed inset-0 z-40 bg-zinc-900/40 backdrop-blur-xs flex items-center justify-center px-4"
        @click.self="closeConfirmModal"
      >
        <div class="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-modal">
          <h3 class="text-[16px] font-semibold text-zinc-900">Confirm Action</h3>
          <p class="mt-2 text-[13px] text-zinc-600">
            Are you sure you want to
            <span class="font-semibold" :class="confirmModal.status === 'paid' ? 'text-emerald-700' : 'text-red-700'">
              {{ confirmModal.status === 'paid' ? 'approve' : 'reject' }}
            </span>
            transaction
            <span class="font-mono text-zinc-900 font-semibold" :title="confirmModal.id">{{ toReadableId(confirmModal.id, 'PMT') }}</span>
            ?
          </p>
          <p class="mt-1 text-[12px] text-zinc-400">Once confirmed, the status will be updated immediately.</p>

          <div v-if="confirmModal.status === 'failed'" class="mt-4">
            <label class="block text-[12px] text-zinc-700 font-medium mb-1.5">Rejection reason <span class="text-red-600">*</span></label>
            <textarea
              v-model="rejectReason"
              rows="3"
              placeholder="e.g. Amount does not match, invalid slip, unreadable transfer details"
              class="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-[13px] text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-400 transition-colors resize-y"
            />
          </div>

          <div class="mt-5 flex items-center justify-end gap-2">
            <button
              @click="closeConfirmModal"
              :disabled="confirming === confirmModal.id"
              class="px-3.5 py-2 rounded-xl text-[12.5px] font-medium border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="submitConfirmAction"
              :disabled="confirming === confirmModal.id || (confirmModal.status === 'failed' && !rejectReason.trim())"
              class="px-3.5 py-2 rounded-xl text-[12.5px] font-semibold text-white disabled:opacity-40 transition-colors"
              :class="confirmModal.status === 'paid' ? 'bg-zinc-900 hover:bg-zinc-800' : 'bg-red-600 hover:bg-red-500'"
            >
              {{ confirming === confirmModal.id ? 'Saving...' : (confirmModal.status === 'paid' ? 'Confirm Approval' : 'Confirm Rejection') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- refund modal -->
    <Transition name="fade">
      <div
        v-if="refundModalId"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs"
      >
        <div class="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-modal">
          <h3 class="text-[16px] font-semibold text-zinc-900">Refund Transaction</h3>
          <p class="mt-2 text-[13px] text-zinc-600">
            Are you sure you want to refund transaction
            <span class="font-mono text-purple-700 font-semibold" :title="refundModalId">{{ toReadableId(refundModalId, 'PMT') }}</span>
            ?
          </p>
          <p class="mt-1 text-[12px] text-zinc-400">The transaction status will be marked as refunded.</p>

          <div class="mt-4">
            <label class="block text-[12px] text-zinc-700 font-medium mb-1.5">Refund note / reason</label>
            <textarea
              v-model="refundReason"
              rows="3"
              placeholder="e.g. User requested refund via support ticket #104"
              class="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-[13px] text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-400 transition-colors resize-y"
            />
          </div>

          <div class="mt-5 flex items-center justify-end gap-2">
            <button
              @click="closeRefundModal"
              :disabled="confirming === refundModalId"
              class="px-3.5 py-2 rounded-xl text-[12.5px] font-medium border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="submitRefundAction"
              :disabled="confirming === refundModalId"
              class="px-3.5 py-2 rounded-xl text-[12.5px] font-semibold bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-40 transition-colors"
            >
              {{ confirming === refundModalId ? 'Refunding...' : 'Confirm Refund' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

import type { PaymentTransaction } from '~/composables/useBilling'
import { exportToCsv } from '~/utils/export'

const config = useRuntimeConfig()
const { adminListPayments, adminConfirmPayment, adminRefundPayment } = useAdmin()
const { success: toastSuccess, error: toastError } = useToast()

const loading = ref(false)
const error = ref('')
const rows = ref<PaymentTransaction[]>([])
const total = ref(0)
const limit = 50
const offset = ref(0)
const confirming = ref<string | null>(null)
const openingSlipId = ref<string | null>(null)
const confirmModal = ref<{ id: string; status: 'paid' | 'failed' } | null>(null)
const refundModalId = ref<string | null>(null)
const refundReason = ref('')
const rejectReason = ref('')

const currentPage = computed({
  get: () => Math.floor(offset.value / limit) + 1,
  set: (p: number) => {
    offset.value = (p - 1) * limit
  },
})

const filterStatus = ref('')
const filterSlip = ref<string>('all')

const statusOptions = [
  { label: 'All statuses', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Paid', value: 'paid' },
  { label: 'Failed', value: 'failed' },
  { label: 'Cancelled', value: 'cancelled' },
]

const slipOptions = [
  { label: 'All slips', value: 'all' },
  { label: 'With slip', value: 'with' },
  { label: 'Without slip', value: 'without' },
]

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

function handleExport() {
  const headers = [
    { label: 'รหัสรายการ (Payment ID)', key: 'formatted_id' },
    { label: 'ผู้ใช้งาน (User ID)', key: 'formatted_user' },
    { label: 'แพ็กเกจ (Plan)', key: 'formatted_plan' },
    { label: 'จำนวนเงิน (Amount)', key: 'formatted_amount' },
    { label: 'สกุลเงิน (Currency)', key: 'currency' },
    { label: 'สถานะ (Status)', key: 'formatted_status' },
    { label: 'ช่องทางชำระเงิน (Provider)', key: 'provider' },
    { label: 'อ้างอิงชำระเงิน (Checkout Ref)', key: 'checkout_reference' },
    { label: 'เหตุผลการตรวจสอบ (Review Reason)', key: 'review_reason' },
    { label: 'วันที่ชำระเงิน (Paid At)', key: 'formatted_paid_at' },
    { label: 'วันที่สร้างรายการ (Created At)', key: 'formatted_created_at' }
  ]

  const exportRows = filtered.value.map(item => {
    let statusText = 'รอตรวจสอบ (Pending)'
    if (item.status === 'paid') statusText = 'ชำระเงินสำเร็จ (Paid)'
    else if (item.status === 'refunded') statusText = 'คืนเงินเรียบร้อย (Refunded)'
    else if (item.status === 'failed') statusText = 'ปฏิเสธ / ล้มเหลว (Failed)'
    else if (item.status === 'cancelled') statusText = 'ยกเลิกรายการ (Cancelled)'

    return {
      ...item,
      formatted_id: `${toReadableId(item.id, 'PMT')} (${item.id})`,
      formatted_user: item.user_id ? `User (${item.user_id})` : 'Guest User',
      formatted_plan: String(item.plan_key || '').toUpperCase(),
      formatted_amount: `฿${(item.amount_thb || 0).toLocaleString()}`,
      formatted_status: statusText,
      review_reason: item.review_reason || '-',
      formatted_paid_at: formatDate(item.paid_at),
      formatted_created_at: formatDate(item.created_at)
    }
  })

  exportToCsv('pichost_payments', headers, exportRows)
}

function goPage(dir: 1 | -1) {
  offset.value = Math.max(0, offset.value + dir * limit)
  load()
}

function statusBadgeClass(tx: PaymentTransaction) {
  switch (tx.status) {
    case 'paid': return 'border-emerald-200 bg-emerald-50 text-emerald-700'
    case 'pending': return 'border-amber-200 bg-amber-50 text-amber-700'
    case 'refunded': return 'border-purple-200 bg-purple-50 text-purple-700'
    case 'failed': return 'border-red-200 bg-red-50 text-red-700'
    case 'cancelled': return 'border-zinc-200 bg-zinc-100 text-zinc-600'
    default: return 'border-zinc-200 bg-zinc-100 text-zinc-600'
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

function openRefundModal(id: string) {
  refundModalId.value = id
  refundReason.value = ''
}

function closeRefundModal() {
  refundModalId.value = null
  refundReason.value = ''
}

async function submitRefundAction() {
  if (!refundModalId.value) return
  const id = refundModalId.value
  confirming.value = id
  try {
    await adminRefundPayment(id, refundReason.value.trim() || undefined)
    await load()
    showToast('success', 'Payment refunded ✓')
    closeRefundModal()
  } catch (e: unknown) {
    showToast('error', e instanceof Error ? e.message : 'Refund failed')
  } finally {
    confirming.value = null
  }
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
  if (type === 'success') {
    toastSuccess(message)
  } else {
    toastError(message)
  }
}

onMounted(load)
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
