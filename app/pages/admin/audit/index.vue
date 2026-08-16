<template>
  <div class="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
          <svg class="w-5 h-5 text-zinc-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
          <span>{{ $t('admin.audit.title') }}</span>
        </h1>
        <p class="text-xs text-zinc-500 mt-1">{{ $t('admin.audit.subtitle') }}</p>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="exportAuditCsv"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-700 transition shadow-xs cursor-pointer"
        >
          <svg class="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          <span>{{ $t('common.exportCsv') }}</span>
        </button>
        <button
          @click="fetchLogs"
          class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-700 transition shadow-xs cursor-pointer"
        >
          <svg class="w-3.5 h-3.5 text-zinc-500" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          <span>{{ $t('common.refresh') }}</span>
        </button>
      </div>
    </div>

    <!-- Filter Toolbar -->
    <div class="p-4 rounded-2xl bg-white border border-zinc-200 shadow-card space-y-3">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 text-xs">
        <div>
          <label class="block text-[11.5px] text-zinc-700 font-medium mb-1">{{ $t('admin.audit.action') }}</label>
          <div class="relative">
            <svg class="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              v-model="filters.action"
              @keyup.enter="fetchLogs"
              type="text"
              placeholder="e.g. auth.login..."
              class="w-full h-10 pl-9 pr-3.5 rounded-xl bg-white border border-zinc-200 text-[13px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 shadow-xs transition-colors"
            />
          </div>
        </div>

        <div>
          <label class="block text-[11.5px] text-zinc-700 font-medium mb-1">{{ $t('admin.audit.userId') }}</label>
          <div class="relative">
            <svg class="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            <input
              v-model="filters.user_id"
              @keyup.enter="fetchLogs"
              type="text"
              placeholder="UUID..."
              class="w-full h-10 pl-9 pr-3.5 rounded-xl bg-white border border-zinc-200 text-[13px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 shadow-xs transition-colors font-mono"
            />
          </div>
        </div>

        <div>
          <label class="block text-[11.5px] text-zinc-700 font-medium mb-1">{{ $t('admin.audit.status') }}</label>
          <AppSelect
            v-model="filters.status"
            :options="statusOptions"
            @update:model-value="fetchLogs"
          />
        </div>

        <div>
          <label class="block text-[11.5px] text-zinc-700 font-medium mb-1">{{ $t('admin.audit.fromDate') }}</label>
          <AppDatePicker
            v-model="filters.from_date"
            :placeholder="$t('admin.audit.fromDate')"
            @update:model-value="fetchLogs"
          />
        </div>

        <div>
          <label class="block text-[11.5px] text-zinc-700 font-medium mb-1">{{ $t('admin.audit.toDate') }}</label>
          <AppDatePicker
            v-model="filters.to_date"
            :placeholder="$t('admin.audit.toDate')"
            @update:model-value="fetchLogs"
          />
        </div>
      </div>

      <div v-if="hasActiveFilters" class="flex items-center justify-end pt-1">
        <button
          @click="clearFilters"
          class="inline-flex items-center gap-1.5 text-[12px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
          <span>{{ $t('admin.audit.clearFilters') }}</span>
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="rounded-2xl border border-zinc-200 bg-white shadow-card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-zinc-700">
          <thead class="bg-zinc-50 text-zinc-500 font-semibold text-[11px] border-b border-zinc-200 uppercase tracking-wider">
            <tr>
              <th class="px-4 py-3.5">{{ $t('admin.audit.dateTime') }}</th>
              <th class="px-4 py-3.5">Action</th>
              <th class="px-4 py-3.5">User ID</th>
              <th class="px-4 py-3.5">IP Address</th>
              <th class="px-4 py-3.5">Status</th>
              <th class="px-4 py-3.5 text-right">Details</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-200">
            <tr v-if="loading" class="text-center">
              <td colspan="6" class="py-12 text-zinc-400">{{ $t('admin.audit.loading') }}</td>
            </tr>
            <tr v-else-if="logs.length === 0" class="text-center">
              <td colspan="6" class="py-12 text-zinc-400">{{ $t('admin.audit.empty') }}</td>
            </tr>
            <tr v-for="log in logs" :key="log.id" class="hover:bg-zinc-50/80 transition">
              <td class="px-4 py-3 font-mono text-[11.5px] text-zinc-600 tabular-nums">
                {{ formatDate(log.created_at) }}
              </td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 font-mono text-[11px]">
                  {{ log.action }}
                </span>
              </td>
              <td class="px-4 py-3 font-mono text-[11px] text-zinc-500 truncate max-w-[120px]">
                {{ log.user_id || 'Guest/System' }}
              </td>
              <td class="px-4 py-3 font-mono text-[11px] text-zinc-600">
                {{ log.ip_address || '-' }}
              </td>
              <td class="px-4 py-3">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold"
                  :class="log.status === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'"
                >
                  {{ log.status }}
                </span>
              </td>
              <td class="px-4 py-3 text-right">
                <button
                  @click="openMetadataModal(log)"
                  class="px-3 py-1 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 font-medium transition text-[11px]"
                >
                  {{ $t('admin.audit.viewMetadata') }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <AppPagination
        v-model:page="page"
        :total="total"
        :limit="limit"
        @change="fetchLogs"
      />
    </div>

    <!-- Metadata Modal -->
    <Teleport to="body">
      <div v-if="selectedLog" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs">
        <div class="w-full max-w-lg rounded-2xl bg-white border border-zinc-200 p-6 shadow-modal space-y-4">
          <div class="flex items-center justify-between border-b border-zinc-200 pb-3">
            <h3 class="text-sm font-semibold text-zinc-900">{{ $t('admin.audit.detailsTitle') }}</h3>
            <button @click="selectedLog = null" class="text-zinc-400 hover:text-zinc-700 text-lg leading-none">&times;</button>
          </div>

          <div class="space-y-2 text-xs text-zinc-700">
            <div><span class="text-zinc-400 font-medium">ID:</span> <span class="font-mono text-zinc-900">{{ selectedLog.id }}</span></div>
            <div><span class="text-zinc-400 font-medium">Action:</span> <span class="text-blue-700 font-mono font-semibold">{{ selectedLog.action }}</span></div>
            <div><span class="text-zinc-400 font-medium">User Agent:</span> <span class="font-mono text-zinc-600 text-[11px] block mt-1 break-all">{{ selectedLog.user_agent || '-' }}</span></div>
            <div>
              <span class="text-zinc-400 font-medium block mb-1">Metadata (JSON):</span>
              <pre class="p-3 rounded-xl bg-zinc-50 border border-zinc-200 font-mono text-[11px] text-zinc-800 overflow-x-auto max-h-60">{{ JSON.stringify(selectedLog.metadata || {}, null, 2) }}</pre>
            </div>
          </div>

          <div class="flex justify-end pt-2">
            <button @click="selectedLog = null" class="px-4 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-700">
              {{ $t('admin.images.close') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { exportToCsv } from '~/utils/export'

const { t } = useI18n()

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

interface AuditLog {
  id: string
  user_id?: string
  action: string
  resource_type?: string
  resource_id?: string
  ip_address?: string
  user_agent?: string
  metadata?: any
  status: string
  created_at: string
}

const logs = ref<AuditLog[]>([])
const total = ref(0)
const page = ref(1)
const limit = ref(20)
const loading = ref(false)
const selectedLog = ref<AuditLog | null>(null)

const statusOptions = computed(() => [
  { label: t('admin.audit.all'), value: '' },
  { label: 'Success', value: 'success' },
  { label: 'Failure', value: 'failure' },
])

const filters = ref({
  action: '',
  user_id: '',
  status: '',
  from_date: '',
  to_date: ''
})

const hasActiveFilters = computed(() => {
  return !!(filters.value.action || filters.value.user_id || filters.value.status || filters.value.from_date || filters.value.to_date)
})

function clearFilters() {
  filters.value.action = ''
  filters.value.user_id = ''
  filters.value.status = ''
  filters.value.from_date = ''
  filters.value.to_date = ''
  fetchLogs()
}

function exportAuditCsv() {
  const headers = [
    { label: 'รหัสบันทึก (Log ID)', key: 'id' },
    { label: 'การทำงาน (Action)', key: 'action' },
    { label: 'ผู้ดำเนินการ (User ID)', key: 'user_display' },
    { label: 'หมายเลข IP (IP Address)', key: 'ip_address' },
    { label: 'สถานะ (Status)', key: 'status_display' },
    { label: 'เบราว์เซอร์ / อุปกรณ์ (User Agent)', key: 'user_agent' },
    { label: 'ข้อมูลเพิ่มเติม (Metadata)', key: 'metadata_str' },
    { label: 'วันเวลาบันทึก (Date & Time)', key: 'created_at_formatted' }
  ]
  const data = logs.value.map(l => ({
    id: l.id,
    action: l.action,
    user_display: l.user_id ? `User (${l.user_id})` : 'ระบบ / ผู้ใช้ทั่วไป (System/Guest)',
    ip_address: l.ip_address || '-',
    status_display: String(l.status || '').toUpperCase(),
    user_agent: l.user_agent || '-',
    metadata_str: l.metadata ? JSON.stringify(l.metadata) : '-',
    created_at_formatted: formatDate(l.created_at)
  }))
  exportToCsv('pichost_audit_logs', headers, data)
}

async function fetchLogs() {
  loading.value = true
  try {
    const params: Record<string, any> = {
      page: page.value,
      limit: limit.value
    }
    if (filters.value.action) params.action = filters.value.action
    if (filters.value.user_id) params.user_id = filters.value.user_id
    if (filters.value.status) params.status = filters.value.status
    if (filters.value.from_date) params.from_date = filters.value.from_date
    if (filters.value.to_date) params.to_date = filters.value.to_date

    const res = await apiFetch<any>('/admin/audit-logs', { params })
    if (res.data) {
      logs.value = res.data.items || []
      total.value = res.data.total || 0
    }
  } catch (e) {
    console.error('Failed to load audit logs:', e)
  } finally {
    loading.value = false
  }
}

function formatDate(iso: string) {
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

function openMetadataModal(log: AuditLog) {
  selectedLog.value = log
}

onMounted(() => {
  fetchLogs()
})
</script>
