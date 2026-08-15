<template>
  <div class="min-h-screen bg-[#FAFAFA] text-zinc-900 font-sans flex items-center justify-center px-6">
    <div class="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 text-center shadow-card">
      <div class="mx-auto mb-4 w-10 h-10 rounded-full border-2 border-zinc-900/20 border-t-zinc-900 animate-spin" />
      <h1 class="text-[18px] font-semibold text-zinc-900">Opening payment status…</h1>
      <p class="text-[13px] text-zinc-500 mt-2">Resolving checkout reference {{ reference }}</p>
      <p v-if="errorText" class="text-[12px] text-red-600 mt-3 font-medium">{{ errorText }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const route = useRoute()
const router = useRouter()
const { error: toastError } = useToast()
const { fetchMe } = useAuth()
const { listMyPayments } = useBilling()

const errorText = ref('')
const reference = computed(() => String(route.params.reference ?? '').trim().toUpperCase())

onMounted(async () => {
  await fetchMe()

  try {
    const rows = await listMyPayments(100)
    const found = rows.find((item) => (item.checkout_reference ?? '').toUpperCase() === reference.value)
    if (!found) {
      errorText.value = 'Payment not found for this reference.'
      toastError('Payment reference not found.')
      router.replace('/settings/account?tab=plan')
      return
    }

    router.replace(`/billing/payments/${found.id}`)
  } catch (err: any) {
    const msg = err?.data?.data?.error || err?.data?.message || 'Unable to open payment status.'
    errorText.value = msg
    toastError(msg)
    router.replace('/settings/account?tab=plan')
  }
})
</script>
