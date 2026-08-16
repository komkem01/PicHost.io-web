<template>
  <div class="p-8 w-full">
    <div class="mb-6 flex items-center justify-between gap-4">
      <NuxtLink
        to="/admin/plans"
        class="inline-flex items-center gap-1.5 text-[12px] text-zinc-500 hover:text-zinc-900 transition-colors font-medium"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"/>
        </svg>
        All Plans
      </NuxtLink>
      <p class="text-[11px] uppercase tracking-widest text-zinc-400 font-semibold">Plan Detail</p>
    </div>

    <template v-if="loading">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
        <div v-for="i in 4" :key="i" class="h-[96px] rounded-2xl border border-zinc-200 bg-zinc-100 animate-pulse" />
      </div>
      <div class="h-[320px] rounded-2xl border border-zinc-200 bg-zinc-100 animate-pulse" />
    </template>

    <div v-else-if="error" class="rounded-2xl border border-red-200 bg-red-50 p-5 text-[13px] text-red-700">
      {{ error }}
    </div>

    <template v-else>
      <div class="mb-5">
        <h2 class="text-[26px] font-bold tracking-tight text-zinc-900">{{ planName }}</h2>
        <p class="text-[12.5px] text-zinc-500 mt-1">Configure pricing, limits, and feature conditions for this plan</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
        <div class="rounded-2xl border border-zinc-200 bg-white shadow-card px-4 py-4">
          <p class="text-[10.5px] uppercase tracking-widest text-zinc-400 font-semibold mb-1">Users</p>
          <p class="text-[28px] leading-none font-bold tabular-nums text-zinc-900">{{ planUsers.length.toLocaleString() }}</p>
        </div>
        <div class="rounded-2xl border border-emerald-200 bg-emerald-50/60 shadow-card px-4 py-4">
          <p class="text-[10.5px] uppercase tracking-widest text-emerald-800/70 font-semibold mb-1">Active</p>
          <p class="text-[28px] leading-none font-bold tabular-nums text-emerald-700">{{ activeCount.toLocaleString() }}</p>
        </div>
        <div class="rounded-2xl border border-amber-200 bg-amber-50/60 shadow-card px-4 py-4">
          <p class="text-[10.5px] uppercase tracking-widest text-amber-800/70 font-semibold mb-1">Guests</p>
          <p class="text-[28px] leading-none font-bold tabular-nums text-amber-700">{{ guestCount.toLocaleString() }}</p>
        </div>
        <div class="rounded-2xl border border-blue-200 bg-blue-50/60 shadow-card px-4 py-4">
          <p class="text-[10.5px] uppercase tracking-widest text-blue-800/70 font-semibold mb-1">Storage</p>
          <p class="text-[28px] leading-none font-bold tabular-nums text-blue-700">{{ formatBytes(totalStorage) }}</p>
        </div>
      </div>

      <div class="rounded-2xl border border-zinc-200 bg-white shadow-card p-5 mb-3">
        <div class="flex items-center justify-between gap-3 mb-4">
          <p class="text-[13px] font-semibold text-zinc-900">Plan Conditions</p>
          <div class="flex items-center gap-2">
            <button
              @click="resetPlan"
              :disabled="saving"
              class="px-3.5 py-1.5 rounded-xl border border-zinc-200 bg-white text-[12px] text-zinc-600 hover:bg-zinc-50 transition-colors font-medium"
            >
              Reset
            </button>
            <button
              @click="savePlan"
              :disabled="saving"
              class="px-4 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-[12px] text-white font-semibold transition-colors shadow-xs"
            >
              {{ saving ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div>
            <label class="block text-[11.5px] text-zinc-700 font-medium mb-1.5">Plan Name</label>
            <input v-model="form.name" type="text" class="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-[13px] text-zinc-900 outline-none focus:border-zinc-400" />
          </div>
          <div>
            <label class="block text-[11.5px] text-zinc-700 font-medium mb-1.5">Monthly Price (THB)</label>
            <input v-model.number="form.monthlyPrice" type="number" min="0" class="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-[13px] text-zinc-900 outline-none focus:border-zinc-400" />
          </div>
          <div>
            <label class="block text-[11.5px] text-zinc-700 font-medium mb-1.5">Storage Limit (MB)</label>
            <input v-model.number="form.storageLimitMb" type="number" min="0" step="1" class="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-[13px] text-zinc-900 outline-none focus:border-zinc-400" />
          </div>
          <div>
            <label class="block text-[11.5px] text-zinc-700 font-medium mb-1.5">Image Limit</label>
            <input v-model.number="form.imageLimit" type="number" min="0" class="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-[13px] text-zinc-900 outline-none focus:border-zinc-400" />
          </div>
          <div>
            <label class="block text-[11.5px] text-zinc-700 font-medium mb-1.5">Max Upload Size (MB)</label>
            <input v-model.number="form.maxUploadMb" type="number" min="0" class="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-[13px] text-zinc-900 outline-none focus:border-zinc-400" />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
          <button
            @click="form.isEnabled = !form.isEnabled"
            :disabled="saving"
            class="rounded-xl border px-3 py-2.5 flex items-center justify-between text-left transition-colors"
            :class="form.isEnabled ? 'border-emerald-200 bg-emerald-50 text-emerald-700 font-semibold' : 'border-red-200 bg-red-50 text-red-700 font-semibold'"
          >
            <span class="text-[12px]">Plan Enabled</span>
            <span class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0" :class="form.isEnabled ? 'bg-emerald-600' : 'bg-zinc-300'">
              <span class="inline-block h-4 w-4 rounded-full bg-white shadow transition-transform" :class="form.isEnabled ? 'translate-x-6' : 'translate-x-1'" />
            </span>
          </button>
          <button @click="form.allowPrivate = !form.allowPrivate" :disabled="saving" class="rounded-xl border px-3 py-2 text-left transition-colors text-[12px]" :class="form.allowPrivate ? 'border-zinc-900 bg-zinc-900 text-white font-semibold' : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'">Allow Private</button>
          <button @click="form.customDomain = !form.customDomain" :disabled="saving" class="rounded-xl border px-3 py-2 text-left transition-colors text-[12px]" :class="form.customDomain ? 'border-zinc-900 bg-zinc-900 text-white font-semibold' : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'">Custom Domain</button>
          <button @click="form.apiAccess = !form.apiAccess" :disabled="saving" class="rounded-xl border px-3 py-2 text-left transition-colors text-[12px]" :class="form.apiAccess ? 'border-zinc-900 bg-zinc-900 text-white font-semibold' : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'">API Access</button>
          <button @click="form.prioritySupport = !form.prioritySupport" :disabled="saving" class="rounded-xl border px-3 py-2 text-left transition-colors text-[12px]" :class="form.prioritySupport ? 'border-zinc-900 bg-zinc-900 text-white font-semibold' : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'">Priority Support</button>
          <button @click="form.noAds = !form.noAds" :disabled="saving" class="rounded-xl border px-3 py-2 text-left transition-colors text-[12px]" :class="form.noAds ? 'border-zinc-900 bg-zinc-900 text-white font-semibold' : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'">No Ads</button>
          <button @click="form.watermarkRemoval = !form.watermarkRemoval" :disabled="saving" class="rounded-xl border px-3 py-2 text-left transition-colors text-[12px]" :class="form.watermarkRemoval ? 'border-zinc-900 bg-zinc-900 text-white font-semibold' : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'">Watermark Removal</button>
        </div>
      </div>

      <div class="rounded-2xl border border-zinc-200 bg-white shadow-card overflow-hidden">
        <div class="px-5 py-4 border-b border-zinc-200 flex items-center justify-between">
          <p class="text-[13px] font-semibold text-zinc-900">Users on {{ planName }}</p>
          <p class="text-[11.5px] text-zinc-500">Click to open user details</p>
        </div>

        <div v-if="planUsers.length === 0" class="p-10 text-center">
          <p class="text-[13px] text-zinc-400">No users found for this plan</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full min-w-[860px] text-[13px]">
            <thead class="bg-zinc-50">
              <tr class="border-b border-zinc-200">
                <th class="text-left px-5 py-3.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">User</th>
                <th class="text-left px-4 py-3.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">Status</th>
                <th class="text-left px-4 py-3.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">Storage</th>
                <th class="text-left px-4 py-3.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">Images</th>
                <th class="text-left px-4 py-3.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">Joined</th>
                <th class="px-4 py-3.5 w-10" />
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="u in planUsers"
                :key="u.id"
                class="group border-b border-zinc-200 last:border-0 hover:bg-zinc-50/80 transition-colors cursor-pointer"
                @click="router.push(`/admin/users/${u.id}`)"
              >
                <td class="px-5 py-3.5">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-bold shrink-0"
                      :class="u.is_guest ? 'bg-amber-50 border border-amber-200 text-amber-700' : 'bg-blue-50 border border-blue-200 text-blue-700'"
                    >
                      {{ avatarInitials(u) }}
                    </div>
                    <div class="min-w-0">
                      <p class="text-zinc-900 font-medium truncate max-w-[240px]">{{ u.username ?? u.email ?? 'Guest' }}</p>
                      <p v-if="u.username && u.email" class="text-zinc-500 text-[11.5px] truncate max-w-[260px] mt-0.5">{{ u.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3.5">
                  <span v-if="u.is_guest" class="inline-flex items-center gap-1.5 text-[12px] text-amber-700 font-medium">
                    <span class="w-1.5 h-1.5 rounded-full bg-amber-500" />Guest
                  </span>
                  <span v-else-if="u.is_active" class="inline-flex items-center gap-1.5 text-[12px] text-emerald-700 font-medium">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500" />Active
                  </span>
                  <span v-else class="inline-flex items-center gap-1.5 text-[12px] text-red-700 font-medium">
                    <span class="w-1.5 h-1.5 rounded-full bg-red-500" />Inactive
                  </span>
                </td>
                <td class="px-4 py-3.5 tabular-nums text-zinc-900 font-medium">{{ formatBytes(u.used_storage_bytes ?? 0) }}</td>
                <td class="px-4 py-3.5 tabular-nums text-zinc-600">{{ (u.image_count ?? 0).toLocaleString() }}</td>
                <td class="px-4 py-3.5 tabular-nums text-zinc-500 text-[12px]">{{ formatDate(u.created_at) }}</td>
                <td class="px-4 py-3.5 text-right whitespace-nowrap">
                  <div class="inline-flex items-center justify-end gap-1.5" @click.stop>
                    <NuxtLink
                      :to="`/admin/users/${u.id}`"
                      class="h-8 px-2.5 inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-[12px] font-medium text-zinc-700 transition-colors shadow-2xs"
                      :title="$t('common.viewDetails')"
                    >
                      <svg class="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.573 16.49 16.638 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                      <span>{{ $t('common.viewDetails') }}</span>
                    </NuxtLink>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

import type { AdminUser } from '~/composables/useAdmin'

const route = useRoute()
const router = useRouter()
const { listUsers } = useAdmin()
const { get, upsert, load } = usePlanSettings()
const toast = useToast()

const users = ref<AdminUser[]>([])
const loading = ref(true)
const error = ref('')
const saving = ref(false)

const form = reactive({
  name: '',
  monthlyPrice: 0,
  storageLimitMb: 0,
  imageLimit: 0,
  maxUploadMb: 0,
  isEnabled: true,
  allowPrivate: false,
  customDomain: false,
  apiAccess: false,
  prioritySupport: false,
  noAds: false,
  watermarkRemoval: false,
})

const planKey = computed(() => normalizePlan(decodeURIComponent(String(route.params.id ?? 'unknown'))))

onMounted(async () => {
  try {
    const [userRows] = await Promise.all([
      listUsers(),
      load(),
    ])
    users.value = userRows
    hydrateForm()
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Failed to load plan details'
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

const planName = computed(() => form.name || prettyPlan(planKey.value))

const planUsers = computed(() => users.value.filter((u) => normalizePlan(u.plan) === planKey.value))

const activeCount = computed(() => planUsers.value.filter((u) => u.is_active && !u.is_guest).length)
const guestCount = computed(() => planUsers.value.filter((u) => u.is_guest).length)
const totalStorage = computed(() => planUsers.value.reduce((acc, u) => acc + (u.used_storage_bytes ?? 0), 0))

function hydrateForm() {
  const setting = get(planKey.value)
  form.name = setting?.name ?? prettyPlan(planKey.value)
  form.monthlyPrice = setting?.monthlyPrice ?? 0
  form.storageLimitMb = Math.round((setting?.storageLimitBytes ?? 0) / 1024 / 1024)
  form.imageLimit = setting?.imageLimit ?? 0
  form.maxUploadMb = setting?.maxUploadMb ?? 0
  form.isEnabled = setting?.isEnabled ?? true
  form.allowPrivate = setting?.allowPrivate ?? false
  form.customDomain = setting?.features.customDomain ?? false
  form.apiAccess = setting?.features.apiAccess ?? false
  form.prioritySupport = setting?.features.prioritySupport ?? false
  form.noAds = setting?.features.noAds ?? false
  form.watermarkRemoval = setting?.features.watermarkRemoval ?? false
}

async function savePlan() {
  if (saving.value) return
  saving.value = true
  try {
    await upsert(planKey.value, {
      name: form.name,
      monthlyPrice: Math.max(0, Number(form.monthlyPrice || 0)),
      storageLimitBytes: Math.max(0, Number(form.storageLimitMb || 0)) * 1024 * 1024,
      imageLimit: Math.max(0, Number(form.imageLimit || 0)),
      maxUploadMb: Math.max(0, Number(form.maxUploadMb || 0)),
      isEnabled: !!form.isEnabled,
      allowPrivate: !!form.allowPrivate,
      features: {
        customDomain: !!form.customDomain,
        apiAccess: !!form.apiAccess,
        prioritySupport: !!form.prioritySupport,
        noAds: !!form.noAds,
        watermarkRemoval: !!form.watermarkRemoval,
      },
    })
    toast.success('Plan conditions saved')
  } catch (e: any) {
    toast.error(e?.data?.message ?? 'Failed to save plan conditions')
  } finally {
    saving.value = false
  }
}

async function resetPlan() {
  if (saving.value) return
  saving.value = true
  try {
    await upsert(planKey.value, {
      name: prettyPlan(planKey.value),
      monthlyPrice: 0,
      storageLimitBytes: 0,
      imageLimit: 0,
      maxUploadMb: 0,
      isEnabled: true,
      allowPrivate: false,
      features: {
        customDomain: false,
        apiAccess: false,
        prioritySupport: false,
        noAds: false,
        watermarkRemoval: false,
      },
    })
    hydrateForm()
    toast.info('Plan conditions reset for this plan')
  } catch (e: any) {
    toast.error(e?.data?.message ?? 'Failed to reset plan conditions')
  } finally {
    saving.value = false
  }
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
