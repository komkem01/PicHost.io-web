<template>
  <div class="p-8 w-full">

    <div class="flex items-center justify-between gap-4 mb-6">
      <NuxtLink
        to="/admin/users"
        class="inline-flex items-center gap-1.5 text-[12px] text-white/25 hover:text-white/55 transition-colors"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"/>
        </svg>
        All Users
      </NuxtLink>

      <p v-if="u" class="text-[11px] uppercase tracking-widest text-white/25">User Detail</p>
    </div>

    <template v-if="loading">
      <div class="grid grid-cols-12 gap-3">
        <div class="col-span-12 lg:col-span-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-6 space-y-4">
          <div class="w-18 h-18 rounded-2xl bg-white/[0.05] animate-pulse" />
          <div class="space-y-2.5">
            <div class="h-4 rounded-full bg-white/[0.05] animate-pulse w-2/3" />
            <div class="h-3 rounded-full bg-white/[0.04] animate-pulse w-1/2" />
          </div>
          <div class="grid grid-cols-2 gap-2 pt-3 border-t border-white/[0.05]">
            <div v-for="i in 4" :key="i" class="h-12 rounded-xl bg-white/[0.04] animate-pulse" />
          </div>
        </div>
        <div class="col-span-12 lg:col-span-8 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-6 h-[380px] animate-pulse" />
      </div>
    </template>

    <div v-else-if="error" class="rounded-2xl border border-red-500/20 bg-red-500/[0.05] p-5 text-[13px] text-red-400">{{ error }}</div>

    <template v-else-if="u">
      <div class="grid grid-cols-12 gap-3">

        <aside class="col-span-12 lg:col-span-4 space-y-3">
          <div class="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.025] p-6">
            <div class="absolute -top-16 -right-8 w-44 h-44 rounded-full blur-3xl" :class="u.is_guest ? 'bg-amber-500/10' : 'bg-violet-500/10'" />
            <div class="relative flex items-start gap-4">
              <div
                class="w-16 h-16 rounded-2xl flex items-center justify-center text-[22px] font-bold shrink-0"
                :class="u.is_guest ? 'bg-amber-500/10 text-amber-300' : 'bg-violet-500/[0.12] text-violet-300'"
              >
                {{ avatarInitials(u) }}
              </div>
              <div class="min-w-0 flex-1">
                <h2 class="text-[20px] font-bold text-white leading-none truncate">{{ u.username ?? 'No username' }}</h2>
                <p class="text-[13px] text-white/35 mt-2 truncate">{{ u.email ?? 'No email' }}</p>
                <div class="flex items-center gap-2 flex-wrap mt-3">
                  <span v-if="u.is_admin" class="text-[10px] font-semibold text-red-400 border border-red-400/25 bg-red-400/[0.07] rounded-md px-1.5 py-px">admin</span>
                  <span v-if="u.is_guest" class="text-[10px] font-semibold text-amber-400/80 border border-amber-400/20 bg-amber-400/[0.07] rounded-md px-1.5 py-px">guest</span>
                  <span
                    v-else
                    class="text-[10px] font-semibold rounded-md px-1.5 py-px"
                    :class="u.is_active
                      ? 'text-emerald-400 border border-emerald-400/25 bg-emerald-400/[0.07]'
                      : 'text-red-400/70 border border-red-400/20 bg-red-400/[0.05]'"
                  >{{ u.is_active ? 'active' : 'inactive' }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
            <p class="text-[10.5px] font-semibold text-white/20 uppercase tracking-widest mb-3">User Stats</p>
            <div class="grid grid-cols-2 gap-2.5">
              <div v-for="stat in userStats" :key="stat.label" class="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                <p class="text-[10px] font-semibold text-white/25 uppercase tracking-widest mb-1">{{ stat.label }}</p>
                <p class="text-[13px] font-semibold tabular-nums text-white/80 truncate">{{ stat.value }}</p>
              </div>
            </div>
          </div>
        </aside>

        <section class="col-span-12 lg:col-span-8 space-y-3">
          <div class="rounded-2xl border border-white/[0.06] bg-white/[0.025] divide-y divide-white/[0.05]">
            <div class="p-6">
              <div class="flex items-center justify-between gap-3 mb-4">
                <p class="text-[10.5px] font-semibold text-white/20 uppercase tracking-widest">Profile</p>
                <p class="text-[11.5px] text-white/25">Identity information</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label class="block text-[11.5px] text-white/35 mb-1.5">Username</label>
                  <input
                    v-model="form.username"
                    type="text"
                    placeholder="No username"
                    class="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-[13px] text-white placeholder:text-white/15 outline-none focus:border-violet-500/50 focus:bg-white/[0.05] transition-colors"
                  />
                </div>
                <div>
                  <label class="block text-[11.5px] text-white/35 mb-1.5">Email</label>
                  <input
                    v-model="form.email"
                    type="email"
                    placeholder="No email"
                    :disabled="u.is_guest"
                    class="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-[13px] text-white placeholder:text-white/15 outline-none focus:border-violet-500/50 focus:bg-white/[0.05] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  />
                </div>
              </div>

              <div class="flex justify-end pt-4">
                <button
                  @click="saveProfile"
                  :disabled="saving.profile || !profileChanged"
                  class="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-25 disabled:cursor-not-allowed text-[13px] font-medium text-white transition-colors"
                >
                  {{ saving.profile ? 'Saving…' : 'Save Profile' }}
                </button>
              </div>
            </div>

            <div class="p-6">
              <div class="flex items-center justify-between gap-3 mb-4">
                <p class="text-[10.5px] font-semibold text-white/20 uppercase tracking-widest">Plan</p>
                <p class="text-[11.5px] text-white/25">Billing tier and limits</p>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  v-for="p in plans"
                  :key="p"
                  @click="form.plan = p"
                  class="text-left rounded-xl border px-3.5 py-2.5 transition-all"
                  :class="form.plan === p
                    ? planActiveClass(p)
                    : 'border-white/[0.06] text-white/35 hover:text-white/60 hover:border-white/[0.12]'"
                >
                  <p class="text-[12.5px] font-semibold">{{ p }}</p>
                  <p class="text-[11px] mt-1 opacity-70">
                    {{ p === 'Free' ? 'Starter access' : p === 'Basic' ? 'Everyday usage' : 'Power user tier' }}
                  </p>
                </button>
              </div>

              <div class="flex justify-end pt-4">
                <button
                  @click="savePlan"
                  :disabled="saving.plan || form.plan === u.plan"
                  class="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-25 disabled:cursor-not-allowed text-[13px] font-medium text-white transition-colors"
                >
                  {{ saving.plan ? 'Saving…' : 'Save Plan' }}
                </button>
              </div>
            </div>

            <div class="p-6">
              <div class="flex items-center justify-between gap-3 mb-4">
                <p class="text-[10.5px] font-semibold text-white/20 uppercase tracking-widest">Permissions</p>
                <p class="text-[11.5px] text-white/25">Access controls</p>
              </div>

              <div class="space-y-3">
                <div class="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5 flex items-center justify-between gap-4">
                  <div>
                    <p class="text-[13px] text-white/75 font-medium">Account Active</p>
                    <p class="text-[11.5px] text-white/25 mt-0.5">Allow user to sign in and use the app</p>
                  </div>
                  <button
                    @click="toggleActive"
                    :disabled="saving.active || u.is_guest"
                    :title="u.is_guest ? 'Cannot change for guest accounts' : undefined"
                    class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                    :class="form.is_active ? 'bg-emerald-600' : 'bg-white/[0.10]'"
                  >
                    <span class="inline-block w-4 h-4 rounded-full bg-white shadow transition-transform" :class="form.is_active ? 'translate-x-6' : 'translate-x-1'" />
                  </button>
                </div>

                <div class="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5 flex items-center justify-between gap-4">
                  <div>
                    <p class="text-[13px] text-white/75 font-medium">Admin Access</p>
                    <p class="text-[11.5px] text-white/25 mt-0.5">Grant full access to the admin panel</p>
                  </div>
                  <button
                    @click="toggleAdmin"
                    :disabled="saving.admin"
                    class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-30 shrink-0"
                    :class="form.is_admin ? 'bg-red-600' : 'bg-white/[0.10]'"
                  >
                    <span class="inline-block w-4 h-4 rounded-full bg-white shadow transition-transform" :class="form.is_admin ? 'translate-x-6' : 'translate-x-1'" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-red-500/[0.12] bg-red-500/[0.025] p-6 flex items-center gap-4">
            <div class="flex-1 min-w-0">
              <p class="text-[13px] font-semibold text-red-400/80 mb-0.5">Danger Zone</p>
              <p class="text-[12px] text-white/20">Permanently remove this user and all associated data.</p>
            </div>
            <button
              @click="showDeleteModal = true"
              class="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/25 text-red-400/70 text-[13px] hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/40 transition-all"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
              </svg>
              Delete User
            </button>
          </div>
        </section>
      </div>
    </template>

    <!-- ── Toast ── -->
    <Teleport to="body">
      <div class="fixed top-5 right-5 z-[60] flex flex-col gap-2 pointer-events-none">
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 translate-x-3 scale-95"
          enter-to-class="opacity-100 translate-x-0 scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-x-0 scale-100"
          leave-to-class="opacity-0 translate-x-3 scale-95"
        >
          <div v-if="saveSuccess" class="pointer-events-auto flex items-center gap-3 bg-[#111113] border border-emerald-500/25 rounded-xl px-4 py-3 shadow-2xl min-w-[220px]">
            <div class="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
              <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/>
              </svg>
            </div>
            <p class="text-[13px] font-medium text-white/80">Changes saved</p>
          </div>
        </Transition>
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 translate-x-3 scale-95"
          enter-to-class="opacity-100 translate-x-0 scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-x-0 scale-100"
          leave-to-class="opacity-0 translate-x-3 scale-95"
        >
          <div v-if="saveError" class="pointer-events-auto flex items-center gap-3 bg-[#111113] border border-red-500/25 rounded-xl px-4 py-3 shadow-2xl min-w-[220px]">
            <div class="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
              <svg class="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
              </svg>
            </div>
            <p class="text-[13px] font-medium text-white/80">{{ saveError }}</p>
          </div>
        </Transition>
      </div>
    </Teleport>

    <!-- ── Delete modal ── -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-150"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showDeleteModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showDeleteModal = false" />
          <div class="relative w-full max-w-[400px] rounded-2xl border border-white/[0.08] bg-[#111113] shadow-2xl p-6">
            <div class="w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
              <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
              </svg>
            </div>
            <h3 class="text-[16px] font-bold text-white mb-1">Delete User</h3>
            <p class="text-[13px] text-white/35 mb-4">
              Permanently delete
              <span class="text-white font-medium">{{ u?.username ?? u?.email ?? 'this user' }}</span>
              and all their data?
            </p>
            <p class="text-[12px] text-red-400/60 bg-red-500/[0.05] border border-red-500/[0.10] rounded-xl px-3.5 py-2.5 mb-5">
              This action cannot be undone.
            </p>
            <div class="flex gap-2">
              <button
                @click="showDeleteModal = false"
                class="flex-1 px-4 py-2.5 rounded-xl border border-white/[0.07] text-[13px] text-white/55 hover:text-white hover:border-white/[0.15] transition-all"
              >Cancel</button>
              <button
                @click="doDelete"
                :disabled="deleting"
                class="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-[13px] font-semibold text-white transition-colors"
              >{{ deleting ? 'Deleting…' : 'Yes, delete' }}</button>
            </div>
            <p v-if="deleteError" class="mt-3 text-[12px] text-red-400">{{ deleteError }}</p>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
<script setup lang="ts">
definePageMeta({ layout: 'admin' })

import type { AdminUser } from '~/composables/useAdmin'

const route = useRoute()
const router = useRouter()
const { getUser, setUserPlan, setUserActive, setUserAdmin, deleteUser, updateUserProfile } = useAdmin()

const id = route.params.id as string

const u = ref<AdminUser | null>(null)
const loading = ref(true)
const error = ref('')

const form = reactive({ plan: '', is_active: false, is_admin: false, username: '' as string | null, email: '' as string | null })
const saving = reactive({ plan: false, active: false, admin: false, profile: false })
const saveSuccess = ref(false)
const saveError = ref('')

const plans = ['Free', 'Basic', 'Pro']

onMounted(async () => {
  try {
    u.value = await getUser(id)
    form.plan = u.value.plan
    form.is_active = u.value.is_active
    form.is_admin = u.value.is_admin
    form.username = u.value.username
    form.email = u.value.email
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Failed to load user'
  } finally {
    loading.value = false
  }
})

const profileChanged = computed(() =>
  form.username !== u.value?.username || form.email !== u.value?.email
)

async function saveProfile() {
  saving.profile = true
  saveError.value = ''
  try {
    const updated = await updateUserProfile(id, { email: form.email, username: form.username })
    u.value!.email = updated.email
    u.value!.username = updated.username
    saveSuccess.value = true
    setTimeout(() => (saveSuccess.value = false), 2500)
  } catch (e: any) {
    showError(e?.data?.message ?? 'Error')
  } finally {
    saving.profile = false
  }
}

async function savePlan() {
  saving.plan = true
  saveError.value = ''
  try {
    await setUserPlan(id, form.plan)
    u.value!.plan = form.plan
    saveSuccess.value = true
    setTimeout(() => (saveSuccess.value = false), 2500)
  } catch (e: any) {
    showError(e?.data?.message ?? 'Error')
  } finally {
    saving.plan = false
  }
}

async function toggleActive() {
  saving.active = true
  saveError.value = ''
  const next = !form.is_active
  try {
    await setUserActive(id, next)
    form.is_active = next
    u.value!.is_active = next
    saveSuccess.value = true
    setTimeout(() => (saveSuccess.value = false), 2500)
  } catch (e: any) {
    showError(e?.data?.message ?? 'Error')
  } finally {
    saving.active = false
  }
}

async function toggleAdmin() {
  saving.admin = true
  saveError.value = ''
  const next = !form.is_admin
  try {
    await setUserAdmin(id, next)
    form.is_admin = next
    u.value!.is_admin = next
    saveSuccess.value = true
    setTimeout(() => (saveSuccess.value = false), 2500)
  } catch (e: any) {
    showError(e?.data?.message ?? 'Error')
  } finally {
    saving.admin = false
  }
}

const showDeleteModal = ref(false)
const deleting = ref(false)
const deleteError = ref('')

async function doDelete() {
  deleting.value = true
  deleteError.value = ''
  try {
    await deleteUser(id)
    router.replace('/admin/users')
  } catch (e: any) {
    deleteError.value = e?.data?.message ?? 'Error deleting user'
    deleting.value = false
  }
}

function planActiveClass(plan: string) {
  return {
    Free:  'border-white/[0.15] bg-white/[0.08] text-white',
    Basic: 'border-blue-500/40 bg-blue-500/10 text-blue-300',
    Pro:   'border-violet-500/40 bg-violet-500/10 text-violet-300',
  }[plan] ?? 'border-white/[0.10] text-white/60'
}

function showError(msg: string) {
  saveError.value = msg
  setTimeout(() => (saveError.value = ''), 3500)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })
}

function avatarInitials(user: AdminUser) {
  const name = user.username ?? user.email
  if (!name) return '?'
  return name.slice(0, 2).toUpperCase()
}

const userStats = computed(() => {
  if (!u.value) return []
  return [
    { label: 'Plan', value: u.value.plan, color: '' },
    { label: 'Images', value: (u.value.image_count ?? 0).toLocaleString(), color: '' },
    { label: 'Storage', value: formatBytes(u.value.used_storage_bytes), color: '' },
    { label: 'Joined', value: formatDate(u.value.created_at), color: '' },
  ]
})
</script>
