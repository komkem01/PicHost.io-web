<template>
  <div class="max-w-7xl mx-auto px-6 py-10">

        <!-- Welcome Row -->
        <div class="flex items-start justify-between mb-10">
          <div>
            <p class="text-white/35 text-sm mb-1.5">{{ todayStr }}</p>
            <h1 class="text-[26px] font-bold tracking-tight leading-tight">
              {{ $t('dashboard.title') }},
              <span class="text-blue-400">{{ userName }}</span>
            </h1>
            <p class="text-white/35 text-sm mt-1.5">
              <template v-if="loading">{{ $t('common.loading') }}</template>
              <template v-else-if="files.length === 0">{{ $t('dashboard.noFilesSub') }}</template>
              <template v-else>{{ $t('dashboard.subtitle') }}</template>
            </p>
          </div>
          <NuxtLink
            to="/upload"
            class="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex-shrink-0"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {{ $t('nav.upload') }}
          </NuxtLink>
        </div>

        <!-- Stats Groups -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <!-- Group 1: Current Usage -->
          <div class="rounded-2xl border border-white/[0.08] bg-white/[0.015] p-5 space-y-4">
            <div class="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <p class="text-[12px] font-semibold text-white/45 uppercase tracking-wider">{{ $t('dashboard.title') }}</p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Total Images -->
              <div class="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div class="flex items-center justify-between mb-4">
                  <p class="text-[11px] font-semibold text-white/35 uppercase tracking-widest">{{ $t('dashboard.stats.totalFiles') }}</p>
                  <div class="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                  </div>
                </div>
                <div v-if="loading" class="h-9 w-16 bg-white/[0.06] rounded-lg animate-pulse" />
                <p v-else class="text-[28px] font-bold leading-none text-white">{{ files.length }}</p>
              </div>

              <!-- Storage Used -->
              <div class="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div class="flex items-center justify-between mb-4">
                  <p class="text-[11px] font-semibold text-white/35 uppercase tracking-widest">{{ $t('dashboard.stats.storageUsed') }}</p>
                  <div class="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                    <svg class="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 2.25c0 2.278-3.504 4.125-8.06 4.125s-8.06-1.847-8.06-4.125" />
                    </svg>
                  </div>
                </div>
                <div v-if="loading" class="h-9 w-24 bg-white/[0.06] rounded-lg animate-pulse" />
                <p v-else class="text-[28px] font-bold leading-none text-white">{{ totalStorageUsed }}</p>
              </div>
            </div>
          </div>

          <!-- Group 2: Plan Info -->
          <div class="rounded-2xl border border-blue-500/15 bg-blue-500/[0.01] p-5 space-y-4">
            <div class="flex items-center justify-between border-b border-blue-500/10 pb-3">
              <p class="text-[12px] font-semibold text-blue-400/80 uppercase tracking-wider">{{ $t('dashboard.stats.currentPlan') }}</p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Plan -->
              <div class="rounded-xl border border-blue-500/10 bg-blue-500/[0.02] p-4">
                <div class="flex items-center justify-between mb-4">
                  <p class="text-[11px] font-semibold text-white/35 uppercase tracking-widest">{{ $t('dashboard.stats.currentPlan') }}</p>
                  <div class="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
                    </svg>
                  </div>
                </div>
                <p class="text-[28px] font-bold leading-none text-white">{{ user?.plan || 'Free' }}</p>
              </div>

              <!-- Remaining Storage -->
              <div class="rounded-xl border border-blue-500/10 bg-blue-500/[0.02] p-4">
                <div class="flex items-center justify-between mb-4">
                  <p class="text-[11px] font-semibold text-white/35 uppercase tracking-widest">{{ $t('dashboard.stats.storageUsed') }}</p>
                  <div class="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <svg class="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
                    </svg>
                  </div>
                </div>
                <div v-if="loading" class="h-9 w-24 bg-white/[0.06] rounded-lg animate-pulse" />
                <p v-else class="text-[28px] font-bold leading-none text-white">{{ remainingStorage }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Uploads Section -->
        <div>
          <div class="flex items-center justify-between mb-5">
            <div>
              <h2 class="text-[15px] font-semibold text-white">{{ $t('dashboard.title') }}</h2>
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-if="!loading && files.length === 0"
            class="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-white/[0.08] text-center"
          >
            <div class="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-5">
              <svg class="w-7 h-7 text-white/20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
            </div>
            <h3 class="text-white/60 font-semibold mb-1.5">{{ $t('dashboard.noFilesTitle') }}</h3>
            <p class="text-white/25 text-sm mb-6 max-w-xs">{{ $t('dashboard.noFilesSub') }}</p>
            <NuxtLink
              to="/upload"
              class="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all"
            >
              {{ $t('nav.upload') }}
            </NuxtLink>
          </div>

          <!-- Image Grid -->
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div
              v-for="file in paginatedFiles"
              :key="file.id"
              class="group relative rounded-xl border border-white/[0.06] bg-white/[0.03] overflow-hidden hover:border-blue-500/30 hover:bg-white/[0.05] transition-all duration-200"
            >
              <!-- Preview -->
              <div class="relative aspect-square bg-white/[0.04] flex items-center justify-center overflow-hidden">
                <img
                  v-if="isImage(file.mime_type)"
                  :src="file.public_url"
                  :alt="file.id"
                  class="w-full h-full object-cover"
                  loading="lazy"
                  @error="(e) => ((e.target as HTMLImageElement).style.display = 'none')"
                />
              </div>

              <!-- Meta -->
              <div class="p-2.5">
                <div class="flex items-center gap-1.5 mb-1">
                  <span class="text-[10px] font-semibold px-1 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/20 uppercase tracking-wide">
                    {{ fileExt(file.mime_type) }}
                  </span>
                  <span class="text-white/25 text-[10px]">{{ formatBytes(file.file_size) }}</span>
                </div>
                <p class="text-white/30 text-[10px]">{{ formatDate(file.created_at, locale) }}</p>
              </div>
            </div>
          </div>
        </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

interface StorageFile {
  id: string
  storage_id: string
  short_code: string
  provider: string
  is_private: boolean
  public_url: string
  file_size: number
  mime_type: string | null
  created_at: string
}

interface ApiResponse<T> {
  code: string
  message: string
  data: T
}

const PAGE_SIZE = 12
const { user, fetchMe, getToken } = useAuth()
const { success, error } = useToast()
const { t, locale } = useI18n()

const SITE_URL = 'https://pichost.io'
useSeoMeta({
  title: 'Dashboard — PicHost.io',
  description: 'Manage your stored images, view storage consumption, and copy CDN links.',
  ogTitle: 'Dashboard — PicHost.io',
  ogDescription: 'Manage your stored images, view storage consumption, and copy CDN links.',
  ogImage: `${SITE_URL}/og-image.png`,
  twitterCard: 'summary_large_image',
})

useHead({
  htmlAttrs: {
    lang: computed(() => locale.value)
  },
  link: [{ rel: 'canonical', href: `${SITE_URL}/dashboard` }],
})

const files = ref<StorageFile[]>([])
const loading = ref(true)
const fetchError = ref(false)
const currentPage = ref(1)

const quota = ref<{
  plan: string
  used_storage_bytes: number
  storage_limit_bytes: number
  image_count: number
  max_images: number
  file_size_limit_bytes: number
} | null>(null)

const totalStorageUsed = computed(() =>
  formatBytes(files.value.reduce((sum, f) => sum + f.file_size, 0))
)
const remainingStorage = computed(() => {
  if (!quota.value) return '0 B'
  const limit = quota.value.storage_limit_bytes
  if (limit === -1) return 'Unlimited'
  const remaining = Math.max(0, limit - quota.value.used_storage_bytes)
  return formatBytes(remaining)
})

const totalPages = computed(() => Math.max(1, Math.ceil(files.value.length / PAGE_SIZE)))
const paginatedFiles = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return files.value.slice(start, start + PAGE_SIZE)
})

const todayStr = computed(() =>
  new Date().toLocaleDateString(locale.value === 'th' ? 'th-TH' : 'en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
)
const userName = computed(() => user.value?.username || user.value?.email?.split('@')[0] || 'there')

onMounted(async () => {
  await Promise.all([loadFiles(), loadQuota()])
})

async function loadQuota() {
  try {
    const res = await apiFetch<{ data: any }>('/auth/quota')
    quota.value = res.data
  } catch (err: any) {
    console.error('Failed to load quota details:', err)
  }
}

async function loadFiles() {
  loading.value = true
  fetchError.value = false
  try {
    const res = await apiFetch<ApiResponse<StorageFile[]>>('/images')
    files.value = res.data ?? []
  } catch {
    fetchError.value = true
  } finally {
    loading.value = false
  }
}

function isImage(mime: string | null): boolean {
  return !!mime && mime.startsWith('image/')
}

function fileExt(mime: string | null): string {
  if (!mime) return 'file'
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/avif': 'avif',
  }
  return map[mime] ?? mime.split('/')[1] ?? 'file'
}
</script>
