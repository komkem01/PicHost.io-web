<template>
  <div class="p-8 w-full">

    <div class="mb-7 flex items-start justify-between gap-4">
      <div>
        <h2 class="text-[24px] font-bold tracking-tight text-white">Control Center</h2>
        <p class="text-[12.5px] text-white/30 mt-1">{{ todayStr }}</p>
      </div>
      <span class="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border border-emerald-500/25 bg-emerald-500/[0.08] text-[10.5px] font-semibold text-emerald-300 uppercase tracking-widest">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
        Live
      </span>
    </div>

    <template v-if="loading">
      <div class="grid grid-cols-12 gap-3 mb-3">
        <div class="col-span-8 h-[228px] rounded-2xl bg-white/[0.03] border border-white/[0.05] animate-pulse" />
        <div class="col-span-4 h-[228px] rounded-2xl bg-white/[0.03] border border-white/[0.05] animate-pulse" />
      </div>
      <div class="grid grid-cols-12 gap-3">
        <div class="col-span-7 h-[260px] rounded-2xl bg-white/[0.03] border border-white/[0.05] animate-pulse" />
        <div class="col-span-5 h-[260px] rounded-2xl bg-white/[0.03] border border-white/[0.05] animate-pulse" />
      </div>
    </template>

    <div v-else-if="error" class="rounded-2xl border border-red-500/20 bg-red-500/[0.05] p-5 text-[13px] text-red-400">
      {{ error }}
    </div>

    <template v-else-if="stats">
      <div class="grid grid-cols-12 gap-3 mb-3">
        <section class="col-span-8 relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.025] p-6">
          <div class="absolute -top-20 -right-8 w-56 h-56 rounded-full bg-blue-500/10 blur-3xl" />
          <div class="absolute -bottom-20 -left-10 w-52 h-52 rounded-full bg-violet-500/10 blur-3xl" />

          <div class="relative flex items-start justify-between gap-6 mb-6">
            <div>
              <p class="text-[11px] font-semibold text-white/30 uppercase tracking-widest mb-2">Total Users</p>
              <p class="text-[44px] leading-none font-bold tabular-nums text-white">{{ stats.total_users.toLocaleString() }}</p>
            </div>
            <div class="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-right">
              <p class="text-[10.5px] uppercase tracking-widest text-white/25 mb-1">Top Plan</p>
              <p class="text-[16px] font-semibold text-violet-300">{{ topPlan.plan }}</p>
              <p class="text-[12px] text-white/35 tabular-nums">{{ topPlan.count.toLocaleString() }} users</p>
            </div>
          </div>

          <div class="relative grid grid-cols-3 gap-3">
            <div class="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.07] px-4 py-3">
              <p class="text-[10.5px] uppercase tracking-widest text-emerald-300/70 mb-1">Registered</p>
              <p class="text-[20px] font-bold tabular-nums text-emerald-300">{{ registeredCount.toLocaleString() }}</p>
            </div>
            <div class="rounded-xl border border-violet-500/20 bg-violet-500/[0.07] px-4 py-3">
              <p class="text-[10.5px] uppercase tracking-widest text-violet-300/70 mb-1">Active Rate</p>
              <p class="text-[20px] font-bold tabular-nums text-violet-300">{{ activeRate }}%</p>
            </div>
            <div class="rounded-xl border border-amber-500/20 bg-amber-500/[0.07] px-4 py-3">
              <p class="text-[10.5px] uppercase tracking-widest text-amber-300/70 mb-1">Guest Rate</p>
              <p class="text-[20px] font-bold tabular-nums text-amber-300">{{ guestRate }}%</p>
            </div>
          </div>
        </section>

        <section class="col-span-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5 flex flex-col">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-[13px] font-semibold text-white/80">Quick Breakdown</h3>
            <span class="text-[11px] text-white/25 uppercase tracking-widest">Now</span>
          </div>
          <div class="space-y-3.5 flex-1">
            <div
              v-for="row in breakdownRows"
              :key="row.label"
              class="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-3 flex items-center justify-between"
            >
              <div class="flex items-center gap-2.5">
                <span class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" :class="row.iconBg" v-html="row.icon" />
                <span class="text-[12.5px] text-white/55">{{ row.label }}</span>
              </div>
              <span class="text-[15px] font-bold tabular-nums" :class="row.color">{{ row.value.toLocaleString() }}</span>
            </div>
          </div>
          <NuxtLink
            to="/admin/users"
            class="group mt-4 rounded-xl border border-violet-500/25 bg-violet-500/[0.07] hover:bg-violet-500/[0.11] px-4 py-3.5 flex items-center gap-3 transition-colors"
          >
            <span class="w-9 h-9 rounded-lg bg-violet-500/15 flex items-center justify-center shrink-0">
              <svg class="w-4 h-4 text-violet-300" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"/>
              </svg>
            </span>
            <div class="flex-1 min-w-0">
              <p class="text-[13px] font-semibold text-white/85">Manage Users</p>
              <p class="text-[11.5px] text-white/35">Edit profile, plan and access</p>
            </div>
            <svg class="w-4 h-4 text-violet-300/70 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </NuxtLink>
        </section>
      </div>

      <div class="grid grid-cols-12 gap-3">
        <section class="col-span-7 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-[13px] font-semibold text-white/80">Plan Distribution</h3>
            <span class="text-[11.5px] text-white/25 tabular-nums">{{ stats.total_users.toLocaleString() }} users</span>
          </div>

          <div class="space-y-4">
            <div
              v-for="item in planRows"
              :key="item.plan"
              class="rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2.5">
                  <span class="w-2 h-2 rounded-full shrink-0" :class="item.dot" />
                  <span class="text-[13px] font-medium text-white/75">{{ item.plan }}</span>
                </div>
                <div class="flex items-center gap-3 tabular-nums text-[12.5px]">
                  <span class="text-white/30">{{ item.count.toLocaleString() }}</span>
                  <span class="w-[40px] text-right font-semibold" :class="item.pctColor">{{ item.pct }}%</span>
                </div>
              </div>
              <div class="h-2 rounded-full bg-white/[0.05] overflow-hidden">
                <div class="h-full rounded-full transition-all duration-700" :class="item.bar" :style="{ width: item.pct + '%' }" />
              </div>
            </div>
          </div>
        </section>

        <section class="col-span-5 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-6 flex flex-col">
          <h3 class="text-[13px] font-semibold text-white/80 mb-5">Snapshot</h3>

          <div class="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 mb-4">
            <p class="text-[10.5px] text-white/25 uppercase tracking-widest mb-2">User Composition</p>
            <div class="h-2 rounded-full bg-white/[0.05] overflow-hidden flex gap-0.5 mb-2.5">
              <div v-for="item in planRows" :key="item.plan + '-seg'" class="h-full rounded-full" :class="item.bar" :style="{ width: item.pct + '%' }" />
            </div>
            <div class="grid grid-cols-2 gap-2 text-[12px]">
              <div class="text-white/50">Registered: <span class="text-emerald-300 tabular-nums">{{ registeredPct }}%</span></div>
              <div class="text-white/50">Guest: <span class="text-amber-300 tabular-nums">{{ guestRate }}%</span></div>
            </div>
          </div>

          <div class="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 mb-4">
            <p class="text-[10.5px] text-white/25 uppercase tracking-widest mb-2.5">Guest Upload Activity (24h Cache)</p>
            <div class="grid grid-cols-2 gap-4 text-[12px]">
              <div>
                <p class="text-white/30 uppercase text-[9px] tracking-wider mb-1">Active Guest Images</p>
                <p class="text-[18px] font-bold text-amber-300 tabular-nums">{{ stats.guest_images.toLocaleString() }}</p>
              </div>
              <div>
                <p class="text-white/30 uppercase text-[9px] tracking-wider mb-1">Guest Storage Used</p>
                <p class="text-[18px] font-bold text-amber-300 tabular-nums">{{ formatSize(stats.guest_storage_bytes) }}</p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2.5 mt-auto">
            <div v-for="card in statCards" :key="card.label" class="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-3.5">
              <p class="text-[10.5px] text-white/30 uppercase tracking-widest mb-1.5">{{ card.label }}</p>
              <p class="text-[20px] font-bold tabular-nums leading-none" :class="card.valueColor">{{ card.value.toLocaleString() }}</p>
            </div>
          </div>
        </section>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const { getStats } = useAdmin()

const stats = ref<Awaited<ReturnType<typeof getStats>> | null>(null)
const loading = ref(true)
const error = ref('')

const knownPlans = ['free', 'basic', 'pro', 'enterprise']

const todayStr = new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

onMounted(async () => {
  try {
    stats.value = await getStats()
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Failed to load stats'
  } finally {
    loading.value = false
  }
})

const statCards = computed(() => {
  if (!stats.value) return []
  const registered = stats.value.total_users - stats.value.guest_users
  return [
    {
      label: 'Total',
      value: stats.value.total_users,
      glow: 'bg-blue-500',
      iconBg: 'bg-blue-500/10',
      valueColor: 'text-white',
      icon: `<svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"/></svg>`,
    },
    {
      label: 'Registered',
      value: registered,
      glow: 'bg-emerald-500',
      iconBg: 'bg-emerald-500/10',
      valueColor: 'text-emerald-300',
      icon: `<svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/></svg>`,
    },
    {
      label: 'Active',
      value: stats.value.active_users,
      glow: 'bg-violet-500',
      iconBg: 'bg-violet-500/10',
      valueColor: 'text-violet-300',
      icon: `<svg class="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>`,
    },
    {
      label: 'Guests',
      value: stats.value.guest_users,
      glow: 'bg-amber-500',
      iconBg: 'bg-amber-500/10',
      valueColor: 'text-amber-300',
      icon: `<svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"/></svg>`,
    },
  ]
})

const planMeta: Record<string, { dot: string; bar: string; pctColor: string }> = {
  free:       { dot: 'bg-white/35',   bar: 'bg-white/25',    pctColor: 'text-white/45' },
  basic:      { dot: 'bg-blue-400',   bar: 'bg-blue-500',    pctColor: 'text-blue-300' },
  pro:        { dot: 'bg-violet-400', bar: 'bg-violet-500',  pctColor: 'text-violet-300' },
  enterprise: { dot: 'bg-cyan-400',   bar: 'bg-cyan-500',    pctColor: 'text-cyan-300' },
}

function normalizePlanKey(plan: string) {
  return plan.trim().toLowerCase()
}

function prettyPlan(plan: string) {
  const key = normalizePlanKey(plan)
  if (key === 'free') return 'Free'
  if (key === 'basic') return 'Basic'
  if (key === 'pro') return 'Pro'
  if (key === 'enterprise') return 'Enterprise'
  if (!key) return 'Unknown'
  return key.charAt(0).toUpperCase() + key.slice(1)
}

const planRows = computed(() => {
  if (!stats.value) return []
  const aggregated: Record<string, number> = {}
  for (const [rawPlan, count] of Object.entries(stats.value.plan_breakdown ?? {})) {
    const key = normalizePlanKey(rawPlan)
    if (!key) continue
    aggregated[key] = (aggregated[key] ?? 0) + count
  }

  const keys = Array.from(new Set([...knownPlans, ...Object.keys(aggregated)]))
  const sum = Object.values(aggregated).reduce((acc, val) => acc + val, 0)
  const total = (sum || stats.value.total_users || 1)

  const rows = keys.map((key) => {
    const count = aggregated[key] ?? 0
    return {
      plan: prettyPlan(key),
      count,
      pct: Math.round((count / total) * 100),
      ...(planMeta[key] ?? { dot: 'bg-white/25', bar: 'bg-white/15', pctColor: 'text-white/35' }),
    }
  })

  const filtered = rows.filter((r) => r.count > 0).sort((a, b) => b.count - a.count)
  if (filtered.length) return filtered
  if (!stats.value.total_users) return []

  return [{
    plan: 'Unknown',
    count: stats.value.total_users,
    pct: 100,
    dot: 'bg-white/25',
    bar: 'bg-white/15',
    pctColor: 'text-white/35',
  }]
})

const breakdownRows = computed(() => {
  if (!stats.value) return []
  const registered = stats.value.total_users - stats.value.guest_users
  return [
    {
      label: 'Registered',
      value: registered,
      color: 'text-emerald-300',
      iconBg: 'bg-emerald-500/10',
      icon: `<svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/></svg>`,
    },
    {
      label: 'Active',
      value: stats.value.active_users,
      color: 'text-violet-300',
      iconBg: 'bg-violet-500/10',
      icon: `<svg class="w-3.5 h-3.5 text-violet-400" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>`,
    },
    {
      label: 'Guests',
      value: stats.value.guest_users,
      color: 'text-amber-300',
      iconBg: 'bg-amber-500/10',
      icon: `<svg class="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"/></svg>`,
    },
  ]
})

const registeredPct = computed(() => {
  if (!stats.value?.total_users) return 0
  const reg = stats.value.total_users - stats.value.guest_users
  return Math.round((reg / stats.value.total_users) * 100)
})

const registeredCount = computed(() => {
  if (!stats.value) return 0
  return stats.value.total_users - stats.value.guest_users
})

const activeRate = computed(() => {
  if (!stats.value?.total_users) return 0
  return Math.round((stats.value.active_users / stats.value.total_users) * 100)
})

const guestRate = computed(() => {
  if (!stats.value?.total_users) return 0
  return Math.round((stats.value.guest_users / stats.value.total_users) * 100)
})

const topPlan = computed(() => {
  if (!planRows.value.length) return { plan: '—', count: 0 }
  const first = planRows.value[0]
  return { plan: first?.plan ?? '—', count: first?.count ?? 0 }
})

function formatSize(bytes: number) {
  if (bytes <= 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>
