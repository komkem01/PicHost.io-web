<template>
  <div class="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
          <svg class="w-5 h-5 text-zinc-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.959 11.959 0 0 1 12 2.714Z" />
          </svg>
          <span>{{ $t('admin.images.title') }}</span>
        </h1>
        <p class="text-xs text-zinc-500 mt-1">{{ $t('admin.images.subtitle') }}</p>
      </div>
      <button
        @click="fetchImages"
        class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-700 transition shadow-xs"
      >
        <svg class="w-3.5 h-3.5 text-zinc-500" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        <span>{{ $t('common.refresh') }}</span>
      </button>
    </div>

    <!-- Images Grid -->
    <div v-if="loading" class="text-center py-20 text-zinc-400 text-xs">
      {{ $t('admin.images.loading') }}
    </div>
    <div v-else-if="images.length === 0" class="text-center py-20 text-zinc-400 text-xs">
      {{ $t('admin.images.empty') }}
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div
        v-for="img in images"
        :key="img.id"
        class="group relative rounded-2xl bg-white border border-zinc-200 shadow-card overflow-hidden flex flex-col justify-between transition hover:border-zinc-300"
      >
        <!-- Thumbnail / Preview container -->
        <div class="relative aspect-video bg-zinc-100 overflow-hidden flex items-center justify-center">
          <img
            :src="getImageUrl(img)"
            :alt="img.id"
            class="w-full h-full object-cover transition duration-300 group-hover:scale-105"
            @error="onImageError"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent opacity-0 group-hover:opacity-100 transition flex items-end justify-between p-3">
            <span class="inline-flex items-center gap-1 text-[10px] font-mono text-white px-2 py-0.5 rounded bg-zinc-900/70 backdrop-blur-xs">
              <svg v-if="img.is_private" class="w-3 h-3 text-amber-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
              <svg v-else class="w-3 h-3 text-emerald-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.949 8.949 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              {{ img.is_private ? $t('admin.images.private') : $t('admin.images.public') }}
            </span>
            <button
              @click="previewImage(img)"
              class="px-2.5 py-1 rounded-lg bg-white/90 hover:bg-white text-zinc-900 text-[10.5px] font-semibold backdrop-blur-xs transition shadow-xs"
            >
              {{ $t('admin.images.viewFull') }}
            </button>
          </div>
        </div>

        <!-- Meta info -->
        <div class="p-3 space-y-1.5 text-xs">
          <div class="flex items-center justify-between">
            <span class="text-[10px] text-zinc-400 font-mono">ID: {{ img.id.slice(0, 8) }}...</span>
            <span class="text-[10.5px] text-zinc-500 tabular-nums">{{ formatDate(img.created_at) }}</span>
          </div>

          <div v-if="img.user_id" class="flex items-center justify-between text-[11px]">
            <span class="text-zinc-600 truncate">User ID: {{ img.user_id.slice(0, 8) }}...</span>
            <button
              @click="banUser(img.user_id)"
              class="text-red-600 hover:text-red-700 text-[10px] underline font-medium"
            >
              {{ $t('admin.images.banUser') }}
            </button>
          </div>
          <div v-else class="text-[11px] text-amber-700 font-medium inline-flex items-center gap-1">
            <svg class="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            <span>{{ $t('admin.images.guestUpload') }}</span>
          </div>
        </div>

        <!-- Actions Footer -->
        <div class="p-3 pt-0 border-t border-zinc-100 flex items-center justify-end">
          <button
            @click="confirmDeleteImage(img)"
            class="w-full py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-[11px] font-medium transition flex items-center justify-center gap-1.5"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
            <span>{{ $t('admin.images.deleteImage') }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="rounded-2xl bg-white border border-zinc-200 shadow-card overflow-hidden">
      <AppPagination
        v-model:page="page"
        :total="total"
        :limit="limit"
        @change="fetchImages"
      />
    </div>

    <!-- Full Image Preview Modal -->
    <Teleport to="body">
      <div v-if="selectedImg" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs" @click.self="selectedImg = null">
        <div class="relative max-w-4xl max-h-[90vh] flex flex-col items-center p-4 rounded-2xl bg-white border border-zinc-200 shadow-modal">
          <img :src="getImageUrl(selectedImg)" class="max-w-full max-h-[75vh] rounded-xl border border-zinc-200 object-contain" />
          <div class="mt-4 flex items-center gap-3">
            <button @click="selectedImg = null" class="px-4 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-700">
              {{ $t('admin.images.close') }}
            </button>
            <button @click="confirmDeleteImage(selectedImg); selectedImg = null" class="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold">
              {{ $t('admin.images.deleteNow') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})


interface ImageItem {
  id: string
  user_id?: string
  storage_id: string
  is_private: boolean
  created_at: string
}

const images = ref<ImageItem[]>([])
const total = ref(0)
const page = ref(1)
const limit = ref(24)
const loading = ref(false)
const selectedImg = ref<ImageItem | null>(null)

async function fetchImages() {
  loading.value = true
  try {
    const res = await apiFetch<any>('/admin/images', {
      params: { page: page.value, limit: limit.value }
    })
    if (res.data) {
      images.value = res.data.items || []
      total.value = res.data.total || 0
    }
  } catch (e) {
    console.error('Failed to load images:', e)
  } finally {
    loading.value = false
  }
}

function getImageUrl(img: ImageItem) {
  return `/i/${img.id}`
}

function onImageError(e: Event) {
  const target = e.target as HTMLImageElement
  target.src = 'https://via.placeholder.com/300x200?text=No+Preview'
}

function previewImage(img: ImageItem) {
  selectedImg.value = img
}

function formatDate(iso: string) {
  if (!iso) return '-'
  return new Date(iso).toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

async function confirmDeleteImage(img: ImageItem) {
  if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบรูปภาพ ID: ${img.id} ?`)) return
  try {
    await apiFetch(`/admin/images/${img.id}`, { method: 'DELETE' })
    fetchImages()
  } catch (e) {
    alert('เกิดข้อผิดพลาดในการลบรูปภาพ')
  }
}

async function banUser(userId: string) {
  if (!confirm(`คุณต้องการระงับบัญชีผู้ใช้ ID: ${userId} หรือไม่?`)) return
  try {
    await apiFetch(`/admin/users/${userId}/active`, {
      method: 'PATCH',
      body: { is_active: false }
    })
    alert('ระงับบัญชีผู้ใช้เรียบร้อยแล้ว')
  } catch (e) {
    alert('เกิดข้อผิดพลาดในการระงับบัญชี')
  }
}

onMounted(() => {
  fetchImages()
})
</script>
