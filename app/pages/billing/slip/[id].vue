<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

import type { PublicPlanSetting } from '~/composables/useBilling'

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
    error.value = 'Please select an image file.'
    return
  }
  if (file.size > 10 * 1024 * 1024) {
    error.value = 'File size must not exceed 10 MB'
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
  <div class="min-h-screen flex flex-col items-center justify-start pt-16 pb-24 px-4"
    style="background:#09090b">
    <div class="w-full max-w-7xl">
      <!-- Back -->
      <div class="flex items-center justify-between mb-6">
        <button
          class="flex items-center gap-1 text-sm text-white/50 hover:text-white/80 transition-colors"
          @click="router.push(`/billing/checkout/${planKey}`)">
          ← {{ $t('common.back') }}
        </button>
        <LanguageSwitcher />
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center text-white/50 py-16">{{ $t('common.loading') }}</div>

      <!-- Error only state (plan not found) -->
      <div v-else-if="error && !plan" class="text-center text-red-400 py-16">{{ error }}</div>

      <template v-else-if="plan">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <!-- Left Column -->
          <div class="lg:col-span-7 space-y-4">
            <div class="mb-6">
              <h1 class="text-2xl font-bold text-white">{{ $t('billing.slip.title') }}</h1>
              <p class="text-white/50 mt-1 text-sm">
                {{ planName }} —
                {{ priceText }}
              </p>
            </div>

            <!-- Upload zone -->
            <div class="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 mb-4">
              <!-- Preview -->
              <div v-if="previewURL" class="relative mb-4">
                <img :src="previewURL" alt="slip preview"
                  class="w-full max-h-72 object-contain rounded-xl border border-white/[0.08]" />
                <button
                  class="absolute top-2 right-2.5 w-7 h-7 rounded-full bg-black/60 border border-white/20 text-white/70 hover:text-white text-sm flex items-center justify-center"
                  @click="removeFile">
                  ✕
                </button>
              </div>

              <!-- Drop zone -->
              <label v-else
                class="flex flex-col items-center justify-center gap-3 py-10 rounded-xl border-2 border-dashed border-white/[0.12] hover:border-blue-500/50 cursor-pointer transition-colors group">
                <span class="text-4xl opacity-40 group-hover:opacity-60 transition-opacity">🖼</span>
                <span class="text-white/50 text-sm group-hover:text-white/70 transition-colors">
                  {{ $t('upload.dropzoneText') }}
                </span>
                <span class="text-white/30 text-xs">JPG, PNG, WEBP (Max 10 MB)</span>
                <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />
              </label>
            </div>

            <!-- Error -->
            <p v-if="error" class="text-red-400 text-sm mb-4">{{ error }}</p>
          </div>

          <!-- Right Column -->
          <div class="lg:col-span-5 space-y-4 lg:pt-[84px]">
            <!-- Actions -->
            <div class="flex flex-col gap-3">
              <button
                :disabled="!selectedFile || uploading"
                class="w-full py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                :class="selectedFile && !uploading
                  ? 'bg-blue-500 hover:bg-blue-400 text-white'
                  : 'bg-white/[0.06] text-white/30 cursor-not-allowed'"
                @click="handleSubmit">
                <svg v-if="uploading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                {{ uploading ? $t('common.loading') : $t('billing.slip.submitBtn') }}
              </button>
              <button
                class="w-full py-3 rounded-xl border border-white/[0.08] text-white/60 hover:text-white hover:border-white/20 text-sm transition-colors"
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
