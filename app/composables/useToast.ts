export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: number
  message: string
  type: ToastType
  duration: number
}

const toasts = ref<Toast[]>([])
let nextId = 0

export function useToast() {
  function add(message: string, type: ToastType = 'info', duration = 4000) {
    const id = ++nextId
    toasts.value.push({ id, message, type, duration })

    if (duration > 0) {
      setTimeout(() => remove(id), duration)
    }
  }

  function remove(id: number) {
    const idx = toasts.value.findIndex((t) => t.id === id)
    if (idx !== -1) toasts.value.splice(idx, 1)
  }

  return {
    toasts: readonly(toasts),
    success: (msg: string, duration?: number) => add(msg, 'success', duration),
    error: (msg: string, duration?: number) => add(msg, 'error', duration),
    warning: (msg: string, duration?: number) => add(msg, 'warning', duration),
    info: (msg: string, duration?: number) => add(msg, 'info', duration),
    remove,
  }
}
