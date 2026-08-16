<template>
  <div class="min-h-screen bg-[#09090b] text-white font-sans flex">
    <!-- Sidebar -->
    <aside class="w-[220px] shrink-0 border-r border-white/[0.06] flex flex-col fixed top-0 left-0 h-full z-40">
      <!-- Logo -->
      <div class="px-5 pt-6 pb-5">
        <NuxtLink to="/admin" class="flex items-center gap-2 mb-3">
          <img src="/favicon.svg" class="w-5 h-5 rounded-md border border-white/10" alt="PicHost logo" />
          <div class="flex items-center gap-0.5">
            <span class="text-blue-400 font-bold text-[15px] tracking-tight">PicHost</span>
            <span class="text-white/70 font-light text-[15px]">.io</span>
          </div>
        </NuxtLink>
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-red-500/10 border border-red-500/20 text-[10.5px] font-semibold text-red-400 uppercase tracking-widest">
            <span class="w-1 h-1 rounded-full bg-red-400 inline-block"></span>
            Admin
          </span>
        </div>
      </div>

      <!-- Nav -->
      <nav class="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        <p class="px-3 mb-2 text-[10px] font-semibold text-white/20 uppercase tracking-widest">{{ $t('admin.menu.overview') }}</p>
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="group flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] transition-all duration-150"
          :class="isActive(item.to)
            ? 'bg-white/[0.07] text-white font-medium shadow-sm'
            : 'text-white/45 hover:text-white/80 hover:bg-white/[0.04]'"
        >
          <span
            class="w-[30px] h-[30px] shrink-0 rounded-lg flex items-center justify-center transition-all duration-150"
            :class="isActive(item.to) ? item.activeClass : 'bg-white/[0.04] group-hover:bg-white/[0.07]'"
            v-html="item.icon"
          />
          <span>{{ item.label }}</span>
          <span
            v-if="item.badge"
            class="ml-auto text-[10.5px] font-semibold px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300"
          >{{ item.badge }}</span>
        </NuxtLink>
      </nav>

      <!-- Footer -->
      <div class="px-3 pb-4 pt-3 border-t border-white/[0.05] space-y-1">
        <div v-if="user" class="flex items-center gap-2.5 px-3 py-2 mt-1 rounded-xl bg-white/[0.025] border border-white/[0.05]">
          <div class="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
            {{ (user.username ?? user.email ?? 'A').charAt(0).toUpperCase() }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-[12px] font-medium text-white/80 truncate">{{ user.username ?? 'Admin' }}</p>
            <p class="text-[10.5px] text-white/30 truncate">{{ user.email }}</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main content (offset by sidebar width) -->
    <div class="flex-1 flex flex-col min-h-screen pl-[220px]">
      <!-- Top bar -->
      <header class="border-b border-white/[0.06] px-8 h-[60px] flex items-center justify-between shrink-0 bg-[#09090b]/95 backdrop-blur sticky top-0 z-30">
        <div class="flex items-center gap-3">
          <h1 class="text-[14px] font-semibold text-white/90">{{ pageTitle }}</h1>
        </div>
        <div class="flex items-center gap-4 text-[12px] text-white/30">
          <span class="hidden sm:flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
            System online
          </span>
          <LanguageSwitcher />
        </div>
      </header>

      <main class="flex-1 overflow-y-auto">
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
    activeClass: 'bg-blue-500/15 text-blue-400',
    icon: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"/></svg>`,
  },
  {
    to: '/admin/users',
    label: t('admin.menu.users'),
    activeClass: 'bg-violet-500/15 text-violet-400',
    icon: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"/></svg>`,
  },
  {
    to: '/admin/plans',
    label: t('admin.menu.plans'),
    activeClass: 'bg-cyan-500/15 text-cyan-400',
    icon: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9h16.5m-16.5 6h16.5M8.25 4.5h7.5a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5h-7.5a1.5 1.5 0 0 1-1.5-1.5V6a1.5 1.5 0 0 1 1.5-1.5Z"/></svg>`,
  },
  {
    to: '/admin/payments',
    label: t('admin.menu.payments'),
    activeClass: 'bg-amber-500/15 text-amber-400',
    icon: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"/></svg>`,
  },
  {
    to: '/admin/images',
    label: t('admin.menu.images'),
    activeClass: 'bg-emerald-500/15 text-emerald-400',
    icon: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"/></svg>`,
  },
  {
    to: '/admin/audit',
    label: t('admin.menu.audit'),
    activeClass: 'bg-sky-500/15 text-sky-400',
    icon: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3-12H7.5a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 7.5 21h9a2.25 2.25 0 0 0 2.25-2.25V9L15 3Z"/></svg>`,
  },
])

const pageTitle = computed(() => {
  if (route.path === '/admin') return t('admin.title')
  if (route.path === '/admin/users') return t('admin.menu.users')
  if (route.path.startsWith('/admin/users/')) return 'User Detail'
  if (route.path === '/admin/plans') return t('admin.menu.plans')
  if (route.path.startsWith('/admin/plans/')) return 'Plan Detail'
  if (route.path === '/admin/payments') return t('admin.menu.payments')
  if (route.path === '/admin/images') return t('admin.menu.images')
  if (route.path === '/admin/audit') return t('admin.menu.audit')
  return 'Admin'
})

</script>
