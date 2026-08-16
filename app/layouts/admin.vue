<template>
  <div class="min-h-screen bg-[#FAFAFA] text-zinc-900 font-sans flex">
    <!-- Sidebar -->
    <aside class="w-[220px] shrink-0 bg-white border-r border-zinc-200 flex flex-col fixed top-0 left-0 h-full z-40">
      <!-- Logo -->
      <div class="px-5 pt-6 pb-5">
        <NuxtLink to="/admin" class="flex items-center gap-2 mb-3">
          <img src="/favicon.svg" class="w-5 h-5 rounded-md border border-zinc-200" alt="PicHost logo" />
          <div class="flex items-center gap-0.5">
            <span class="text-zinc-900 font-bold text-[15px] tracking-tight">PicHost</span>
            <span class="text-zinc-400 font-light text-[15px]">.io</span>
          </div>
        </NuxtLink>
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-red-50 border border-red-200 text-[10.5px] font-semibold text-red-700 uppercase tracking-widest">
            <span class="w-1 h-1 rounded-full bg-red-500 inline-block"></span>
            Admin
          </span>
        </div>
      </div>

      <!-- Nav -->
      <nav class="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        <p class="px-3 mb-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">{{ $t('admin.menu.overview') }}</p>
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="group flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] transition-all duration-150"
          :class="isActive(item.to)
            ? 'bg-zinc-100 text-zinc-900 font-medium border border-zinc-200/80'
            : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'"
        >
          <span
            class="w-[30px] h-[30px] shrink-0 rounded-lg flex items-center justify-center transition-all duration-150"
            :class="isActive(item.to) ? item.activeClass : 'bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200/60'"
            v-html="item.icon"
          />
          <span>{{ item.label }}</span>
          <span
            v-if="item.badge"
            class="ml-auto text-[10.5px] font-semibold px-1.5 py-0.5 rounded-md bg-zinc-900 text-white"
          >{{ item.badge }}</span>
        </NuxtLink>
      </nav>

      <!-- Footer -->
      <div class="px-3 pb-4 pt-3 border-t border-zinc-200 space-y-1">
        <div v-if="user" class="flex items-center gap-2.5 px-3 py-2 mt-1 rounded-xl bg-zinc-50 border border-zinc-200">
          <div class="w-7 h-7 rounded-full bg-zinc-900 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
            {{ (user.username ?? user.email ?? 'A').charAt(0).toUpperCase() }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-[12px] font-medium text-zinc-900 truncate">{{ user.username ?? 'Admin' }}</p>
            <p class="text-[10.5px] text-zinc-500 truncate">{{ user.email }}</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main content (offset by sidebar width) -->
    <div class="flex-1 flex flex-col min-h-screen pl-[220px] min-w-0">
      <!-- Top bar -->
      <header class="border-b border-zinc-200 px-8 h-[60px] flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-xl sticky top-0 z-30">
        <div class="flex items-center gap-3">
          <h1 class="text-[14px] font-semibold text-zinc-900">{{ pageTitle }}</h1>
        </div>
        <div class="flex items-center gap-4 text-[12px] text-zinc-500">
          <span class="hidden sm:flex items-center gap-1.5 text-zinc-600 font-medium">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            System online
          </span>
          <AppNotificationBell />
          <LanguageSwitcher />
        </div>
      </header>

      <main class="flex-1 overflow-y-auto min-w-0">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { user } = useAuth()
const { t, locale } = useI18n()

useHead({
  htmlAttrs: {
    lang: computed(() => locale.value)
  }
})

function isActive(to: string) {
  if (to === '/admin') return route.path === '/admin'
  return route.path.startsWith(to)
}

interface NavItem { to: string; label: string; activeClass: string; icon: string; badge?: string }
const navItems = computed<NavItem[]>(() => [
  {
    to: '/admin',
    label: t('nav.dashboard'),
    activeClass: 'bg-zinc-900 text-white',
    icon: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"/></svg>`,
  },
  {
    to: '/admin/users',
    label: t('admin.menu.users'),
    activeClass: 'bg-zinc-900 text-white',
    icon: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"/></svg>`,
  },
  {
    to: '/admin/plans',
    label: t('admin.menu.plans'),
    activeClass: 'bg-zinc-900 text-white',
    icon: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9h16.5m-16.5 6h16.5M8.25 4.5h7.5a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5h-7.5a1.5 1.5 0 0 1-1.5-1.5V6a1.5 1.5 0 0 1 1.5-1.5Z"/></svg>`,
  },
  {
    to: '/admin/payments',
    label: t('admin.menu.payments'),
    activeClass: 'bg-zinc-900 text-white',
    icon: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"/></svg>`,
  },
  {
    to: '/admin/images',
    label: t('admin.menu.images'),
    activeClass: 'bg-zinc-900 text-white',
    icon: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"/></svg>`,
  },
  {
    to: '/admin/storage',
    label: t('admin.menu.storage'),
    activeClass: 'bg-zinc-900 text-white',
    icon: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 5.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"/></svg>`,
  },
  {
    to: '/admin/notifications',
    label: t('admin.menu.notifications'),
    activeClass: 'bg-zinc-900 text-white',
    icon: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"/></svg>`,
  },
  {
    to: '/admin/audit',
    label: t('admin.menu.audit'),
    activeClass: 'bg-zinc-900 text-white',
    icon: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3-12H7.5a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 7.5 21h9a2.25 2.25 0 0 0 2.25-2.25V9L15 3Z"/></svg>`,
  },
  {
    to: '/admin/legal',
    label: 'Legal & Policies',
    activeClass: 'bg-zinc-900 text-white',
    icon: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/></svg>`,
  },
])

const pageTitle = computed(() => {
  if (route.path === '/admin') return t('admin.title')
  if (route.path === '/admin/users') return t('admin.menu.users')
  if (route.path.startsWith('/admin/users/')) return 'User Detail'
  if (route.path === '/admin/plans') return t('admin.menu.plans')
  if (route.path.startsWith('/admin/plans/')) return 'Plan Detail'
  if (route.path === '/admin/payments') return t('admin.menu.payments')
  if (route.path.startsWith('/admin/payments/')) return 'Payment Detail'
  if (route.path === '/admin/images') return t('admin.menu.images')
  if (route.path === '/admin/storage') return t('admin.menu.storage')
  if (route.path === '/admin/notifications') return t('admin.menu.notifications')
  if (route.path === '/admin/audit') return t('admin.menu.audit')
  if (route.path === '/admin/legal') return 'Legal & Policies'
  return 'Admin'
})

</script>
