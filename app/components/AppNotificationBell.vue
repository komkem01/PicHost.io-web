<template>
  <div class="relative" ref="dropdownRef">
    <!-- Bell Icon Button -->
    <button
      type="button"
      @click="toggleDropdown"
      class="relative p-2 rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 active:scale-95 transition-all cursor-pointer"
      :aria-label="$t('notifications.title')"
      :title="$t('notifications.title')"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
      </svg>

      <!-- Unread Badge -->
      <span
        v-if="unreadCount > 0"
        class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white font-bold text-[10px] flex items-center justify-center shadow-xs animate-in zoom-in-75 duration-200"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </button>

    <!-- Dropdown Popover -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 scale-95 -translate-y-1"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 -translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-zinc-200 shadow-2xl z-50 overflow-hidden text-xs"
      >
        <!-- Dropdown Header -->
        <div class="px-4 py-3 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
          <div class="flex items-center gap-2">
            <span class="font-bold text-zinc-900 text-[13px]">{{ $t('notifications.title') }}</span>
            <span
              v-if="unreadCount > 0"
              class="px-2 py-0.5 rounded-full bg-red-50 text-red-600 font-semibold text-[10.5px] border border-red-200"
            >
              {{ unreadCount }} {{ $t('notifications.unread') }}
            </span>
          </div>

          <button
            v-if="unreadCount > 0"
            type="button"
            @click="handleMarkAllAsRead"
            class="text-[11.5px] font-medium text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
          >
            {{ $t('notifications.markAllRead') }}
          </button>
        </div>

        <!-- Notification Items List -->
        <div class="max-h-[380px] overflow-y-auto divide-y divide-zinc-100">
          <div v-if="loading && items.length === 0" class="p-6 text-center text-zinc-400 space-y-2">
            <svg class="w-5 h-5 animate-spin mx-auto text-zinc-400" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <p>{{ $t('common.loading') }}</p>
          </div>

          <div v-else-if="items.length === 0" class="py-12 px-4 text-center text-zinc-400 space-y-2">
            <div class="w-10 h-10 rounded-2xl bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
              </svg>
            </div>
            <p class="font-medium text-zinc-600 text-xs">{{ $t('notifications.empty') }}</p>
          </div>

          <div
            v-for="item in items.slice(0, 6)"
            :key="item.id"
            @click="handleNotificationClick(item)"
            class="p-3.5 flex items-start gap-3 hover:bg-zinc-50/80 transition-colors cursor-pointer group relative"
            :class="{ 'bg-blue-50/30': !item.is_read }"
          >
            <!-- Type Icon -->
            <div
              class="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center border shadow-2xs mt-0.5"
              :class="iconClass(item.type)"
            >
              <!-- Moderation / Deletion Icon -->
              <svg v-if="item.type === 'moderation'" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>

              <!-- Payment Icon -->
              <svg v-else-if="item.type === 'payment'" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15A2.25 2.25 0 0 0 2.25 6.75v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
              </svg>

              <!-- Security Icon -->
              <svg v-else-if="item.type === 'security'" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>

              <!-- Default Announcement / Bell Icon -->
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.46a24.845 24.845 0 0 1-1.328-3.934m2.99-9.46c.253-.962.584-1.892.985-2.783.247-.55.06-1.21-.463-1.511l-.657-.38c-.551-.318-1.26-.117-1.527.46a24.845 24.845 0 0 0-1.328 3.934m12.183 4.73a4.5 4.5 0 0 1-4.5 4.5H15v-9h1.75a4.5 4.5 0 0 1 4.5 4.5Z" />
              </svg>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0 pr-2">
              <div class="flex items-center justify-between gap-1">
                <p class="font-semibold text-zinc-900 truncate" :class="{ 'font-bold': !item.is_read }">
                  {{ item.title }}
                </p>
                <span v-if="!item.is_read" class="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
              </div>
              <p class="text-[11.5px] text-zinc-600 mt-0.5 line-clamp-2 leading-relaxed">
                {{ item.message }}
              </p>
              <p class="text-[10px] text-zinc-400 mt-1 tabular-nums">
                {{ formatRelativeTime(item.created_at) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-2.5 border-t border-zinc-100 text-center bg-zinc-50/50">
          <NuxtLink
            to="/notifications"
            @click="isOpen = false"
            class="block py-1.5 text-center font-semibold text-zinc-700 hover:text-zinc-900 text-xs rounded-xl hover:bg-zinc-100/80 transition"
          >
            {{ $t('notifications.viewAll') }} →
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const { notifications: items, unreadCount, loading, fetchNotifications, markAsRead, markAllAsRead, startPolling, stopPolling } = useNotifications()
const router = useRouter()
const { locale } = useI18n()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

function toggleDropdown() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    fetchNotifications({ limit: 10 })
  }
}

async function handleNotificationClick(item: any) {
  if (!item.is_read) {
    await markAsRead(item.id)
  }
  if (item.link) {
    isOpen.value = false
    router.push(item.link)
  }
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

function formatRelativeTime(iso: string) {
  if (!iso) return ''
  const d = new Date(iso)
  const now = new Date()
  const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000)

  if (diffSec < 60) return locale.value === 'th' ? 'เมื่อสักครู่' : 'Just now'
  if (diffSec < 3600) {
    const mins = Math.floor(diffSec / 60)
    return locale.value === 'th' ? `${mins} นาทีที่แล้ว` : `${mins}m ago`
  }
  if (diffSec < 86400) {
    const hours = Math.floor(diffSec / 3600)
    return locale.value === 'th' ? `${hours} ชั่วโมงที่แล้ว` : `${hours}h ago`
  }
  return d.toLocaleDateString(locale.value === 'th' ? 'th-TH' : 'en-US', {
    month: 'short',
    day: 'numeric'
  })
}

function handleClickOutside(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  startPolling(30000)
  if (typeof window !== 'undefined') {
    window.addEventListener('click', handleClickOutside)
  }
})

onUnmounted(() => {
  stopPolling()
  if (typeof window !== 'undefined') {
    window.removeEventListener('click', handleClickOutside)
  }
})
</script>
