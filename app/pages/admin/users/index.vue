<template>
  <div class="p-8 w-full">

    <div class="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 class="text-[24px] font-bold tracking-tight text-white">Users Directory</h2>
        <p class="text-[12.5px] text-white/30 mt-1">Manage accounts, plans, and access</p>
      </div>
      <div v-if="!loading && !error" class="flex items-center gap-2 text-[12.5px]">
        <span class="tabular-nums font-semibold text-white/45 bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 py-1.5">
          {{ filtered.length.toLocaleString() }} visible
        </span>
        <span class="tabular-nums font-semibold text-white/35 bg-white/[0.025] border border-white/[0.05] rounded-xl px-3 py-1.5">
          {{ users.length.toLocaleString() }} total
        </span>
      </div>
    </div>

    <div v-if="!loading && !error" class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
      <div class="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-3.5">
        <p class="text-[10.5px] uppercase tracking-widest text-emerald-300/70 mb-1">Active</p>
        <p class="text-[24px] leading-none font-bold tabular-nums text-emerald-300">{{ activeCount.toLocaleString() }}</p>
      </div>
      <div class="rounded-2xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3.5">
        <p class="text-[10.5px] uppercase tracking-widest text-red-300/70 mb-1">Inactive</p>
        <p class="text-[24px] leading-none font-bold tabular-nums text-red-300">{{ inactiveCount.toLocaleString() }}</p>
      </div>
      <div class="rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3.5">
        <p class="text-[10.5px] uppercase tracking-widest text-amber-300/70 mb-1">Guests</p>
        <p class="text-[24px] leading-none font-bold tabular-nums text-amber-300">{{ guestCount.toLocaleString() }}</p>
      </div>
    </div>

    <div class="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-3.5 mb-4">
      <div class="flex items-center gap-2.5 flex-wrap">
        <div class="relative flex-1 min-w-[220px]">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0Z"/>
          </svg>
          <input
            v-model="search"
            type="search"
            placeholder="Search email or username..."
            class="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl pl-9 pr-4 py-2.5 text-[13px] text-white placeholder:text-white/20 outline-none focus:border-violet-500/50 focus:bg-white/[0.05] transition-colors"
          />
        </div>
        <select
          v-model="filterPlan"
          class="bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2.5 text-[13px] text-white/70 outline-none focus:border-violet-500/50 transition-colors cursor-pointer"
        >
          <option value="">All plans</option>
          <option v-for="p in plans" :key="p" :value="p">{{ p }}</option>
        </select>
        <select
          v-model="filterStatus"
          class="bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2.5 text-[13px] text-white/70 outline-none focus:border-violet-500/50 transition-colors cursor-pointer"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="guest">Guest</option>
        </select>
        <button
          @click="clearFilters"
          class="px-3.5 py-2.5 rounded-xl border border-white/[0.08] text-[12.5px] text-white/55 hover:text-white hover:border-white/[0.16] transition-colors"
        >
          Clear
        </button>
      </div>
    </div>

    <div class="rounded-2xl border border-white/[0.06] bg-white/[0.025] overflow-hidden">

      <!-- Loading skeleton -->
      <template v-if="loading">
        <div class="border-b border-white/[0.05] px-5 py-3 grid grid-cols-[2fr_1fr_1fr_1fr_1fr_40px] gap-4">
          <div v-for="i in 6" :key="i" class="h-3.5 rounded-full bg-white/[0.05] animate-pulse" />
        </div>
        <div
          v-for="i in 8"
          :key="i"
          class="border-b border-white/[0.04] last:border-0 px-5 py-4 grid grid-cols-[2fr_1fr_1fr_1fr_1fr_40px] gap-4 items-center"
        >
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-xl bg-white/[0.05] animate-pulse shrink-0" />
            <div class="space-y-1.5 flex-1">
              <div class="h-3 rounded-full bg-white/[0.05] animate-pulse w-3/4" />
              <div class="h-2.5 rounded-full bg-white/[0.04] animate-pulse w-1/2" />
            </div>
          </div>
          <div v-for="j in 5" :key="j" class="h-3 rounded-full bg-white/[0.04] animate-pulse" />
        </div>
      </template>

      <!-- Error -->
      <div v-else-if="error" class="p-8 text-center text-red-400/80 text-[13px]">{{ error }}</div>

      <!-- Empty -->
      <div v-else-if="filtered.length === 0" class="p-12 text-center">
        <p class="text-[13px] text-white/25">No users match your filters</p>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
      <table class="w-full text-[13px] min-w-[900px]">
        <thead class="bg-white/[0.015]">
          <tr class="border-b border-white/[0.05]">
            <th class="text-left px-5 py-3.5 text-[11px] font-semibold text-white/25 uppercase tracking-widest">User</th>
            <th class="text-left px-4 py-3.5 text-[11px] font-semibold text-white/25 uppercase tracking-widest">Plan</th>
            <th class="text-left px-4 py-3.5 text-[11px] font-semibold text-white/25 uppercase tracking-widest">Storage</th>
            <th class="text-left px-4 py-3.5 text-[11px] font-semibold text-white/25 uppercase tracking-widest">Status</th>
            <th class="text-left px-4 py-3.5 text-[11px] font-semibold text-white/25 uppercase tracking-widest">Joined</th>
            <th class="px-4 py-3 w-10" />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="u in paginated"
            :key="u.id"
            class="group border-b border-white/[0.04] last:border-0 hover:bg-white/[0.03] transition-colors cursor-pointer"
            @click="$router.push(`/admin/users/${u.id}`)"
          >
            <!-- User -->
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-3">
                <div
                  class="w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-bold shrink-0"
                  :class="u.is_guest ? 'bg-amber-500/10 text-amber-400' : 'bg-violet-500/10 text-violet-300'"
                >
                  {{ avatarInitials(u) }}
                </div>
                <div class="min-w-0">
                  <div class="flex items-center gap-2">
                    <p class="text-white/85 font-medium truncate max-w-[220px]">{{ u.username ?? u.email ?? 'Guest' }}</p>
                    <span v-if="u.is_admin" class="shrink-0 text-[10px] font-semibold text-red-400 border border-red-400/25 rounded px-1.5 py-px">admin</span>
                  </div>
                  <p v-if="u.username && u.email" class="text-white/30 text-[11.5px] truncate max-w-[240px] mt-0.5">{{ u.email }}</p>
                </div>
              </div>
            </td>
            <!-- Plan -->
            <td class="px-4 py-3.5">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11.5px] font-semibold" :class="planClass(u.plan)">
                {{ u.plan }}
              </span>
            </td>
            <!-- Storage -->
            <td class="px-4 py-3.5 text-white/40 tabular-nums text-[12.5px]">{{ formatBytes(u.used_storage_bytes) }}</td>
            <!-- Status -->
            <td class="px-4 py-3.5">
              <span v-if="u.is_guest" class="inline-flex items-center gap-1.5 text-[12px] text-amber-400/70">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-400/60" />Guest
              </span>
              <span v-else-if="u.is_active" class="inline-flex items-center gap-1.5 text-[12px] text-emerald-400/80">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400/70" />Active
              </span>
              <span v-else class="inline-flex items-center gap-1.5 text-[12px] text-red-400/60">
                <span class="w-1.5 h-1.5 rounded-full bg-red-400/50" />Inactive
              </span>
            </td>
            <!-- Joined -->
            <td class="px-4 py-3.5 text-white/30 text-[12px] tabular-nums">{{ formatDate(u.created_at) }}</td>
            <!-- Arrow -->
            <td class="px-4 py-3.5">
              <svg
                class="w-3.5 h-3.5 text-white/15 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all"
                fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </td>
          </tr>
        </tbody>
      </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-between gap-2 flex-wrap px-5 py-3.5 border-t border-white/[0.05]">
        <p class="text-[12px] text-white/25 tabular-nums">
          {{ (currentPage - 1) * pageSize + 1 }}–{{ Math.min(currentPage * pageSize, filtered.length) }}
          <span class="text-white/15">of</span> {{ filtered.length.toLocaleString() }}
        </p>
        <div class="flex items-center gap-1">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="w-8 h-8 flex items-center justify-center rounded-lg border border-white/[0.06] text-white/40 hover:text-white hover:border-white/[0.15] disabled:opacity-25 disabled:cursor-not-allowed transition-all"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/>
            </svg>
          </button>

          <template v-for="p in pageRange" :key="p">
            <span v-if="p === '...'" class="w-8 h-8 flex items-center justify-center text-[12px] text-white/20">…</span>
            <button
              v-else
              @click="currentPage = (p as number)"
              class="w-8 h-8 flex items-center justify-center rounded-lg text-[12.5px] transition-all"
              :class="currentPage === p
                ? 'bg-violet-600 text-white font-semibold'
                : 'border border-white/[0.06] text-white/40 hover:text-white hover:border-white/[0.15]'"
            >{{ p }}</button>
          </template>

          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="w-8 h-8 flex items-center justify-center rounded-lg border border-white/[0.06] text-white/40 hover:text-white hover:border-white/[0.15] disabled:opacity-25 disabled:cursor-not-allowed transition-all"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

import type { AdminUser } from '~/composables/useAdmin'

const { listUsers, getStats } = useAdmin()

const users = ref<AdminUser[]>([])
const guestCountValue = ref(0)
const loading = ref(true)
const error = ref('')
const search = ref('')
const filterPlan = ref('')
const filterStatus = ref('')

const plans = ['Free', 'Basic', 'Pro']

onMounted(async () => {
  try {
    const [usersRes, statsRes] = await Promise.all([listUsers(), getStats()])
    users.value = usersRes
    guestCountValue.value = statsRes.guest_users
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Failed to load users'
  } finally {
    loading.value = false
  }
})

const currentPage = ref(1)
const pageSize = 8

watch([search, filterPlan, filterStatus], () => { currentPage.value = 1 })

const filtered = computed(() => {
  let list = users.value
  const q = search.value.toLowerCase()
  if (q) {
    list = list.filter(u =>
      u.email?.toLowerCase().includes(q) || u.username?.toLowerCase().includes(q)
    )
  }
  if (filterPlan.value) list = list.filter(u => u.plan === filterPlan.value)
  if (filterStatus.value === 'active') list = list.filter(u => u.is_active && !u.is_guest)
  else if (filterStatus.value === 'inactive') list = list.filter(u => !u.is_active && !u.is_guest)
  else if (filterStatus.value === 'guest') list = list.filter(u => u.is_guest)
  return list
})

const totalPages = computed(() => Math.ceil(filtered.value.length / pageSize))

const paginated = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filtered.value.slice(start, start + pageSize)
})

const activeCount = computed(() => users.value.filter((u) => u.is_active && !u.is_guest).length)
const guestCount = computed(() => guestCountValue.value)
const inactiveCount = computed(() => users.value.filter((u) => !u.is_active && !u.is_guest).length)

const pageRange = computed(() => {
  const total = totalPages.value
  const cur = currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | string)[] = [1]
  if (cur > 3) pages.push('...')
  for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) pages.push(i)
  if (cur < total - 2) pages.push('...')
  pages.push(total)
  return pages
})

function clearFilters() {
  search.value = ''
  filterPlan.value = ''
  filterStatus.value = ''
}

function planClass(plan: string) {
  return {
    Free:  'bg-white/[0.07] text-white/50',
    Basic: 'bg-blue-500/15 text-blue-300',
    Pro:   'bg-violet-500/15 text-violet-300',
  }[plan] ?? 'bg-white/[0.06] text-white/50'
}

function avatarInitials(u: AdminUser) {
  const name = u.username ?? u.email
  if (!name) return '?'
  return name.slice(0, 2).toUpperCase()
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>
