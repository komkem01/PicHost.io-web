<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

    <!-- Title -->
    <div class="mb-8 text-left">
      <h1 class="text-2xl sm:text-[26px] font-bold tracking-tight leading-tight text-zinc-900">{{ $t('upload.title') }}</h1>
      <p class="text-zinc-500 text-sm mt-1.5">{{ $t('upload.subtitle') }}</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Left Column: Upload Form & Result -->
      <div class="lg:col-span-7 space-y-6 text-left">

        <!-- Guest notice -->
        <div
          v-if="!user"
          class="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5"
        >
          <svg class="w-4 h-4 text-amber-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <div class="flex-1 min-w-0">
            <p class="text-[13px] font-medium text-amber-900">{{ $t('upload.guestNotice') }}</p>
            <p class="text-[11.5px] text-amber-700 mt-0.5">
              {{ $t('upload.supportsText', { maxSize: '5 MB' }) }} &middot;
              <NuxtLink to="/auth/register" class="underline underline-offset-2 hover:text-amber-900 transition-colors">{{ $t('nav.register') }}</NuxtLink>
            </p>
          </div>
        </div>

        <!-- BATCH RESULTS VIEW (Shown when uploads are completed) -->
        <Transition
          enter-from-class="opacity-0 scale-[0.98]"
          enter-active-class="transition duration-200"
          leave-to-class="opacity-0"
          leave-active-class="transition duration-150"
        >
          <div v-if="completedBatch" class="space-y-6">

            <!-- Summary Header Card -->
            <div class="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-card space-y-4">
              <div class="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-base font-bold text-zinc-900">
                      {{ locale === 'th' ? `อัปโหลดสำเร็จ ${successCount} จาก ${fileQueue.length} รูป` : `Uploaded ${successCount} of ${fileQueue.length} images` }}
                    </h3>
                    <p class="text-xs text-zinc-500 mt-0.5">
                      {{ locale === 'th' ? 'รูปภาพพร้อมใช้งานแล้ว สามารถคัดลอกลิงก์ไปใช้งานได้ทันที' : 'Your images are ready to share' }}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  @click="resetAll"
                  class="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
                >
                  {{ locale === 'th' ? '+ อัปโหลดรูปภาพเพิ่ม' : '+ Upload More' }}
                </button>
              </div>


            </div>

            <!-- Uploaded Cards Grid -->
            <div class="space-y-3">
              <div
                v-for="item in fileQueue"
                :key="item.id"
                class="rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div class="flex items-center gap-3.5 min-w-0 flex-1">
                  <div class="w-14 h-14 rounded-lg bg-zinc-100 border border-zinc-200 overflow-hidden shrink-0 flex items-center justify-center">
                    <img v-if="item.previewUrl" :src="item.previewUrl" class="w-full h-full object-cover" alt="preview" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-xs font-semibold text-zinc-900 truncate" :title="item.name">{{ item.name }}</p>
                    <p class="text-[11px] text-zinc-400 mt-0.5">{{ formatBytes(item.size) }}</p>
                    <p v-if="item.result?.public_url" class="text-[11.5px] font-mono text-zinc-600 truncate mt-1 select-all">
                      {{ item.result.public_url }}
                    </p>
                    <p v-else-if="item.status === 'error'" class="text-[11.5px] text-red-600 mt-1">
                      {{ item.errorMsg || 'Upload failed' }}
                    </p>
                  </div>
                </div>

                <div v-if="item.result?.public_url" class="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <a
                    :href="item.result.public_url"
                    target="_blank"
                    class="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors"
                    title="Open"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </a>
                  <button
                    type="button"
                    @click="copySingleLink(item.result.public_url)"
                    class="px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-800 transition-all shadow-2xs cursor-pointer"
                  >
                    {{ locale === 'th' ? 'คัดลอก' : 'Copy' }}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </Transition>

        <!-- UPLOAD FORM (Shown when selecting/uploading files) -->
        <div v-if="!completedBatch" class="space-y-4">

          <!-- Drop Zone -->
          <div
            ref="dropzone"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="onDrop"
            @click="triggerFilePicker"
            :class="[
              'relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer flex flex-col items-center justify-center min-h-[200px] select-none p-6 text-center',
              isDragging
                ? 'border-zinc-900 bg-zinc-100'
                : 'border-zinc-300 bg-zinc-50 hover:bg-zinc-100/50 hover:border-zinc-400',
            ]"
          >
            <input
              ref="fileInput"
              type="file"
              accept="image/*,video/*"
              multiple
              class="sr-only"
              @change="onFileChange"
            />

            <div
              class="w-12 h-12 rounded-2xl bg-white border border-zinc-200 shadow-xs flex items-center justify-center mb-3 transition-transform"
              :class="isDragging ? 'scale-110' : ''"
            >
              <svg class="w-6 h-6 text-zinc-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <p class="text-[13.5px] font-medium text-zinc-700 mb-1">
              <span class="text-zinc-900 font-semibold">{{ $t('upload.browseText') }}</span> {{ locale === 'th' ? 'หรือลากไฟล์มาวางที่นี่ (รูปภาพและวิดีโอ)' : 'or drop files here (images & videos)' }}
            </p>
            <p class="text-zinc-400 text-xs">{{ $t('upload.supportsText', { maxSize: maxFileSizeText }) }}</p>
          </div>

          <!-- Overall Progress Bar (During Active Batch Upload) -->
          <div v-if="isUploading" class="rounded-2xl border border-zinc-200 bg-white p-5 shadow-card space-y-3">
            <div class="flex items-center justify-between text-xs font-semibold text-zinc-900">
              <div class="flex items-center gap-2">
                <AppSpinner size="sm" />
                <span>{{ locale === 'th' ? `กำลังอัปโหลด... (${completedCount}/${fileQueue.length} รูป)` : `Uploading... (${completedCount}/${fileQueue.length} images)` }}</span>
              </div>
              <span class="font-mono text-zinc-600">{{ overallProgress }}%</span>
            </div>
            <div class="h-2 w-full bg-zinc-100 rounded-full overflow-hidden border border-zinc-200">
              <div
                class="h-full bg-zinc-900 rounded-full transition-all duration-300"
                :style="{ width: `${overallProgress}%` }"
              />
            </div>
          </div>

          <!-- Queued Selected Files List -->
          <div v-if="fileQueue.length > 0 && !completedBatch" class="space-y-3">
            <div class="flex items-center justify-between px-1">
              <p class="text-xs font-bold uppercase tracking-wider text-zinc-500">
                {{ locale === 'th' ? `รายการรูปภาพที่เลือก (${fileQueue.length} รูป)` : `Queued Images (${fileQueue.length})` }}
              </p>
              <button
                v-if="!isUploading"
                type="button"
                @click="clearQueue"
                class="text-xs text-red-600 hover:text-red-700 font-medium transition-colors cursor-pointer"
              >
                {{ locale === 'th' ? 'ล้างทั้งหมด' : 'Clear All' }}
              </button>
            </div>

            <!-- Queue File Items -->
            <div class="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              <div
                v-for="item in fileQueue"
                :key="item.id"
                class="rounded-xl border border-zinc-200 bg-white p-3.5 shadow-2xs flex items-center justify-between gap-3"
              >
                <div class="flex items-center gap-3 min-w-0 flex-1">
                  <div class="w-11 h-11 rounded-lg bg-zinc-100 border border-zinc-200 overflow-hidden shrink-0 flex items-center justify-center">
                    <img v-if="item.previewUrl" :src="item.previewUrl" class="w-full h-full object-cover" alt="preview" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-xs font-semibold text-zinc-900 truncate" :title="item.name">{{ item.name }}</p>
                    <p class="text-[11px] text-zinc-400 mt-0.5">{{ formatBytes(item.size) }}</p>
                  </div>
                </div>

                <!-- Status Badge or Remove Button -->
                <div class="flex items-center gap-2 shrink-0">
                  <span v-if="item.status === 'uploading'" class="text-[11px] font-medium text-zinc-500 flex items-center gap-1">
                    <AppSpinner size="sm" />
                    {{ item.progress }}%
                  </span>
                  <span v-else-if="item.status === 'success'" class="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Ready
                  </span>
                  <span v-else-if="item.status === 'error'" class="text-[11px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                    Failed
                  </span>

                  <button
                    v-if="!isUploading"
                    type="button"
                    @click="removeQueueItem(item.id)"
                    class="w-7 h-7 rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>


          <!-- Submit Batch Button -->
          <button
            v-if="fileQueue.length > 0 && !completedBatch"
            type="button"
            @click="startBatchUpload"
            :disabled="isUploading"
            class="w-full rounded-xl py-3.5 text-sm font-bold text-white bg-zinc-900 hover:bg-zinc-800 active:scale-[0.99] shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            <AppSpinner v-if="isUploading" size="sm" />
            <span>
              {{ isUploading ? (locale === 'th' ? 'กำลังอัปโหลดรูปภาพ…' : 'Uploading images…') : (locale === 'th' ? `อัปโหลดทั้งหมด (${fileQueue.length} รูป)` : `Upload All (${fileQueue.length} images)`) }}
            </span>
          </button>

        </div>

      </div>

      <!-- Right Column: Sidebar (Quota Details) -->
      <div class="lg:col-span-5 space-y-6 text-left">
        <!-- If logged in: Quota and Plan Details -->
        <div v-if="user" class="rounded-2xl border border-zinc-200 bg-white p-6 shadow-card space-y-5">
          <div class="flex items-center justify-between border-b border-zinc-100 pb-4">
            <div>
              <p class="text-[12px] text-zinc-400 mb-0.5">{{ $t('dashboard.stats.currentPlan') }}</p>
              <p class="text-[16px] font-bold text-zinc-900">{{ user.plan }}</p>
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
                <span class="text-[12px] text-zinc-500">{{ $t('dashboard.stats.storageUsed') }}</span>
                <span class="text-[12px] font-medium text-zinc-800">
                  {{ formatBytes(quota.used_storage_bytes) }}
                  <span class="text-zinc-400"> / {{ quota.storage_limit_bytes === -1 ? 'Unlimited' : formatBytes(quota.storage_limit_bytes) }}</span>
                </span>
              </div>
              <div class="h-2 rounded-full bg-zinc-100 border border-zinc-200 overflow-hidden">
                <div class="h-full rounded-full transition-all duration-500"
                  :class="storagePercent >= 90 ? 'bg-red-500' : storagePercent >= 70 ? 'bg-amber-500' : 'bg-zinc-900'"
                  :style="{ width: quota.storage_limit_bytes === -1 ? '0%' : `${storagePercent}%` }"
                />
              </div>
            </div>

            <!-- Usage: Images -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-[12px] text-zinc-500">{{ $t('dashboard.stats.totalFiles') }}</span>
                <span class="text-[12px] font-medium text-zinc-800">
                  {{ quota.image_count.toLocaleString() }}
                  <span class="text-zinc-400"> / {{ quota.max_images === 0 ? 'Unlimited' : quota.max_images.toLocaleString() }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- If guest: Benefits -->
        <div v-else class="rounded-2xl border border-zinc-200 bg-white p-6 shadow-card space-y-5">
          <div>
            <h3 class="text-[16px] font-semibold text-zinc-900">{{ $t('auth.register.title') }}</h3>
            <p class="text-[12.5px] text-zinc-500 mt-1 leading-relaxed">
              {{ $t('hero.subtitle') }}
            </p>
          </div>

          <div class="pt-2">
            <NuxtLink
              to="/auth/register"
              class="w-full flex items-center justify-center py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-[13px] font-semibold transition-all shadow-xs cursor-pointer"
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
import { formatBytes } from '~/utils/format'

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

interface FileQueueItem {
  id: string
  file: File
  name: string
  size: number
  previewUrl: string
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  result?: UploadResult
  errorMsg?: string
}

const config = useRuntimeConfig()
const { user, fetchMe, getToken } = useAuth()
const { success, error } = useToast()
const { t, locale } = useI18n()

const SITE_URL = 'https://pichost.io'
useSeoMeta({
  title: 'Bulk Upload Images — PicHost.io',
  description: 'Upload multiple JPEG, PNG, WebP, GIF images at once with PicHost.io free image hosting.',
})

useHead({
  htmlAttrs: {
    lang: computed(() => locale.value)
  },
  link: [{ rel: 'canonical', href: `${SITE_URL}/upload` }],
})

// File State
const fileInput = ref<HTMLInputElement | null>(null)
const dropzone = ref<HTMLDivElement | null>(null)
const fileQueue = ref<FileQueueItem[]>([])
const isDragging = ref(false)
const isPrivate = ref(false)

// Upload Batch State
const isUploading = ref(false)
const completedBatch = ref(false)

const quota = ref<{
  plan: string
  used_storage_bytes: number
  storage_limit_bytes: number
  image_count: number
  max_images: number
  file_size_limit_bytes: number
  allow_private: boolean
} | null>(null)

const maxFileSizeText = computed(() => {
  if (quota.value?.file_size_limit_bytes && quota.value.file_size_limit_bytes > 0) {
    return formatBytes(quota.value.file_size_limit_bytes)
  }
  return user.value ? '10 MB' : '5 MB'
})

const planBadge = computed((): { class: string; dot: string } => {
  const map: Record<string, { class: string; dot: string }> = {
    Free:       { class: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
    Basic:      { class: 'bg-amber-50 text-amber-700 border-amber-200',    dot: 'bg-amber-500' },
    Pro:        { class: 'bg-zinc-100 text-zinc-800 border-zinc-300',      dot: 'bg-zinc-800' },
    Enterprise: { class: 'bg-red-50 text-red-700 border-red-200',          dot: 'bg-red-500' },
  }
  return map[user.value?.plan ?? 'Free'] ?? map['Free']!
})

const storagePercent = computed(() => {
  if (!quota.value || quota.value.storage_limit_bytes <= 0) return 0
  return Math.min(Math.round((quota.value.used_storage_bytes / quota.value.storage_limit_bytes) * 100), 100)
})

const successCount = computed(() => fileQueue.value.filter((i) => i.status === 'success').length)
const completedCount = computed(() => fileQueue.value.filter((i) => i.status === 'success' || i.status === 'error').length)

const overallProgress = computed(() => {
  if (fileQueue.value.length === 0) return 0
  const total = fileQueue.value.reduce((sum, i) => sum + i.progress, 0)
  return Math.min(100, Math.round(total / fileQueue.value.length))
})

onMounted(async () => {
  const me = await fetchMe()
  if (me) {
    try {
      const res = await apiFetch<{ data: any }>('/auth/quota')
      quota.value = res.data
    } catch {}
  }
})

onUnmounted(() => {
  fileQueue.value.forEach((item) => {
    if (item.previewUrl) URL.revokeObjectURL(item.previewUrl)
  })
})

function triggerFilePicker() {
  fileInput.value?.click()
}

function onFileChange(e: Event) {
  const inputFiles = Array.from((e.target as HTMLInputElement).files || [])
  if (inputFiles.length > 0) addFilesToQueue(inputFiles)
  if (fileInput.value) fileInput.value.value = ''
}

function onDrop(e: DragEvent) {
  isDragging.value = false
  const droppedFiles = Array.from(e.dataTransfer?.files || []).filter((f) => f.type.startsWith('image/'))
  if (droppedFiles.length === 0) {
    error(locale.value === 'th' ? 'กรุณาเลือกไฟล์รูปภาพเท่านั้น' : 'Please select image files only.')
    return
  }
  addFilesToQueue(droppedFiles)
}

function addFilesToQueue(filesList: File[]) {
  const newItems: FileQueueItem[] = filesList.map((file) => ({
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    file,
    name: file.name,
    size: file.size,
    previewUrl: URL.createObjectURL(file),
    status: 'pending',
    progress: 0,
  }))

  fileQueue.value.push(...newItems)
}

function removeQueueItem(id: string) {
  const index = fileQueue.value.findIndex((i) => i.id === id)
  if (index !== -1) {
    if (fileQueue.value[index].previewUrl) {
      URL.revokeObjectURL(fileQueue.value[index].previewUrl)
    }
    fileQueue.value.splice(index, 1)
  }
}

function clearQueue() {
  fileQueue.value.forEach((i) => {
    if (i.previewUrl) URL.revokeObjectURL(i.previewUrl)
  })
  fileQueue.value = []
}

async function apiFetch<T>(path: string, options: any = {}): Promise<T> {
  const token = getToken()
  return $fetch<T>(`${config.public.apiBase}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
}

async function startBatchUpload() {
  if (isUploading.value || fileQueue.value.length === 0) return
  isUploading.value = true
  completedBatch.value = false

  const concurrency = 2
  const queue = [...fileQueue.value]

  async function worker() {
    while (queue.length > 0) {
      const item = queue.shift()
      if (!item) break

      item.status = 'uploading'
      item.progress = 10

      try {
        const fd = new FormData()
        fd.append('file', item.file)

        let res: ApiResponse<UploadResult>
        if (user.value) {
          fd.append('is_private', isPrivate.value ? 'true' : 'false')
          res = await uploadFileWithProgress<ApiResponse<UploadResult>>('/storage/upload-file', fd, (pct) => {
            item.progress = pct
          })
        } else {
          res = await uploadFileWithProgress<ApiResponse<UploadResult>>('/storage/upload-file-guest', fd, (pct) => {
            item.progress = pct
          })
        }

        item.progress = 100
        item.status = 'success'
        item.result = res.data
      } catch (err: any) {
        item.status = 'error'
        item.progress = 0
        const body = err?.data
        let rawMsg = body?.data?.error || body?.message || err?.message || ''
        let msg = rawMsg || 'Upload failed'
        if (rawMsg === 'too_many_requests' || err?.status === 429 || err?.statusCode === 429) {
          msg = locale.value === 'th'
            ? 'คุณทำการอัปโหลดถี่เกินไป กรุณารอสักครู่แล้วลองใหม่อีกครั้ง'
            : 'Too many upload requests. Please wait a moment and try again.'
        } else if (rawMsg === 'image-file-too-large' || err?.status === 413 || err?.statusCode === 413) {
          msg = locale.value === 'th'
            ? 'ไฟล์มีขนาดใหญ่เกินขีดจำกัดของแพ็กเกจ (กรุณาย่อขนาดไฟล์ หรืออัปเกรดแพ็กเกจ)'
            : 'File size exceeds your plan limit. Please upgrade to upload larger files.'
        } else if (rawMsg === 'image-mime-type-not-allowed') {
          msg = locale.value === 'th'
            ? 'นามสกุล/ประเภทไฟล์นี้ยังไม่รองรับในแพ็กเกจปัจจุบัน'
            : 'File format not supported on your current plan.'
        }
        item.errorMsg = msg
      }
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, fileQueue.value.length) }, () => worker())
  await Promise.all(workers)

  isUploading.value = false
  completedBatch.value = true

  // Refresh quota if logged in
  if (user.value) {
    try {
      const res = await apiFetch<{ data: any }>('/auth/quota')
      quota.value = res.data
    } catch {}
  }
}

function copySingleLink(url: string) {
  navigator.clipboard.writeText(url)
  success(locale.value === 'th' ? 'คัดลอกลิงก์เรียบร้อยแล้ว' : 'Link copied to clipboard')
}

function copyAllLinks(type: 'direct' | 'markdown' | 'html') {
  const successfulResults = fileQueue.value.filter((i) => i.status === 'success' && i.result?.public_url)
  if (successfulResults.length === 0) return

  let text = ''
  if (type === 'direct') {
    text = successfulResults.map((i) => i.result!.public_url).join('\n')
  } else if (type === 'markdown') {
    text = successfulResults.map((i) => `![${i.name}](${i.result!.public_url})`).join('\n')
  } else if (type === 'html') {
    text = successfulResults.map((i) => `<img src="${i.result!.public_url}" alt="${i.name}" />`).join('\n')
  }

  navigator.clipboard.writeText(text)
  success(locale.value === 'th' ? `คัดลอก ${successfulResults.length} ลิงก์เรียบร้อยแล้ว` : `Copied ${successfulResults.length} links to clipboard`)
}

function resetAll() {
  clearQueue()
  completedBatch.value = false
  isUploading.value = false
  isPrivate.value = false
}
</script>
