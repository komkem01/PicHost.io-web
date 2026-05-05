<template>
  <div class="min-h-screen bg-[#09090b] text-white font-sans">
    <!-- Fixed Header -->
    <header class="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.08] bg-[#09090b]/90 backdrop-blur-xl">
      <div class="max-w-7xl mx-auto px-6 h-[64px] flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-0.5">
          <span class="text-blue-500 text-xl font-bold tracking-tight">PicHost</span>
          <span class="text-white text-xl font-light">.io</span>
        </NuxtLink>
        <nav class="flex items-center gap-1">
          <NuxtLink
            to="/dashboard"
            class="text-[13px] text-white/60 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors"
          >
            Dashboard
          </NuxtLink>
          <NuxtLink
            to="/upload"
            class="text-[13px] text-white px-3 py-1.5 rounded-lg bg-white/[0.06] font-medium"
          >
            Upload
          </NuxtLink>
          <NuxtLink
            to="/settings/account"
            class="text-[13px] text-white/60 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors"
          >
            Settings
          </NuxtLink>
          <button
            @click="openLogoutModal()"
            class="text-[13px] text-red-400 hover:text-white border border-red-500/30 hover:border-red-500/60 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors font-medium"
          >
            Sign out
          </button>
        </nav>
      </div>
    </header>

    <main class="pt-[64px]">
      <div class="max-w-xl mx-auto px-6 py-14">

        <!-- Title -->
        <div class="mb-8">
          <h1 class="text-[22px] font-bold text-white">Upload Image</h1>
          <p class="text-white/35 text-sm mt-1">Drag & drop or browse to upload. Get a shareable link instantly.</p>
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
                <span class="text-[11px] font-semibold text-emerald-400 leading-none">Uploaded</span>
              </div>
            </div>

            <!-- Content -->
            <div class="p-5">
              <p class="text-[15px] font-semibold text-white mb-0.5">Upload complete!</p>
              <p class="text-white/40 text-[12.5px] mb-4">Your image is live and ready to share.</p>

              <!-- URL copy row -->
              <div class="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 mb-4">
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
                  {{ copied ? 'Copied!' : 'Copy' }}
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
                  Upload another
                </button>
                <NuxtLink
                  to="/dashboard"
                  class="flex items-center justify-center px-3.5 py-2 rounded-xl border border-white/[0.09] bg-white/[0.03] hover:bg-white/[0.07] text-white/40 hover:text-white/70 transition-all"
                  title="Go to Dashboard"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </NuxtLink>
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
                  <p class="text-white/35 text-xs mt-0.5">{{ formatSize(selectedFile.size) }} · {{ selectedFile.type || 'image' }}</p>
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
              <p class="pb-3 text-[11.5px] text-white/25">Click or drag to replace</p>
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
                <span class="text-blue-400">Browse</span> or drag & drop
              </p>
              <p class="text-white/25 text-xs">PNG, JPG, WEBP, GIF, AVIF up to 10 MB</p>
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

          <!-- Private toggle -->
          <div class="flex items-center justify-between p-4 rounded-xl border border-white/[0.07] bg-white/[0.02]">
            <div>
              <p class="text-[13px] font-medium" :class="canPrivate ? 'text-white/75' : 'text-white/35'">Private image</p>
              <p class="text-[11.5px] mt-0.5" :class="canPrivate ? 'text-white/30' : 'text-white/20'">
                {{ canPrivate ? 'Only you can access this image' : 'Upgrade to Basic or higher to enable' }}
              </p>
            </div>
            <button
              type="button"
              @click="canPrivate && (isPrivate = !isPrivate)"
              :disabled="!canPrivate"
              :class="[
                'relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0',
                !canPrivate ? 'opacity-30 cursor-not-allowed' : '',
                isPrivate && canPrivate ? 'bg-blue-600' : 'bg-white/[0.12]',
              ]"
              :aria-checked="isPrivate && canPrivate"
              role="switch"
            >
              <span
                :class="[
                  'inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform',
                  isPrivate && canPrivate ? 'translate-x-[18px]' : 'translate-x-[3px]',
                ]"
              />
            </button>
          </div>

          <!-- Upload progress -->
          <div v-if="loading" class="rounded-xl border border-blue-500/20 bg-blue-500/[0.05] p-4">
            <div class="flex items-center gap-3 mb-3">
              <svg class="w-4 h-4 text-blue-400 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span class="text-[13px] text-blue-300 font-medium">Uploading…</span>
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
            Upload Image
          </button>

        </form>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
interface UploadResult {
  id: string
  storage_id: string
  is_private: boolean
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

const canPrivate = computed(() => {
  const plan = user.value?.plan ?? 'Free'
  return plan !== 'Free'
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

onMounted(async () => {
  const me = await fetchMe()
  if (!me) router.push('/auth/login')
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
    fileError.value = 'Please select an image to upload.'
    return
  }

  loading.value = true
  uploadProgress.value = 0

  // Simulate progress while uploading
  const progressInterval = setInterval(() => {
    if (uploadProgress.value < 85) uploadProgress.value += Math.random() * 12
  }, 200)

  try {
    const token = getToken()
    const fd = new FormData()
    fd.append('file', selectedFile.value)
    fd.append('is_private', isPrivate.value ? 'true' : 'false')

    const res = await $fetch<ApiResponse<UploadResult>>(`${config.public.apiBase}/storage/upload-file`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    })

    uploadProgress.value = 100
    resultPreview.value = previewUrl.value
    previewUrl.value = null
    result.value = res.data
    success('Image uploaded!')
  } catch (err: unknown) {
    const body = (err as { data?: ApiResponse<null | { error?: string }> })?.data
    const code = body?.message
    const msgMap: Record<string, string> = {
      'image-private-not-allowed': 'Private images are not available on your current plan. Upgrade to Basic or higher.',
      'image-file-too-large': 'File size exceeds your plan limit.',
      'image-quota-exceeded': 'Storage quota exceeded. Please delete some images or upgrade your plan.',
      'image-limit-reached': 'Image limit reached for your plan.',
      'image-mime-not-allowed': 'This file type is not allowed on your current plan.',
    }
    const msg = (code && msgMap[code]) || body?.data?.error || body?.message || 'Upload failed. Please try again.'
    if (code === 'image-private-not-allowed') isPrivate.value = false
    error(msg)
  } finally {
    clearInterval(progressInterval)
    loading.value = false
  }
}

async function copyResult() {
  if (!result.value?.public_url) return
  try {
    await navigator.clipboard.writeText(result.value.public_url)
    copied.value = true
    success('URL copied!')
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    error('Failed to copy.')
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

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
</script>
