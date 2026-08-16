<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight flex items-center gap-2.5">
          <span>{{ $t('notifications.centerTitle') || 'ศูนย์การแจ้งเตือน' }}</span>
          <span
            v-if="unreadCount > 0"
            class="px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 font-bold text-xs border border-red-200"
          >
            {{ unreadCount }} {{ $t('notifications.unread') }}
          </span>
        </h1>
        <p class="text-xs sm:text-sm text-zinc-500 mt-1">
          {{ $t('notifications.centerDesc') || 'ติดตามข่าวสาร การแจ้งเตือนความปลอดภัย การชำระเงิน และการแจ้งเตือนจากระบบ' }}
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          v-if="unreadCount > 0"
          @click="handleMarkAllAsRead"
          class="px-3.5 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-semibold shadow-2xs transition cursor-pointer flex items-center gap-1.5"
        >
          <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
          <span>{{ $t('notifications.markAllRead') }}</span>
        </button>

        <button
          @click="refresh"
          :disabled="loading"
          class="p-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900 shadow-2xs transition cursor-pointer disabled:opacity-50"
          :title="$t('common.refresh') || 'รีเฟรช'"
        >
          <svg class="w-4 h-4" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-zinc-200 text-xs font-medium">
      <button
        v-for="tab in filterTabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        class="px-3.5 py-2 rounded-xl transition whitespace-nowrap cursor-pointer flex items-center gap-1.5"
        :class="activeTab === tab.id ? 'bg-zinc-900 text-white font-semibold shadow-xs' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'"
      >
        <span>{{ tab.label }}</span>
        <span
          v-if="tab.count !== undefined && tab.count > 0"
          class="px-1.5 py-0.2 rounded-full text-[10px] font-bold"
          :class="activeTab === tab.id ? 'bg-zinc-700 text-white' : 'bg-zinc-200 text-zinc-700'"
        >
          {{ tab.count }}
        </span>
      </button>
    </div>

    <!-- Notification List -->
    <div class="space-y-3">
      <!-- Loading State -->
      <div v-if="loading && items.length === 0" class="py-16 text-center space-y-3">
        <svg class="w-7 h-7 animate-spin mx-auto text-zinc-400" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <p class="text-xs text-zinc-400 font-medium">{{ $t('common.loading') }}</p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="filteredNotifications.length === 0"
        class="py-16 px-4 rounded-2xl border border-dashed border-zinc-300 bg-white text-center space-y-3 shadow-2xs"
      >
        <div class="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
        </div>
        <p class="text-sm font-semibold text-zinc-700">{{ $t('notifications.empty') || 'ไม่มีการแจ้งเตือนในขณะนี้' }}</p>
        <p class="text-xs text-zinc-400 max-w-sm mx-auto">
          {{ $t('notifications.emptyHint') || 'เมื่อมีความคืบหน้าเกี่ยวกับการใช้งานบัญชีหรือรูปภาพของคุณ ระบบจะแจ้งเตือนให้ทราบที่นี่' }}
        </p>
      </div>

      <!-- Item Card -->
      <div
        v-for="item in filteredNotifications"
        :key="item.id"
        class="p-4 sm:p-5 rounded-2xl border bg-white shadow-2xs transition-all hover:shadow-md flex items-start gap-4 group relative"
        :class="[
          item.is_read ? 'border-zinc-200' : 'border-blue-200/80 bg-blue-50/20 ring-1 ring-blue-500/10',
          item.type === 'moderation' && !item.is_read ? 'border-red-200 bg-red-50/15' : ''
        ]"
      >
        <!-- Icon Badge -->
        <div
          class="w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center border shadow-2xs mt-0.5"
          :class="iconClass(item.type)"
        >
          <!-- Moderation / Deletion -->
          <svg v-if="item.type === 'moderation'" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>

          <!-- Payment -->
          <svg v-else-if="item.type === 'payment'" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15A2.25 2.25 0 0 0 2.25 6.75v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
          </svg>

          <!-- Security -->
          <svg v-else-if="item.type === 'security'" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>

          <!-- Default Announcement -->
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.46a24.845 24.845 0 0 1-1.328-3.934m2.99-9.46c.253-.962.584-1.892.985-2.783.247-.55.06-1.21-.463-1.511l-.657-.38c-.551-.318-1.26-.117-1.527.46a24.845 24.845 0 0 0-1.328 3.934m12.183 4.73a4.5 4.5 0 0 1-4.5 4.5H15v-9h1.75a4.5 4.5 0 0 1 4.5 4.5Z" />
          </svg>
        </div>

        <!-- Content Area -->
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-bold text-zinc-900 text-sm">
                  {{ item.title }}
                </h3>
                <span
                  v-if="!item.is_read"
                  class="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10.5px]"
                >
                  {{ $t('notifications.new') || 'ใหม่' }}
                </span>
              </div>
              <p class="text-xs text-zinc-400 mt-0.5 tabular-nums">
                {{ formatDate(item.created_at) }}
              </p>
            </div>

            <!-- Action buttons -->
            <div class="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                v-if="!item.is_read"
                @click="markAsRead(item.id)"
                class="p-1.5 rounded-lg text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 transition cursor-pointer"
                :title="$t('notifications.markRead') || 'อ่านแล้ว'"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </button>

              <button
                @click="deleteNotification(item.id)"
                class="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                :title="$t('common.delete') || 'ลบ'"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Message Body -->
          <div class="mt-2 text-xs text-zinc-700 leading-relaxed bg-zinc-50/70 p-3 rounded-xl border border-zinc-100 font-sans">
            {{ item.message }}
          </div>

          <!-- Action Link if present -->
          <div v-if="item.link" class="mt-3">
            <NuxtLink
              :to="item.link"
              @click="markAsRead(item.id)"
              class="inline-flex items-center gap-1 text-xs font-semibold text-zinc-900 hover:text-zinc-700 hover:underline cursor-pointer"
            >
              <span>{{ $t('notifications.viewDetails') || 'ดูรายละเอียด' }}</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  middleware: 'auth'
})

const {
  notifications: items,
  unreadCount,
  loading,
  fetchNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = useNotifications()

const activeTab = ref('all')
const { t, locale } = useI18n()

const filterTabs = computed(() => [
  { id: 'all', label: t('notifications.tabs.all') || 'ทั้งหมด' },
  { id: 'unread', label: t('notifications.tabs.unread') || 'ยังไม่ได้อ่าน', count: unreadCount.value },
  { id: 'moderation', label: t('notifications.tabs.moderation') || 'การจัดการรูปภาพ (ลบรูป)' },
  { id: 'payment', label: t('notifications.tabs.payment') || 'การชำระเงิน' },
  { id: 'system', label: t('notifications.tabs.system') || 'ระบบ & ประกาศ' }
])

const filteredNotifications = computed(() => {
  if (activeTab.value === 'unread') {
    return items.value.filter(n => !n.is_read)
  }
  if (activeTab.value === 'moderation') {
    return items.value.filter(n => n.type === 'moderation')
  }
  if (activeTab.value === 'payment') {
    return items.value.filter(n => n.type === 'payment')
  }
  if (activeTab.value === 'system') {
    return items.value.filter(n => n.type === 'system' || n.type === 'announcement' || n.type === 'security')
  }
  return items.value
})

function refresh() {
  fetchNotifications()
}

async function handleMarkAllAsRead() {
  await markAllAsRead()
}

function iconClass(type: string) {
  switch (type) {
    case 'moderation':
      return 'bg-red-50 border-red-200 text-red-600'
    case 'payment':
      return 'bg-emerald-50 border-emerald-200 text-emerald-600'
    case 'security':
      return 'bg-amber-50 border-amber-200 text-amber-600'
    default:
      return 'bg-blue-50 border-blue-200 text-blue-600'
  }
}

function formatDate(iso: string) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(locale.value === 'th' ? 'th-TH' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchNotifications()
})
</script>
