const show = ref(false)

export function useLogoutModal() {
  function open() {
    show.value = true
  }

  function close() {
    show.value = false
  }

  return {
    show: readonly(show),
    open,
    close,
  }
}
