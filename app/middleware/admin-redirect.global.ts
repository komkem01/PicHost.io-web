export default defineNuxtRouteMiddleware(async (to) => {
  const { fetchMe } = useAuth()
  const user = await fetchMe()

  // 1. Any route under /admin strictly requires an Admin user.
  // Regular users or unauthenticated users attempting to access /admin will be blocked and redirected.
  if (to.path.startsWith('/admin')) {
    if (!user) {
      return navigateTo(`/auth/login?redirect=${encodeURIComponent(to.fullPath)}`)
    }
    if (!user.is_admin) {
      return navigateTo('/dashboard')
    }
    return
  }

  // 2. Admin users are strictly restricted to the /admin portal.
  // Attempts to access non-admin routes will be redirected to /admin.
  if (user && user.is_admin) {
    return navigateTo('/admin')
  }
})
