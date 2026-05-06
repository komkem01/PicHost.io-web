<template>
  <div class="p-8 w-full">
    <div class="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 class="text-[24px] font-bold tracking-tight text-white">Plan Management</h2>
        <p class="text-[12.5px] text-white/30 mt-1">Manage all plan conditions, limits, pricing, and feature rules</p>
      </div>
      <div v-if="!loading && !error" class="flex items-center gap-2">
        <button
          @click="showCreateModal = true"
          class="px-3 py-1.5 rounded-xl border border-cyan-500/35 bg-cyan-500/[0.10] text-[12px] font-semibold text-cyan-200 hover:bg-cyan-500/[0.16] transition-colors"
        >
          Add Plan
        </button>
        <span class="tabular-nums text-[12.5px] font-semibold text-white/40 bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 py-1.5">
          {{ planRows.length.toLocaleString() }} plans
        </span>
        <button
          @click="resetPlanSettings"
          class="px-3 py-1.5 rounded-xl border border-white/[0.08] text-[12px] text-white/55 hover:text-white hover:border-white/[0.15] transition-colors"
        >
          Reset Defaults
        </button>
      </div>
    </div>

    <template v-if="loading">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <div v-for="i in 3" :key="i" class="h-[110px] rounded-2xl border border-white/[0.06] bg-white/[0.025] animate-pulse" />
      </div>
      <div class="h-[300px] rounded-2xl border border-white/[0.06] bg-white/[0.025] animate-pulse" />
    </template>

    <div v-else-if="error" class="rounded-2xl border border-red-500/20 bg-red-500/[0.05] p-5 text-[13px] text-red-400">
      {{ error }}
    </div>

    <template v-else>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <div class="rounded-2xl border border-white/[0.06] bg-white/[0.025] px-4 py-4">
          <p class="text-[10.5px] uppercase tracking-widest text-white/25 mb-1">Total Users</p>
          <p class="text-[28px] font-bold tabular-nums text-white leading-none">{{ totalUsers.toLocaleString() }}</p>
        </div>
        <div class="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-4">
          <p class="text-[10.5px] uppercase tracking-widest text-emerald-300/70 mb-1">Overall Active Rate</p>
          <p class="text-[28px] font-bold tabular-nums text-emerald-300 leading-none">{{ activeRate }}%</p>
        </div>
        <div class="rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.06] px-4 py-4">
          <p class="text-[10.5px] uppercase tracking-widest text-cyan-300/70 mb-1">Total Storage</p>
          <p class="text-[28px] font-bold tabular-nums text-cyan-300 leading-none">{{ formatBytes(totalStorage) }}</p>
        </div>
      </div>

      <div class="rounded-2xl border border-white/[0.06] bg-white/[0.025] overflow-hidden">
        <div class="px-5 py-4 border-b border-white/[0.05] flex items-center justify-between">
          <p class="text-[13px] font-semibold text-white/80">Plan Overview</p>
          <p class="text-[11.5px] text-white/30">Click a row to manage plan conditions</p>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full min-w-[1080px] text-[13px]">
            <thead class="bg-white/[0.015]">
              <tr class="border-b border-white/[0.05]">
                <th class="text-left px-5 py-3.5 text-[11px] font-semibold text-white/25 uppercase tracking-widest">Plan</th>
                <th class="text-left px-4 py-3.5 text-[11px] font-semibold text-white/25 uppercase tracking-widest">Price / mo</th>
                <th class="text-left px-4 py-3.5 text-[11px] font-semibold text-white/25 uppercase tracking-widest">Storage Limit</th>
                <th class="text-left px-4 py-3.5 text-[11px] font-semibold text-white/25 uppercase tracking-widest">Image Limit</th>
                <th class="text-left px-4 py-3.5 text-[11px] font-semibold text-white/25 uppercase tracking-widest">Status</th>
                <th class="text-left px-4 py-3.5 text-[11px] font-semibold text-white/25 uppercase tracking-widest">Users</th>
                <th class="text-left px-4 py-3.5 text-[11px] font-semibold text-white/25 uppercase tracking-widest">Active</th>
                <th class="text-left px-4 py-3.5 text-[11px] font-semibold text-white/25 uppercase tracking-widest">Guests</th>
                <th class="text-left px-4 py-3.5 text-[11px] font-semibold text-white/25 uppercase tracking-widest">Storage</th>
                <th class="text-left px-4 py-3.5 text-[11px] font-semibold text-white/25 uppercase tracking-widest">Share</th>
                <th class="px-4 py-3.5 w-10" />
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in planRows"
                :key="row.key"
                class="group border-b border-white/[0.04] last:border-0 hover:bg-white/[0.03] transition-colors cursor-pointer"
                @click="goPlan(row.key)"
              >
                <td class="px-5 py-3.5">
                  <span class="inline-flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full" :class="row.dotClass" />
                    <span class="font-semibold text-white/85">{{ row.name }}</span>
                  </span>
                </td>
                <td class="px-4 py-3.5 tabular-nums text-cyan-300">{{ formatPrice(row.price) }}</td>
                <td class="px-4 py-3.5 tabular-nums text-white/70">{{ formatBytes(row.storageLimitBytes) }}</td>
                <td class="px-4 py-3.5 tabular-nums text-white/65">{{ row.imageLimit.toLocaleString() }}</td>
                <td class="px-4 py-3.5">
                  <div class="flex items-center gap-2">
                    <button
                      @click.stop="togglePlan(row.key, row.isEnabled)"
                      class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                      :class="row.isEnabled ? 'bg-emerald-600' : 'bg-red-600/70'"
                      :disabled="!!savingPlanKeys[row.key]"
                      :aria-disabled="!!savingPlanKeys[row.key]"
                      :aria-busy="!!savingPlanKeys[row.key]"
                      :aria-label="row.isEnabled ? 'Close plan' : 'Open plan'"
                    >
                      <span class="inline-block h-4 w-4 rounded-full bg-white shadow transition-transform" :class="row.isEnabled ? 'translate-x-6' : 'translate-x-1'" />
                    </button>
                    <span class="text-[11px] font-semibold" :class="row.isEnabled ? 'text-emerald-300' : 'text-red-300'">
                      {{ row.isEnabled ? 'Open' : 'Closed' }}
                    </span>
                  </div>
                </td>
                <td class="px-4 py-3.5 tabular-nums text-white/75">{{ row.users.toLocaleString() }}</td>
                <td class="px-4 py-3.5 tabular-nums text-emerald-300">{{ row.active.toLocaleString() }}</td>
                <td class="px-4 py-3.5 tabular-nums text-amber-300">{{ row.guests.toLocaleString() }}</td>
                <td class="px-4 py-3.5 tabular-nums text-cyan-300">{{ formatBytes(row.storage) }}</td>
                <td class="px-4 py-3.5">
                  <div class="w-[140px]">
                    <div class="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                      <div class="h-full rounded-full" :class="row.barClass" :style="{ width: row.share + '%' }" />
                    </div>
                    <p class="text-[11px] text-white/30 mt-1 tabular-nums">{{ row.share }}%</p>
                  </div>
                </td>
                <td class="px-4 py-3.5">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      @click.stop="deletePlan(row.key)"
                      :disabled="!!savingPlanKeys[row.key]"
                      class="h-7 w-7 rounded-lg border border-red-500/20 text-red-300/70 hover:text-red-200 hover:bg-red-500/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center"
                      title="Delete plan"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                      </svg>
                    </button>
                    <svg class="w-3.5 h-3.5 text-white/15 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <Teleport to="body">
        <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/65" @click="showCreateModal = false" />
          <div class="relative w-full max-w-[420px] rounded-2xl border border-white/[0.08] bg-[#111113] p-5">
            <h3 class="text-[16px] font-semibold text-white mb-3">Create Plan</h3>
            <div class="space-y-3">
              <div>
                <label class="block text-[11px] text-white/35 mb-1.5">Plan Key</label>
                <input v-model="createForm.key" type="text" placeholder="example: starter" class="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2.5 text-[13px] text-white outline-none focus:border-cyan-500/45" />
              </div>
              <div>
                <label class="block text-[11px] text-white/35 mb-1.5">Display Name</label>
                <input v-model="createForm.name" type="text" placeholder="Starter" class="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2.5 text-[13px] text-white outline-none focus:border-cyan-500/45" />
              </div>
            </div>
            <div class="mt-4 flex items-center justify-end gap-2">
              <button @click="showCreateModal = false" class="px-3 py-1.5 rounded-lg border border-white/[0.08] text-[12px] text-white/55 hover:text-white transition-colors">Cancel</button>
              <button @click="createPlan" :disabled="creating" class="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-[12px] text-white font-semibold transition-colors">
                {{ creating ? 'Creating...' : 'Create' }}
              </button>
            </div>
          </div>
        </div>
      </Teleport>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { AdminUser } from '~/composables/useAdmin'

const router = useRouter()
const { listUsers } = useAdmin()
const { list: listPlanSettings, get, load, upsert, resetAll, remove } = usePlanSettings()
const toast = useToast()

const users = ref<AdminUser[]>([])
const loading = ref(true)
const error = ref('')
const savingPlanKeys = ref<Record<string, boolean>>({})
const showCreateModal = ref(false)
const creating = ref(false)
const createForm = reactive({
  key: '',
  name: '',
})

onMounted(async () => {
  try {
    const [userRows] = await Promise.all([
      listUsers(),
      load(),
    ])
    users.value = userRows
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Failed to load plans'
  } finally {
    loading.value = false
  }
})

function normalizePlan(plan: string | null | undefined) {
  const key = (plan ?? 'Unknown').trim().toLowerCase()
  return key || 'unknown'
}

function prettyPlan(key: string) {
  if (key === 'free') return 'Free'
  if (key === 'basic') return 'Basic'
  if (key === 'pro') return 'Pro'
  if (key === 'enterprise') return 'Enterprise'
  return key.charAt(0).toUpperCase() + key.slice(1)
}

function planStyles(key: string) {
  if (key === 'free') return { dotClass: 'bg-white/40', barClass: 'bg-white/25' }
  if (key === 'basic') return { dotClass: 'bg-blue-400', barClass: 'bg-blue-500' }
  if (key === 'pro') return { dotClass: 'bg-violet-400', barClass: 'bg-violet-500' }
  if (key === 'enterprise') return { dotClass: 'bg-cyan-400', barClass: 'bg-cyan-500' }
  return { dotClass: 'bg-amber-400', barClass: 'bg-amber-500' }
}

const totalUsers = computed(() => users.value.length)

const totalStorage = computed(() => users.value.reduce((acc, u) => acc + (u.used_storage_bytes ?? 0), 0))

const activeRate = computed(() => {
  if (!users.value.length) return 0
  const active = users.value.filter((u) => u.is_active && !u.is_guest).length
  return Math.round((active / users.value.length) * 100)
})

const planRows = computed(() => {
  const grouped: Record<string, AdminUser[]> = {}
  for (const user of users.value) {
    const key = normalizePlan(user.plan)
    grouped[key] = grouped[key] ?? []
    grouped[key].push(user)
  }

  const settingsRows = listPlanSettings()
  const settingsByKey = Object.fromEntries(settingsRows.map((item) => [item.key, item]))
  const orderedKeys = settingsRows.map((item) => item.key)

  return orderedKeys
    .map((key) => {
      const list = grouped[key] ?? []
      const setting = settingsByKey[key] ?? get(key)
      const usersCount = list.length
      const active = list.filter((u) => u.is_active && !u.is_guest).length
      const guests = list.filter((u) => u.is_guest).length
      const storage = list.reduce((acc, u) => acc + (u.used_storage_bytes ?? 0), 0)
      const share = totalUsers.value ? Math.round((usersCount / totalUsers.value) * 100) : 0
      return {
        key,
        name: setting?.name ?? prettyPlan(key),
        price: setting?.monthlyPrice ?? 0,
        storageLimitBytes: setting?.storageLimitBytes ?? 0,
        imageLimit: setting?.imageLimit ?? 0,
        isEnabled: setting?.isEnabled ?? true,
        users: usersCount,
        active,
        guests,
        storage,
        share,
        ...planStyles(key),
      }
    })
    .sort((a, b) => {
      if (a.price !== b.price) return a.price - b.price
      return a.name.localeCompare(b.name)
    })
})

function formatBytes(bytes: number) {
  if (!bytes) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`
}

function formatPrice(price: number) {
  if (!price) return 'Free'
  return `${price.toLocaleString()} THB`
}

async function resetPlanSettings() {
  await resetAll()
  toast.success('Plan conditions reset to defaults')
}

async function togglePlan(planKey: string, current: boolean) {
  if (savingPlanKeys.value[planKey]) return
  savingPlanKeys.value = {
    ...savingPlanKeys.value,
    [planKey]: true,
  }
  try {
    await upsert(planKey, { isEnabled: !current })
    toast.success(!current ? 'Plan opened' : 'Plan closed')
  } catch (e: any) {
    toast.error(e?.data?.message ?? 'Failed to update plan status')
  } finally {
    savingPlanKeys.value = {
      ...savingPlanKeys.value,
      [planKey]: false,
    }
  }
}

function normalizePlanKey(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, '-')
}

async function createPlan() {
  if (creating.value) return

  const key = normalizePlanKey(createForm.key)
  const name = createForm.name.trim()

  if (!/^[a-z0-9-]+$/.test(key)) {
    toast.error('Plan key must use only a-z, 0-9, and hyphen (-)')
    return
  }
  if (!name) {
    toast.error('Display name is required')
    return
  }

  creating.value = true
  try {
    await upsert(key, {
      name,
      isEnabled: true,
    })
    createForm.key = ''
    createForm.name = ''
    showCreateModal.value = false
    toast.success('Plan created')
  } catch (e: any) {
    toast.error(e?.data?.message ?? 'Failed to create plan')
  } finally {
    creating.value = false
  }
}

async function deletePlan(planKey: string) {
  if (savingPlanKeys.value[planKey]) return
  const confirmed = window.confirm(`Delete plan "${planKey}"? This action cannot be undone.`)
  if (!confirmed) return

  savingPlanKeys.value = {
    ...savingPlanKeys.value,
    [planKey]: true,
  }
  try {
    await remove(planKey)
    toast.success('Plan deleted')
  } catch (e: any) {
    toast.error(e?.data?.message ?? 'Failed to delete plan')
  } finally {
    savingPlanKeys.value = {
      ...savingPlanKeys.value,
      [planKey]: false,
    }
  }
}

function goPlan(planKey: string) {
  router.push(`/admin/plans/${encodeURIComponent(planKey)}`)
}
</script>
