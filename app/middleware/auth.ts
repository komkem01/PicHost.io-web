export default defineNuxtRouteMiddleware(async (to) => {
  const { fetchMe } = useAuth()
  const user = await fetchMe()

  if (!user) {
    return navigateTo(`/auth/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})
