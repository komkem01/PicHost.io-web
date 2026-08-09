export default defineNuxtRouteMiddleware(async () => {
  const { fetchMe } = useAuth()
  const user = await fetchMe()

  if (user) {
    return navigateTo(user.is_admin ? '/admin' : '/dashboard')
  }
})
