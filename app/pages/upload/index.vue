<template>
  <div class="max-w-7xl mx-auto px-6 py-10">

        <!-- Title -->
        <div class="mb-8">
          <h1 class="text-[26px] font-bold tracking-tight leading-tight text-white">{{ $t('upload.title') }}</h1>
          <p class="text-white/35 text-sm mt-1.5">{{ $t('upload.subtitle') }}</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <!-- Left Column: Upload Form & Result -->
          <div class="lg:col-span-7 space-y-4">

        <!-- Guest notice -->
        <div
          v-if="!user"
          class="mb-6 flex items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/[0.06] px-4 py-3.5"
        >
          <svg class="w-4 h-4 text-amber-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <div class="flex-1 min-w-0">
            <p class="text-[13px] font-medium text-amber-300">{{ $t('upload.guestNotice') }}</p>
            <p class="text-[11.5px] text-amber-400/70 mt-0.5">
              {{ $t('upload.supportsText', { maxSize: '5 MB' }) }} &middot;
              <NuxtLink to="/auth/register" class="underline underline-offset-2 hover:text-amber-300 transition-colors">{{ $t('nav.register') }}</NuxtLink>
            </p>
          </div>
        </div>

        <!-- Success card -->
        <Transition
          enter-from-class="opacity-0 scale-[0.98]"
          enter-active-class="transition duration-200"
          leave-to-class="opacity-0"
          leave-active-class="transition duration-150"
        >
          <div v-if="result" class="mb-6 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl">
            <!-- Image preview -->
            <div v-if="resultPreview" class="relative w-full bg-black/30 flex items-center justify-center" style="min-height:180px; max-height:280px; overflow:hidden;">
              <img :src="resultPreview" class="w-full object-contain" style="max-height:280px;" alt="uploaded" />
              <!-- overlay gradient -->
              <div class="absolute inset-0 bg-gradient-to-t from-[#09090b]/80 via-transparent to-transparent pointer-events-none" />
              <!-- badge -->
              <div class="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-sm">
                <svg class="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span class="text-[11px] font-semibold text-emerald-400 leading-none">{{ $t('common.success') }}</span>
              </div>
            </div>

            <!-- Content -->
            <div class="p-5">
              <p class="text-[15px] font-semibold text-white mb-0.5">{{ $t('upload.success') }}</p>

              <!-- URL copy row -->
              <div class="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 my-4">
                <svg class="w-3.5 h-3.5 text-white/25 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                </svg>
                <span class="text-blue-300/90 text-[12.5px] font-mono truncate flex-1 select-all">{{ result.public_url }}</span>
                <button
                  @click="copyResult"
                  class="shrink-0 flex items-center gap-1 text-[11.5px] font-medium transition-colors px-2 py-0.5 rounded-md"
                  :class="copied ? 'text-emerald-400 bg-emerald-500/10' : 'text-white/40 hover:text-white/70 hover:bg-white/[0.05]'"
                >
                  <svg v-if="!copied" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {{ copied ? $t('upload.copied') : $t('upload.copy') }}
                </button>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-2">
                <a
                  :href="result.public_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-[13px] font-semibold transition-all shadow-lg shadow-blue-600/20"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                  Open
                </a>
                <button
                  @click="resetForm"
                  class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-white/[0.09] bg-white/[0.03] hover:bg-white/[0.07] text-white/60 hover:text-white text-[13px] font-medium transition-all"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  {{ $t('upload.uploadAnother') }}
                </button>
              </div>
            </div>
          </div>
        </Transition>

        <!-- Upload Form -->
        <form v-if="!result" @submit.prevent="handleSubmit" class="space-y-4">

          <!-- Drop Zone -->
          <div
            ref="dropzone"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="onDrop"
            @click="triggerFilePicker"
            :class="[
              'relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer flex flex-col items-center justify-center min-h-[200px] select-none',
              isDragging
                ? 'border-blue-500/60 bg-blue-500/[0.06]'
                : selectedFile
                ? 'border-white/[0.12] bg-white/[0.03]'
                : 'border-white/[0.1] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.03]',
            ]"
          >
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="sr-only"
              @change="onFileChange"
            />

            <!-- Preview when file is selected -->
            <template v-if="selectedFile">
              <div class="w-full p-4 flex items-center gap-4">
                <!-- Thumbnail -->
                <div class="w-16 h-16 rounded-xl border border-white/[0.08] overflow-hidden bg-white/[0.04] flex items-center justify-center shrink-0">
                  <img v-if="previewUrl" :src="previewUrl" class="w-full h-full object-cover" alt="preview" />
                  <svg v-else class="w-6 h-6 text-white/20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                </div>
                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <p class="text-[13.5px] font-medium text-white truncate">{{ selectedFile.name }}</p>
                  <p class="text-white/35 text-xs mt-0.5">{{ formatBytes(selectedFile.size) }} · {{ selectedFile.type || 'image' }}</p>
                </div>
                <!-- Remove button -->
                <button
                  type="button"
                  @click.stop="clearFile"
                  class="w-7 h-7 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] flex items-center justify-center transition-colors shrink-0"
                >
                  <svg class="w-3.5 h-3.5 text-white/50" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </template>

            <!-- Empty state -->
            <template v-else>
              <div
                class="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-4 transition-transform"
                :class="isDragging ? 'scale-110' : ''"
              >
                <svg class="w-6 h-6 text-white/25" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <p class="text-[13.5px] font-medium text-white/60 mb-1">
                <span class="text-blue-400">{{ $t('upload.browseText') }}</span> {{ $t('upload.dropzoneText') }}
              </p>
              <p class="text-white/25 text-xs">{{ $t('upload.supportsText', { maxSize: '10 MB' }) }}</p>
            </template>
          </div>

          <!-- File required error -->
          <Transition enter-from-class="opacity-0 -translate-y-0.5" enter-active-class="transition duration-150">
            <p v-if="fileError" class="text-[11.5px] text-red-400 flex items-center gap-1 -mt-1">
              <svg class="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              {{ fileError }}
            </p>
          </Transition>

          <!-- Upload progress -->
          <div v-if="loading" class="rounded-xl border border-blue-500/20 bg-blue-500/[0.05] p-4">
            <div class="flex items-center gap-3 mb-3">
              <svg class="w-4 h-4 text-blue-400 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span class="text-[13px] text-blue-300 font-medium">{{ $t('upload.uploading') }}</span>
              <span class="ml-auto text-[12px] text-blue-400/70">{{ uploadProgress }}%</span>
            </div>
            <div class="h-1 w-full bg-white/[0.07] rounded-full overflow-hidden">
              <div
                class="h-full bg-blue-500 rounded-full transition-all duration-300"
                :style="{ width: `${uploadProgress}%` }"
              />
            </div>
          </div>

          <!-- Submit button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full rounded-xl py-2.5 text-[13.5px] font-semibold text-white transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            :class="loading ? 'bg-blue-600/70' : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-600/25'"
          >
            {{ $t('upload.title') }}
          </button>

        </form>
          </div>

          <!-- Right Column: Sidebar -->
          <div class="lg:col-span-5 space-y-6">
            <!-- If logged in: Quota and Plan Details -->
            <div v-if="user" class="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 space-y-5">
              <div class="flex items-center justify-between border-b border-white/[0.06] pb-4">
                <div>
                  <p class="text-[12px] text-white/40 mb-0.5">{{ $t('dashboard.stats.currentPlan') }}</p>
                  <p class="text-[16px] font-bold text-white">{{ user.plan }}</p>
                </div>
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-medium border" :class="planBadge.class">
                  <span class="w-1.5 h-1.5 rounded-full" :class="planBadge.dot" />
                  Active
                </span>
              </div>

              <!-- Storage Quota -->
              <div v-if="quota" class="space-y-4">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-[12px] text-white/50">{{ $t('dashboard.stats.storageUsed') }}</span>
                    <span class="text-[12px] font-medium text-white/80">
                      {{ formatBytes(quota.used_storage_bytes) }}
                      <span class="text-white/30"> / {{ quota.storage_limit_bytes === -1 ? 'Unlimited' : formatBytes(quota.storage_limit_bytes) }}</span>
                    </span>
                  </div>
                  <div class="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-500"
                      :class="storagePercent >= 90 ? 'bg-red-500' : storagePercent >= 70 ? 'bg-yellow-500' : 'bg-blue-500'"
                      :style="{ width: quota.storage_limit_bytes === -1 ? '0%' : `${storagePercent}%` }"
                    />
                  </div>
                </div>

                <!-- Usage: Images -->
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-[12px] text-white/50">{{ $t('dashboard.stats.totalFiles') }}</span>
                    <span class="text-[12px] font-medium text-white/80">
                      {{ quota.image_count.toLocaleString() }}
                      <span class="text-white/30"> / {{ quota.max_images === 0 ? 'Unlimited' : quota.max_images.toLocaleString() }}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- If guest: Benefits -->
            <div v-else class="rounded-2xl border border-blue-500/20 bg-blue-500/[0.03] p-6 space-y-5">
              <div>
                <h3 class="text-[16px] font-semibold text-white">{{ $t('auth.register.title') }}</h3>
                <p class="text-[12.5px] text-white/50 mt-1 leading-relaxed">
                  {{ $t('hero.subtitle') }}
                </p>
              </div>

              <div class="pt-2">
                <NuxtLink
                  to="/auth/register"
                  class="w-full flex items-center justify-center py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-[13px] font-semibold transition-all shadow-lg shadow-blue-600/20"
                >
                  {{ $t('nav.register') }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
  </div>
</template>

<script setup lang="ts">
interface UploadResult {
  id: string
  storage_id: string
  is_private: boolean
  expires_at: string | null
  created_at: string
  short_code: string
  provider: string
  file_size: number
  mime_type: string | null
  public_url: string
}

interface ApiResponse<T> {
  code: string
  message: string
  data: T
}

const config = useRuntimeConfig()
const router = useRouter()
const { user, fetchMe, getToken } = useAuth()
const { open: openLogoutModal } = useLogoutModal()
const { success, error } = useToast()
const { t, locale } = useI18n()

const SITE_URL = 'https://pichost.io'
useSeoMeta({
  title: 'Upload Images — PicHost.io',
  description: 'Upload JPEG, PNG, WebP, GIF, AVIF, HEIC images instantly with PicHost.io free image hosting.',
  ogTitle: 'Upload Images — PicHost.io',
  ogDescription: 'Upload JPEG, PNG, WebP, GIF, AVIF, HEIC images instantly with PicHost.io free image hosting.',
  ogImage: `${SITE_URL}/og-image.png`,
  twitterCard: 'summary_large_image',
})

useHead({
  htmlAttrs: {
    lang: computed(() => locale.value)
  },
  link: [{ rel: 'canonical', href: `${SITE_URL}/upload` }],
})

// File state
const fileInput = ref<HTMLInputElement | null>(null)
const dropzone = ref<HTMLDivElement | null>(null)
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const isDragging = ref(false)
const isPrivate = ref(false)
const fileError = ref('')

// Upload state
const loading = ref(false)
const uploadProgress = ref(0)
const result = ref<UploadResult | null>(null)
const resultPreview = ref<string | null>(null)
const copied = ref(false)

const quota = ref<{
  plan: string
  used_storage_bytes: number
  storage_limit_bytes: number
  image_count: number
  max_images: number
  file_size_limit_bytes: number
  allow_private: boolean
} | null>(null)

const planBadge = computed((): { class: string; dot: string } => {
  const map: Record<string, { class: string; dot: string }> = {
    Free:       { class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-400' },
    Basic:      { class: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',    dot: 'bg-yellow-400' },
    Pro:        { class: 'bg-orange-500/10 text-orange-400 border-orange-500/20',    dot: 'bg-orange-400' },
    Enterprise: { class: 'bg-red-500/10 text-red-400 border-red-500/20',             dot: 'bg-red-400' },
  }
  return map[user.value?.plan ?? 'Free'] ?? map['Free']!
})

const storagePercent = computed(() => {
  if (!quota.value || quota.value.storage_limit_bytes <= 0) return 0
  return Math.min(Math.round((quota.value.used_storage_bytes / quota.value.storage_limit_bytes) * 100), 100)
})

const imagePercent = computed(() => {
  if (!quota.value || quota.value.max_images <= 0) return 0
  return Math.min(Math.round((quota.value.image_count / quota.value.max_images) * 100), 100)
})

onMounted(async () => {
  const me = await fetchMe()
  if (me) {
    try {
      const res = await apiFetch<{ data: any }>('/auth/quota')
      quota.value = res.data
    } catch {
      // ignore
    }
  }
})

onUnmounted(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  if (resultPreview.value) URL.revokeObjectURL(resultPreview.value)
})

function triggerFilePicker() {
  fileInput.value?.click()
}

function onFileChange(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (f) applyFile(f)
}

function onDrop(e: DragEvent) {
  isDragging.value = false
  const f = e.dataTransfer?.files?.[0]
  if (!f) return
  if (!f.type.startsWith('image/')) {
    error('Please drop an image file.')
    return
  }
  applyFile(f)
}

function applyFile(f: File) {
  fileError.value = ''
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  selectedFile.value = f
  previewUrl.value = URL.createObjectURL(f)
}

function clearFile() {
  selectedFile.value = null
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = null
  fileError.value = ''
  if (fileInput.value) fileInput.value.value = ''
}

async function handleSubmit() {
  fileError.value = ''
  if (!selectedFile.value) {
    fileError.value = t('upload.dropzoneText')
    return
  }

  loading.value = true
  uploadProgress.value = 0

  const onProgress = (percent: number) => {
    uploadProgress.value = percent
  }

  try {
    const fd = new FormData()
    fd.append('file', selectedFile.value)

    let res: ApiResponse<UploadResult>
    if (user.value) {
      fd.append('is_private', isPrivate.value ? 'true' : 'false')
      res = await uploadFileWithProgress<ApiResponse<UploadResult>>('/storage/upload-file', fd, onProgress)
    } else {
      res = await uploadFileWithProgress<ApiResponse<UploadResult>>('/storage/upload-file-guest', fd, onProgress)
    }

    uploadProgress.value = 100
    resultPreview.value = previewUrl.value
    previewUrl.value = null
    result.value = res.data
    success(t('upload.success'))
  } catch (err: unknown) {
    const body = (err as { data?: ApiResponse<null | { error?: string }> })?.data
    const msg = body?.data?.error || body?.message || t('common.error')
    error(msg)
  } finally {
    loading.value = false
  }
}

async function copyResult() {
  if (!result.value?.public_url) return
  try {
    await navigator.clipboard.writeText(result.value.public_url)
    copied.value = true
    success(t('upload.copied'))
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    error(t('common.error'))
  }
}

function resetForm() {
  result.value = null
  if (resultPreview.value) URL.revokeObjectURL(resultPreview.value)
  resultPreview.value = null
  clearFile()
  isPrivate.value = false
  uploadProgress.value = 0
}
</script>
