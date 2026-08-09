<template>
  <div class="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
          <span>🛡️</span>
          <span>Content Moderation (จัดการรูปภาพ)</span>
        </h1>
        <p class="text-xs text-white/40 mt-1">ตรวจสอบรูปภาพที่อัปโหลดเข้าสู่ระบบ ลบรูปภาพผิดกฎ หรือระงับบัญชีผู้ใช้</p>
      </div>
      <button
        @click="fetchImages"
        class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-medium text-white/80 transition"
      >
        <svg class="w-3.5 h-3.5" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        <span>รีเฟรช</span>
      </button>
    </div>

    <!-- Images Grid -->
    <div v-if="loading" class="text-center py-20 text-white/40 text-xs">
      กำลังโหลดรูปภาพ...
    </div>
    <div v-else-if="images.length === 0" class="text-center py-20 text-white/40 text-xs">
      ไม่พบรูปภาพในระบบ
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div
        v-for="img in images"
        :key="img.id"
        class="group relative rounded-2xl bg-white/[0.025] border border-white/[0.06] overflow-hidden flex flex-col justify-between transition hover:border-white/[0.15]"
      >
        <!-- Thumbnail / Preview container -->
        <div class="relative aspect-video bg-black/40 overflow-hidden flex items-center justify-center">
          <img
            :src="getImageUrl(img)"
            :alt="img.id"
            class="w-full h-full object-cover transition duration-300 group-hover:scale-105"
            @error="onImageError"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition flex items-end justify-between p-3">
            <span class="text-[10px] font-mono text-white/80 px-2 py-0.5 rounded bg-black/60 backdrop-blur">
              {{ img.is_private ? '🔒 Private' : '🌐 Public' }}
            </span>
            <button
              @click="previewImage(img)"
              class="px-2 py-1 rounded bg-white/20 hover:bg-white/30 text-white text-[10px] font-medium backdrop-blur transition"
            >
              ดูรูปเต็ม
            </button>
          </div>
        </div>

        <!-- Meta info -->
        <div class="p-3 space-y-1.5 text-xs">
          <div class="flex items-center justify-between">
            <span class="text-[10px] text-white/40 font-mono">ID: {{ img.id.slice(0, 8) }}...</span>
            <span class="text-[10.5px] text-white/50">{{ formatDate(img.created_at) }}</span>
          </div>

          <div v-if="img.user_id" class="flex items-center justify-between text-[11px]">
            <span class="text-white/60 truncate">User ID: {{ img.user_id.slice(0, 8) }}...</span>
            <button
              @click="banUser(img.user_id)"
              class="text-red-400 hover:text-red-300 text-[10px] underline font-medium"
            >
              แบนผู้ใช้
            </button>
          </div>
          <div v-else class="text-[11px] text-amber-400/80 font-medium">
            👤 Guest Upload
          </div>
        </div>

        <!-- Actions Footer -->
        <div class="p-3 pt-0 border-t border-white/[0.04] flex items-center justify-end">
          <button
            @click="confirmDeleteImage(img)"
            class="w-full py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-[11px] font-medium transition flex items-center justify-center gap-1.5"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
            <span>ลบรูปภาพ</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="total > limit" class="p-4 rounded-2xl bg-white/[0.025] border border-white/[0.06] flex items-center justify-between text-xs text-white/40">
      <span>แสดง {{ (page - 1) * limit + 1 }} - {{ Math.min(page * limit, total) }} จาก {{ total }} รูป</span>
      <div class="flex items-center gap-2">
        <button
          :disabled="page <= 1"
          @click="page--; fetchImages()"
          class="px-3 py-1 rounded-lg bg-white/[0.05] disabled:opacity-30 text-white hover:bg-white/[0.1]"
        >
          ย้อนกลับ
        </button>
        <span class="text-white/70">{{ page }}</span>
        <button
          :disabled="page * limit >= total"
          @click="page++; fetchImages()"
          class="px-3 py-1 rounded-lg bg-white/[0.05] disabled:opacity-30 text-white hover:bg-white/[0.1]"
        >
          ถัดไป
        </button>
      </div>
    </div>

    <!-- Full Image Preview Modal -->
    <Teleport to="body">
      <div v-if="selectedImg" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" @click.self="selectedImg = null">
        <div class="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
          <img :src="getImageUrl(selectedImg)" class="max-w-full max-h-[80vh] rounded-2xl border border-white/20 shadow-2xl object-contain" />
          <div class="mt-4 flex items-center gap-3">
            <button @click="selectedImg = null" class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-white">
              ปิด
            </button>
            <button @click="confirmDeleteImage(selectedImg); selectedImg = null" class="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs border border-red-500/30">
              ลบรูปนี้ทันที
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

const { apiFetch } = useApi()

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
    const res = await apiFetch<any>('/api/v1/admin/images', {
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
    await apiFetch(`/api/v1/admin/images/${img.id}`, { method: 'DELETE' })
    fetchImages()
  } catch (e) {
    alert('เกิดข้อผิดพลาดในการลบรูปภาพ')
  }
}

async function banUser(userId: string) {
  if (!confirm(`คุณต้องการระงับบัญชีผู้ใช้ ID: ${userId} หรือไม่?`)) return
  try {
    await apiFetch(`/api/v1/admin/users/${userId}/active`, {
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
