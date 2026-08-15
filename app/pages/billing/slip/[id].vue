<script setup lang="ts">
import { formatCurrency } from '~/utils/format'
import type { PublicPlanSetting } from '~/composables/useBilling'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const { fetchMe } = useAuth()
const { listPublicPlans, createCheckout, submitSlip } = useBilling()
const { t, locale } = useI18n()

useHead({
  htmlAttrs: {
    lang: computed(() => locale.value)
  }
})

const plan = ref<PublicPlanSetting | null>(null)
const loading = ref(true)
const uploading = ref(false)
const error = ref('')
const selectedFile = ref<File | null>(null)
const previewURL = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const planKey = computed(() => String(route.params.id ?? '').trim().toLowerCase())

async function load() {
  try {
    const plans = await listPublicPlans()
    const found = plans.find((p) => p.plan_key.toLowerCase() === planKey.value)
    if (!found) {
      error.value = t('common.error')
      return
    }
    plan.value = found
  } catch (err) {
    error.value = t('common.error')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchMe()
  load()
})

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    error.value = t('billing.slip.errFileType')
    return
  }
  if (file.size > 10 * 1024 * 1024) {
    error.value = t('billing.slip.errFileSize')
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
  if (!selectedFile.value || !plan.value) return
  uploading.value = true
  error.value = ''
  
  let paymentId = ''
  try {
    const checkout = await createCheckout(plan.value.plan_key)
    paymentId = checkout.id

    const formData = new FormData()
    formData.append('file', selectedFile.value)
    const uploadRes = await $fetch<{ data: { id: string } }>(
      `${config.public.storagesServiceUrl}/storages/upload`,
      { method: 'POST', body: formData },
    )
    const storageId = uploadRes?.data?.id
    if (!storageId) throw new Error('upload failed: no id returned')

    await submitSlip(paymentId, storageId)
    router.push(`/billing/payments/${paymentId}`)
  } catch (e: unknown) {
    const msg = (e as { data?: { message?: string } })?.data?.message
    error.value = msg ?? t('common.error')
  } finally {
    uploading.value = false
  }
}

const planName = computed(() => plan.value?.display_name ?? '')
const priceText = computed(() => formatCurrency(plan.value?.monthly_price_thb ?? 0, locale.value))
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-start pt-16 pb-24 px-4 bg-[#FAFAFA] text-zinc-900 font-sans">
    <div class="w-full max-w-7xl">
      <!-- Back -->
      <div class="flex items-center justify-between mb-6">
        <button
          class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-white border border-transparent hover:border-zinc-200 transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
          @click="router.push(`/billing/checkout/${planKey}`)">
          <svg class="w-4 h-4 text-zinc-400 group-hover:text-zinc-800 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>{{ $t('common.back') }}</span>
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center text-zinc-400 py-16">{{ $t('common.loading') }}</div>

      <!-- Error only state (plan not found) -->
      <div v-else-if="error && !plan" class="text-center text-red-600 py-16">{{ error }}</div>

      <template v-else-if="plan">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <!-- Left Column -->
          <div class="lg:col-span-7 space-y-4">
            <div class="mb-6">
              <h1 class="text-2xl font-bold text-zinc-900">{{ $t('billing.slip.title') }}</h1>
              <p class="text-zinc-500 mt-1 text-sm">
                {{ planName }} —
                {{ priceText }}
              </p>
            </div>

            <!-- Upload zone -->
            <div class="rounded-2xl border border-zinc-200 bg-white p-6 shadow-card mb-4">
              <!-- Preview -->
              <div v-if="previewURL" class="relative mb-4">
                <img :src="previewURL" alt="slip preview"
                  class="w-full max-h-72 object-contain rounded-xl border border-zinc-200" />
                <button
                  class="absolute top-2 right-2.5 w-7 h-7 rounded-full bg-zinc-900/80 border border-zinc-700 text-white hover:bg-zinc-900 text-sm flex items-center justify-center cursor-pointer shadow-xs"
                  @click="removeFile">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <!-- Drop zone -->
              <label v-else
                class="flex flex-col items-center justify-center gap-3 py-10 rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 hover:bg-zinc-100/50 hover:border-zinc-400 cursor-pointer transition-colors group">
                <div class="w-12 h-12 rounded-2xl bg-zinc-100 border border-zinc-200/80 text-zinc-400 group-hover:text-zinc-700 group-hover:border-zinc-300 flex items-center justify-center transition-all shadow-2xs">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span class="text-zinc-700 text-sm font-medium">
                  {{ $t('upload.dropzoneText') }}
                </span>
                <span class="text-zinc-400 text-xs">{{ $t('billing.slip.dropzoneHint') }}</span>
                <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />
              </label>
            </div>

            <!-- Error -->
            <p v-if="error" class="text-red-600 text-sm mb-4">{{ error }}</p>
          </div>

          <!-- Right Column -->
          <div class="lg:col-span-5 space-y-4 lg:pt-[84px]">
            <!-- Actions -->
            <div class="flex flex-col gap-3">
              <button
                :disabled="!selectedFile || uploading"
                class="w-full py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                :class="selectedFile && !uploading
                  ? 'bg-zinc-900 hover:bg-zinc-800 text-white'
                  : 'bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-not-allowed'"
                @click="handleSubmit">
                <AppSpinner v-if="uploading" size="md" />
                {{ uploading ? $t('common.loading') : $t('billing.slip.submitBtn') }}
              </button>
              <button
                class="w-full py-3 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-sm font-medium transition-colors shadow-xs cursor-pointer"
                @click="router.push(`/billing/checkout/${planKey}`)">
                {{ $t('common.back') }}
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
