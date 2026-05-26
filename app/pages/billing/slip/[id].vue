<script setup lang="ts">
import type { PaymentTransaction } from '~/composables/useBilling'

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const { fetchMe } = useAuth()
const { getPayment, submitSlip } = useBilling()

const payment = ref<PaymentTransaction | null>(null)
const loading = ref(true)
const uploading = ref(false)
const error = ref('')
const selectedFile = ref<File | null>(null)
const previewURL = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

async function load() {
  try {
    const p = await getPayment(route.params.id as string)
    if (p.status !== 'pending') {
      router.replace(`/billing/payments/${p.id}`)
      return
    }
    if (p.slip_storage_id) {
      // already submitted
      router.replace(`/billing/payments/${p.id}`)
      return
    }
    payment.value = p
  } catch {
    error.value = 'ไม่พบรายการชำระเงิน'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  const me = await fetchMe()
  if (!me) { router.replace('/auth/login'); return }
  load()
})

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    error.value = 'กรุณาเลือกไฟล์รูปภาพเท่านั้น'
    return
  }
  if (file.size > 10 * 1024 * 1024) {
    error.value = 'ขนาดไฟล์ต้องไม่เกิน 10 MB'
    return
  }
  error.value = ''
  selectedFile.value = file
  previewURL.value = URL.createObjectURL(file)
}

function removeFile() {
  selectedFile.value = null
  if (previewURL.value) {
    URL.revokeObjectURL(previewURL.value)
    previewURL.value = null
  }
  if (fileInput.value) fileInput.value.value = ''
}

async function handleSubmit() {
  if (!selectedFile.value || !payment.value) return
  uploading.value = true
  error.value = ''
  try {
    // 1. Upload to external storages service
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    const uploadRes = await $fetch<{ data: { id: string } }>(
      `${config.public.storagesServiceUrl}/storages/upload`,
      { method: 'POST', body: formData },
    )
    const storageId = uploadRes?.data?.id
    if (!storageId) throw new Error('upload failed: no id returned')

    // 2. Store storage_id on the payment transaction
    await submitSlip(payment.value.id, storageId)

    // 3. Navigate to waiting page
    router.push(`/billing/payments/${payment.value.id}`)
  } catch (e: unknown) {
    const msg = (e as { data?: { message?: string } })?.data?.message
    error.value = msg ?? 'อัปโหลดไม่สำเร็จ กรุณาลองใหม่'
  } finally {
    uploading.value = false
  }
}

const planName = computed(() => {
  const meta = payment.value?.metadata as Record<string, string> | undefined
  return meta?.plan_display_name ?? payment.value?.plan_key ?? ''
})
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-start pt-16 pb-24 px-4"
    style="background:#09090b">
    <div class="w-full max-w-lg">
      <!-- Back -->
      <button
        class="mb-6 flex items-center gap-1 text-sm text-white/50 hover:text-white/80 transition-colors"
        @click="router.push(`/billing/checkout/${route.params.id}`)">
        ← Back
      </button>

      <!-- Loading -->
      <div v-if="loading" class="text-center text-white/50 py-16">Loading…</div>

      <!-- Error only state (payment not found) -->
      <div v-else-if="error && !payment" class="text-center text-red-400 py-16">{{ error }}</div>

      <template v-else-if="payment">
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-white">อัปโหลดสลิปการโอนเงิน</h1>
          <p class="text-white/50 mt-1 text-sm">
            แผน <span class="text-white font-medium">{{ planName }}</span> —
            ฿{{ payment.amount_thb.toLocaleString() }} THB
          </p>
        </div>

        <!-- Upload zone -->
        <div class="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 mb-4">
          <!-- Preview -->
          <div v-if="previewURL" class="relative mb-4">
            <img :src="previewURL" alt="slip preview"
              class="w-full max-h-72 object-contain rounded-xl border border-white/[0.08]" />
            <button
              class="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 border border-white/20 text-white/70 hover:text-white text-sm flex items-center justify-center"
              @click="removeFile">
              ✕
            </button>
          </div>

          <!-- Drop zone -->
          <label v-else
            class="flex flex-col items-center justify-center gap-3 py-10 rounded-xl border-2 border-dashed border-white/[0.12] hover:border-blue-500/50 cursor-pointer transition-colors group">
            <span class="text-4xl opacity-40 group-hover:opacity-60 transition-opacity">🖼</span>
            <span class="text-white/50 text-sm group-hover:text-white/70 transition-colors">
              คลิกหรือลากไฟล์รูปภาพมาวาง
            </span>
            <span class="text-white/30 text-xs">JPG, PNG, WEBP — ไม่เกิน 10 MB</span>
            <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />
          </label>
        </div>

        <!-- Error -->
        <p v-if="error" class="text-red-400 text-sm mb-4">{{ error }}</p>

        <!-- Note -->
        <div class="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 mb-6 text-white/40 text-sm leading-relaxed">
          หลังอัปโหลดสลิป ทีมงานจะตรวจสอบและอัปเกรดแผนของคุณภายใน 1–24 ชั่วโมง
        </div>

        <!-- Actions -->
        <div class="flex flex-col gap-3">
          <button
            :disabled="!selectedFile || uploading"
            class="w-full py-3 rounded-xl font-semibold transition-colors"
            :class="selectedFile && !uploading
              ? 'bg-blue-500 hover:bg-blue-400 text-white'
              : 'bg-white/[0.06] text-white/30 cursor-not-allowed'"
            @click="handleSubmit">
            {{ uploading ? 'กำลังอัปโหลด…' : 'ส่งสลิปการชำระเงิน' }}
          </button>
          <button
            class="w-full py-3 rounded-xl border border-white/[0.08] text-white/60 hover:text-white hover:border-white/20 text-sm transition-colors"
            @click="router.push(`/billing/checkout/${payment.id}`)">
            กลับ
          </button>
        </div>
      </template>
    </div>
  </div>
</template>
