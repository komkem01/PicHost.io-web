<template>
  <div class="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
          <span>📜</span>
          <span>Audit Logs</span>
        </h1>
        <p class="text-xs text-white/40 mt-1">ติดตามและบันทึกประวัติการทำงานในระบบทั้งหมด</p>
      </div>
      <button
        @click="fetchLogs"
        class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-medium text-white/80 transition"
      >
        <svg class="w-3.5 h-3.5" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        <span>{{ $t('common.refresh') || 'รีเฟรช' }}</span>
      </button>
    </div>

    <!-- Filter Toolbar -->
    <div class="p-4 rounded-2xl bg-white/[0.025] border border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
      <div>
        <label class="block text-[11px] text-white/40 mb-1">Action (การทำงาน)</label>
        <input
          v-model="filters.action"
          @keyup.enter="fetchLogs"
          type="text"
          placeholder="เช่น auth.login, admin..."
          class="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50"
        />
      </div>

      <div>
        <label class="block text-[11px] text-white/40 mb-1">Status (สถานะ)</label>
        <select
          v-model="filters.status"
          @change="fetchLogs"
          class="w-full px-3 py-2 rounded-xl bg-[#141417] border border-white/[0.08] text-white focus:outline-none focus:border-blue-500/50"
        >
          <option value="">ทั้งหมด</option>
          <option value="success">Success</option>
          <option value="failure">Failure</option>
        </select>
      </div>

      <div>
        <label class="block text-[11px] text-white/40 mb-1">ตั้งแต่วันที่</label>
        <input
          v-model="filters.from_date"
          @change="fetchLogs"
          type="date"
          class="w-full px-3 py-2 rounded-xl bg-[#141417] border border-white/[0.08] text-white focus:outline-none focus:border-blue-500/50"
        />
      </div>

      <div>
        <label class="block text-[11px] text-white/40 mb-1">ถึงวันที่</label>
        <input
          v-model="filters.to_date"
          @change="fetchLogs"
          type="date"
          class="w-full px-3 py-2 rounded-xl bg-[#141417] border border-white/[0.08] text-white focus:outline-none focus:border-blue-500/50"
        />
      </div>
    </div>

    <!-- Table -->
    <div class="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-white/70">
          <thead class="bg-white/[0.03] text-white/40 font-medium text-[11px] border-b border-white/[0.06]">
            <tr>
              <th class="px-4 py-3.5">เวลา (Date & Time)</th>
              <th class="px-4 py-3.5">Action</th>
              <th class="px-4 py-3.5">User ID</th>
              <th class="px-4 py-3.5">IP Address</th>
              <th class="px-4 py-3.5">Status</th>
              <th class="px-4 py-3.5 text-right">Details</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/[0.04]">
            <tr v-if="loading" class="text-center">
              <td colspan="6" class="py-12 text-white/40">กำลังโหลดข้อมูล...</td>
            </tr>
            <tr v-else-if="logs.length === 0" class="text-center">
              <td colspan="6" class="py-12 text-white/40">ไม่พบประวัติ Audit log</td>
            </tr>
            <tr v-for="log in logs" :key="log.id" class="hover:bg-white/[0.02] transition">
              <td class="px-4 py-3 font-mono text-[11.5px] text-white/60">
                {{ formatDate(log.created_at) }}
              </td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[11px]">
                  {{ log.action }}
                </span>
              </td>
              <td class="px-4 py-3 font-mono text-[11px] text-white/40 truncate max-w-[120px]">
                {{ log.user_id || 'Guest/System' }}
              </td>
              <td class="px-4 py-3 font-mono text-[11px] text-white/50">
                {{ log.ip_address || '-' }}
              </td>
              <td class="px-4 py-3">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-medium"
                  :class="log.status === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'"
                >
                  {{ log.status }}
                </span>
              </td>
              <td class="px-4 py-3 text-right">
                <button
                  @click="openMetadataModal(log)"
                  class="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-white/70 hover:text-white transition text-[11px]"
                >
                  ดู Metadata
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="total > limit" class="px-4 py-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-white/40">
        <span>แสดง {{ (page - 1) * limit + 1 }} - {{ Math.min(page * limit, total) }} จาก {{ total }} รายการ</span>
        <div class="flex items-center gap-2">
          <button
            :disabled="page <= 1"
            @click="page--; fetchLogs()"
            class="px-3 py-1 rounded-lg bg-white/[0.05] disabled:opacity-30 text-white hover:bg-white/[0.1]"
          >
            ย้อนกลับ
          </button>
          <span class="text-white/70">{{ page }}</span>
          <button
            :disabled="page * limit >= total"
            @click="page++; fetchLogs()"
            class="px-3 py-1 rounded-lg bg-white/[0.05] disabled:opacity-30 text-white hover:bg-white/[0.1]"
          >
            ถัดไป
          </button>
        </div>
      </div>
    </div>

    <!-- Metadata Modal -->
    <Teleport to="body">
      <div v-if="selectedLog" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div class="w-full max-w-lg rounded-2xl bg-[#141417] border border-white/[0.1] p-6 shadow-2xl space-y-4">
          <div class="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <h3 class="text-sm font-semibold text-white">Audit Log Details</h3>
            <button @click="selectedLog = null" class="text-white/40 hover:text-white">&times;</button>
          </div>

          <div class="space-y-2 text-xs text-white/70">
            <div><span class="text-white/40">ID:</span> <span class="font-mono text-white/80">{{ selectedLog.id }}</span></div>
            <div><span class="text-white/40">Action:</span> <span class="text-blue-400 font-mono">{{ selectedLog.action }}</span></div>
            <div><span class="text-white/40">User Agent:</span> <span class="font-mono text-white/50 text-[11px] block mt-1 break-all">{{ selectedLog.user_agent || '-' }}</span></div>
            <div>
              <span class="text-white/40 block mb-1">Metadata (JSON):</span>
              <pre class="p-3 rounded-xl bg-black/40 border border-white/[0.06] font-mono text-[11px] text-emerald-400 overflow-x-auto max-h-60">{{ JSON.stringify(selectedLog.metadata || {}, null, 2) }}</pre>
            </div>
          </div>

          <div class="flex justify-end pt-2">
            <button @click="selectedLog = null" class="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-xs font-medium text-white">
              ปิด
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

const { apiFetch } = useApi()

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

const filters = ref({
  action: '',
  status: '',
  from_date: '',
  to_date: ''
})

async function fetchLogs() {
  loading.value = true
  try {
    const params: Record<string, any> = {
      page: page.value,
      limit: limit.value
    }
    if (filters.value.action) params.action = filters.value.action
    if (filters.value.status) params.status = filters.value.status
    if (filters.value.from_date) params.from_date = filters.value.from_date
    if (filters.value.to_date) params.to_date = filters.value.to_date

    const res = await apiFetch<any>('/api/v1/admin/audit-logs', { params })
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
  return new Date(iso).toLocaleString('th-TH', {
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
