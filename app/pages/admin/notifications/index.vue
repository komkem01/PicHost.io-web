<template>
  <div class="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight flex items-center gap-2.5">
          <svg class="w-6 h-6 text-zinc-800" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
          <span>{{ $t('admin.notifications.title') || 'ระบบแจ้งเตือน & ประกาศ (Notifications Console)' }}</span>
        </h1>
        <p class="text-xs sm:text-sm text-zinc-500 mt-1">
          {{ $t('admin.notifications.desc') || 'ตรวจสอบรายการแจ้งเตือนทั้งหมดของระบบ และส่งประกาศแจ้งเตือน (Broadcast) ถึงผู้ใช้ทุกคน' }}
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="showBroadcastModal = true"
          class="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold shadow-xs hover:shadow-md transition active:scale-98 cursor-pointer flex items-center gap-1.5"
        >
          <svg class="w-4 h-4 text-zinc-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
          </svg>
          <span>{{ $t('admin.notifications.sendBroadcast') || 'ส่งประกาศระบบ (Broadcast)' }}</span>
        </button>

        <button
          @click="fetchLogs"
          :disabled="loading"
          class="p-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900 shadow-2xs transition cursor-pointer disabled:opacity-50"
          :title="$t('common.refresh')"
        >
          <svg class="w-4 h-4" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </button>
      </div>
    </div>

    <!-- KPI Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-4 rounded-2xl border border-zinc-200 bg-white shadow-2xs">
        <div class="flex items-center justify-between text-xs text-zinc-500">
          <span>{{ $t('admin.notifications.totalAlerts') || 'การแจ้งเตือนทั้งหมด' }}</span>
          <div class="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
          </div>
        </div>
        <p class="text-2xl font-bold text-zinc-900 mt-2 tabular-nums">{{ total }}</p>
      </div>

      <div class="p-4 rounded-2xl border border-zinc-200 bg-white shadow-2xs">
        <div class="flex items-center justify-between text-xs text-zinc-500">
          <span>{{ $t('admin.notifications.moderationCount') || 'การจัดการลบรูป (Moderation)' }}</span>
          <div class="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </div>
        </div>
        <p class="text-2xl font-bold text-red-600 mt-2 tabular-nums">{{ moderationCount }}</p>
      </div>

      <div class="p-4 rounded-2xl border border-zinc-200 bg-white shadow-2xs">
        <div class="flex items-center justify-between text-xs text-zinc-500">
          <span>{{ $t('admin.notifications.paymentAlerts') || 'การชำระเงิน & สลิป' }}</span>
          <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15A2.25 2.25 0 0 0 2.25 6.75v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
            </svg>
          </div>
        </div>
        <p class="text-2xl font-bold text-emerald-600 mt-2 tabular-nums">{{ paymentCount }}</p>
      </div>

      <div class="p-4 rounded-2xl border border-zinc-200 bg-white shadow-2xs">
        <div class="flex items-center justify-between text-xs text-zinc-500">
          <span>{{ $t('admin.notifications.broadcasts') || 'ประกาศสาธารณะ' }}</span>
          <div class="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.46a24.845 24.845 0 0 1-1.328-3.934m2.99-9.46c.253-.962.584-1.892.985-2.783.247-.55.06-1.21-.463-1.511l-.657-.38c-.551-.318-1.26-.117-1.527.46a24.845 24.845 0 0 0-1.328 3.934m12.183 4.73a4.5 4.5 0 0 1-4.5 4.5H15v-9h1.75a4.5 4.5 0 0 1 4.5 4.5Z" />
            </svg>
          </div>
        </div>
        <p class="text-2xl font-bold text-blue-600 mt-2 tabular-nums">{{ broadcastCount }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
      <button
        v-for="tab in filterTabs"
        :key="tab.id"
        @click="activeFilter = tab.id"
        class="px-3.5 py-1.5 rounded-xl border transition cursor-pointer"
        :class="activeFilter === tab.id ? 'bg-zinc-900 border-zinc-900 text-white font-semibold shadow-xs' : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Notifications Table -->
    <div class="rounded-2xl border border-zinc-200 bg-white shadow-2xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-zinc-50/80 border-b border-zinc-200 text-zinc-500 font-medium">
            <tr>
              <th class="py-3 px-4">{{ $t('admin.notifications.type') || 'ประเภท' }}</th>
              <th class="py-3 px-4">{{ $t('admin.notifications.target') || 'เป้าหมาย' }}</th>
              <th class="py-3 px-4">{{ $t('admin.notifications.titleCol') || 'หัวข้อ & ข้อความ' }}</th>
              <th class="py-3 px-4">{{ $t('admin.notifications.link') || 'ลิงก์ที่เกี่ยวข้อง' }}</th>
              <th class="py-3 px-4">{{ $t('admin.notifications.createdAt') || 'เวลา' }}</th>
              <th class="py-3 px-4 text-right">{{ $t('common.actions') || 'จัดการ' }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100">
            <tr v-if="loading && items.length === 0">
              <td colspan="6" class="py-12 text-center text-zinc-400">
                <svg class="w-5 h-5 animate-spin mx-auto text-zinc-400 mb-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>{{ $t('common.loading') }}</span>
              </td>
            </tr>

            <tr v-else-if="filteredItems.length === 0">
              <td colspan="6" class="py-12 text-center text-zinc-400">
                {{ $t('notifications.empty') || 'ไม่พบรายการแจ้งเตือน' }}
              </td>
            </tr>

            <tr
              v-for="item in filteredItems"
              :key="item.id"
              class="hover:bg-zinc-50/60 transition"
            >
              <td class="py-3.5 px-4 whitespace-nowrap">
                <span
                  class="px-2.5 py-1 rounded-full text-[10.5px] font-bold border inline-flex items-center gap-1"
                  :class="typeBadgeClass(item.type)"
                >
                  {{ item.type }}
                </span>
              </td>

              <td class="py-3.5 px-4 whitespace-nowrap text-zinc-600">
                <div class="flex items-center gap-1">
                  <span class="font-semibold text-zinc-800 capitalize">{{ item.target_role }}</span>
                  <span v-if="item.user_id" class="text-[10px] text-zinc-400 font-mono">
                    ({{ item.user_id.slice(0, 8) }}...)
                  </span>
                </div>
              </td>

              <td class="py-3.5 px-4 max-w-sm">
                <p class="font-bold text-zinc-900">{{ item.title }}</p>
                <p class="text-[11.5px] text-zinc-500 line-clamp-2 mt-0.5">{{ item.message }}</p>
              </td>

              <td class="py-3.5 px-4 whitespace-nowrap">
                <NuxtLink
                  v-if="item.link"
                  :to="item.link"
                  class="text-blue-600 hover:text-blue-700 hover:underline font-mono text-[11px]"
                >
                  {{ item.link }}
                </NuxtLink>
                <span v-else class="text-zinc-400">-</span>
              </td>

              <td class="py-3.5 px-4 whitespace-nowrap text-zinc-500 tabular-nums">
                {{ formatDate(item.created_at) }}
              </td>

              <td class="py-3.5 px-4 whitespace-nowrap text-right">
                <button
                  @click="handleDelete(item.id)"
                  class="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                  :title="$t('common.delete')"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      <div class="p-4 border-t border-zinc-200 bg-zinc-50/50 flex items-center justify-between text-xs text-zinc-500">
        <span>{{ $t('common.showing') || 'แสดง' }} {{ filteredItems.length }} จาก {{ total }} รายการ</span>
        <div class="flex items-center gap-2">
          <button
            @click="page = Math.max(1, page - 1); fetchLogs()"
            :disabled="page <= 1"
            class="px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 disabled:opacity-40 cursor-pointer font-medium"
          >
            {{ $t('common.prev') || 'ก่อนหน้า' }}
          </button>
          <span class="font-semibold text-zinc-800">{{ page }}</span>
          <button
            @click="page++; fetchLogs()"
            :disabled="filteredItems.length < limit"
            class="px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 disabled:opacity-40 cursor-pointer font-medium"
          >
            {{ $t('common.next') || 'ถัดไป' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Send Broadcast Modal -->
    <Teleport to="body">
      <div
        v-if="showBroadcastModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs"
        @click.self="showBroadcastModal = false"
      >
        <div class="relative w-full max-w-lg rounded-2xl border border-zinc-200 bg-white shadow-2xl p-6 space-y-4 text-xs">
          <div class="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h3 class="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
              </svg>
              <span>{{ $t('admin.notifications.broadcastModalTitle') || 'ส่งประกาศแจ้งเตือนระบบ (Broadcast)' }}</span>
            </h3>
            <button @click="showBroadcastModal = false" class="text-zinc-400 hover:text-zinc-700 cursor-pointer">
              ✕
            </button>
          </div>

          <form @submit.prevent="submitBroadcast" class="space-y-3.5 text-left">
            <div>
              <label class="block font-semibold text-zinc-700 mb-1">
                {{ $t('admin.notifications.targetRole') || 'กลุ่มเป้าหมาย' }}
              </label>
              <AppSelect
                v-model="form.target_role"
                :options="targetRoleOptions"
              />
            </div>

            <div>
              <label class="block font-semibold text-zinc-700 mb-1">
                {{ $t('admin.notifications.type') || 'ประเภทการแจ้งเตือน' }}
              </label>
              <AppSelect
                v-model="form.type"
                :options="typeOptions"
              />
            </div>

            <div>
              <label class="block font-semibold text-zinc-700 mb-1">
                {{ $t('admin.notifications.title') || 'หัวข้อประกาศ' }} *
              </label>
              <input
                v-model="form.title"
                type="text"
                required
                placeholder="เช่น การปรับปรุงระบบชั่วคราว หรือ ฟีเจอร์ใหม่"
                class="w-full h-9 px-3 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-900 focus:outline-none focus:border-zinc-400"
              />
            </div>

            <div>
              <label class="block font-semibold text-zinc-700 mb-1">
                {{ $t('admin.notifications.message') || 'เนื้อหาข้อความ' }} *
              </label>
              <textarea
                v-model="form.message"
                required
                rows="3"
                placeholder="ระบุรายละเอียดประกาศ..."
                class="w-full p-3 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-900 focus:outline-none focus:border-zinc-400"
              ></textarea>
            </div>

            <div>
              <label class="block font-semibold text-zinc-700 mb-1">
                {{ $t('admin.notifications.link') || 'ลิงก์ปลายทาง (ทางเลือก)' }}
              </label>
              <input
                v-model="form.link"
                type="text"
                placeholder="เช่น /pricing หรือ /terms"
                class="w-full h-9 px-3 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-900 focus:outline-none focus:border-zinc-400"
              />
            </div>

            <div class="flex items-center gap-2 pt-3 border-t border-zinc-100">
              <button
                type="button"
                @click="showBroadcastModal = false"
                class="flex-1 py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 font-semibold cursor-pointer"
              >
                {{ $t('common.cancel') }}
              </button>
              <button
                type="submit"
                :disabled="submitting"
                class="flex-1 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold cursor-pointer disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
              >
                <svg v-if="submitting" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>{{ $t('admin.notifications.sendNow') || 'ส่งประกาศทันที' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const { t, locale } = useI18n()
const { success: toastSuccess, error: toastError } = useToast()

const items = ref<any[]>([])
const loading = ref(false)
const submitting = ref(false)
const total = ref(0)
const page = ref(1)
const limit = ref(20)

const activeFilter = ref('all')
const showBroadcastModal = ref(false)

const form = ref({
  target_role: 'all',
  type: 'announcement',
  title: '',
  message: '',
  link: ''
})

const targetRoleOptions = computed(() => [
  { value: 'all', label: t('admin.notifications.targetOptions.all') },
  { value: 'user', label: t('admin.notifications.targetOptions.user') },
  { value: 'admin', label: t('admin.notifications.targetOptions.admin') }
])

const typeOptions = computed(() => [
  { value: 'announcement', label: t('admin.notifications.typeOptions.announcement') },
  { value: 'system', label: t('admin.notifications.typeOptions.system') },
  { value: 'security', label: t('admin.notifications.typeOptions.security') }
])

const filterTabs = [
  { id: 'all', label: 'ทั้งหมด (All)' },
  { id: 'moderation', label: 'การลบรูป (Moderation)' },
  { id: 'payment', label: 'การชำระเงิน (Payments)' },
  { id: 'announcement', label: 'ประกาศ (Broadcasts)' },
  { id: 'security', label: 'ความปลอดภัย (Security)' }
]

const moderationCount = computed(() => items.value.filter(i => i.type === 'moderation').length)
const paymentCount = computed(() => items.value.filter(i => i.type === 'payment').length)
const broadcastCount = computed(() => items.value.filter(i => i.type === 'announcement' || i.type === 'system').length)

const filteredItems = computed(() => {
  if (activeFilter.value === 'all') return items.value
  return items.value.filter(i => i.type === activeFilter.value)
})

async function fetchLogs() {
  loading.value = true
  try {
    const res = await apiFetch<any>('/admin/notifications', {
      params: { page: page.value, limit: limit.value }
    })
    if (res.data) {
      items.value = res.data.items || []
      total.value = res.data.total || 0
    }
  } catch (e) {
    console.error('Failed to load admin notifications:', e)
  } finally {
    loading.value = false
  }
}

async function submitBroadcast() {
  submitting.value = true
  try {
    await apiFetch('/admin/notifications/broadcast', {
      method: 'POST',
      body: {
        target_role: form.value.target_role,
        type: form.value.type,
        title: form.value.title,
        message: form.value.message,
        link: form.value.link ? form.value.link : undefined
      }
    })
    toastSuccess(t('toast.saveSuccess') || 'ส่งประกาศสำเร็จแล้ว')
    showBroadcastModal.value = false
    form.value = {
      target_role: 'all',
      type: 'announcement',
      title: '',
      message: '',
      link: ''
    }
    fetchLogs()
  } catch (e) {
    toastError(t('toast.saveError') || 'เกิดข้อผิดพลาดในการส่งประกาศ')
  } finally {
    submitting.value = false
  }
}

async function handleDelete(id: string) {
  try {
    await apiFetch(`/admin/notifications/${id}`, { method: 'DELETE' })
    items.value = items.value.filter(i => i.id !== id)
    total.value = Math.max(0, total.value - 1)
    toastSuccess(t('toast.deleteSuccess') || 'ลบรายการแจ้งเตือนแล้ว')
  } catch (e) {
    toastError(t('toast.deleteError'))
  }
}

function typeBadgeClass(type: string) {
  switch (type) {
    case 'moderation':
      return 'bg-red-50 border-red-200 text-red-700'
    case 'payment':
      return 'bg-emerald-50 border-emerald-200 text-emerald-700'
    case 'security':
      return 'bg-amber-50 border-amber-200 text-amber-700'
    default:
      return 'bg-blue-50 border-blue-200 text-blue-700'
  }
}

function formatDate(iso: string) {
  if (!iso) return '-'
  return new Date(iso).toLocaleDateString(locale.value === 'th' ? 'th-TH' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchLogs()
})
</script>
