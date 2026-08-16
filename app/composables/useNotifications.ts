import { ref, computed } from 'vue'

export interface AppNotification {
  id: string
  user_id?: string
  target_role: string
  type: 'moderation' | 'payment' | 'security' | 'storage' | 'system' | 'announcement'
  title: string
  message: string
  link?: string
  metadata?: Record<string, any>
  is_read: boolean
  read_at?: string
  created_at: string
}

// Global shared reactive states
const notifications = ref<AppNotification[]>([])
const unreadCount = ref(0)
const loading = ref(false)
const total = ref(0)
let pollTimer: any = null

export function useNotifications() {
  const { loggedIn } = useAuth()
  const { success: toastSuccess, error: toastError } = useToast()

  async function fetchNotifications(params: { unread?: boolean; type?: string; page?: number; limit?: number } = {}) {
    if (!loggedIn.value) return
    loading.value = true
    try {
      const res = await apiFetch<any>('/notifications', { params })
      if (res.data) {
        notifications.value = res.data.items || []
        total.value = res.data.total || 0
        unreadCount.value = res.data.unread_count || 0
      }
    } catch (e) {
      console.error('Failed to fetch notifications:', e)
    } finally {
      loading.value = false
    }
  }

  async function fetchUnreadCount() {
    if (!loggedIn.value) return
    try {
      const res = await apiFetch<any>('/notifications/unread-count')
      if (res.data) {
        unreadCount.value = res.data.unread_count || 0
      }
    } catch {}
  }

  async function markAsRead(id: string) {
    try {
      await apiFetch(`/notifications/${id}/read`, { method: 'PATCH' })
      const item = notifications.value.find(n => n.id === id)
      if (item && !item.is_read) {
        item.is_read = true
        unreadCount.value = Math.max(0, unreadCount.value - 1)
      }
    } catch (e) {
      console.error('Failed to mark as read:', e)
    }
  }

  async function markAllAsRead() {
    try {
      await apiFetch('/notifications/read-all', { method: 'POST' })
      notifications.value.forEach(n => {
        n.is_read = true
      })
      unreadCount.value = 0
    } catch (e) {
      console.error('Failed to mark all as read:', e)
    }
  }

  async function deleteNotification(id: string) {
    try {
      await apiFetch(`/notifications/${id}`, { method: 'DELETE' })
      const idx = notifications.value.findIndex(n => n.id === id)
      if (idx > -1) {
        if (!notifications.value[idx].is_read) {
          unreadCount.value = Math.max(0, unreadCount.value - 1)
        }
        notifications.value.splice(idx, 1)
        total.value = Math.max(0, total.value - 1)
      }
    } catch (e) {
      toastError('Failed to delete notification')
    }
  }

  function startPolling(intervalMs = 30000) {
    if (typeof window === 'undefined') return
    if (pollTimer) clearInterval(pollTimer)
    fetchUnreadCount()
    pollTimer = setInterval(() => {
      if (loggedIn.value) {
        fetchUnreadCount()
      }
    }, intervalMs)
  }

  function stopPolling() {
    if (pollTimer) {
      clearInterval(pollTimer)
      pollTimer = null
    }
  }

  return {
    notifications,
    unreadCount,
    loading,
    total,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    startPolling,
    stopPolling,
  }
}
