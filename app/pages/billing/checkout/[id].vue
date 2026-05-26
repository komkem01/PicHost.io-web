<script setup lang="ts">
import type { BankInfo, PaymentTransaction } from '~/composables/useBilling'

const route = useRoute()
const router = useRouter()
const { fetchMe } = useAuth()
const { getPayment, getPaymentMethods } = useBilling()
const toast = useToast?.() ?? null

const payment = ref<PaymentTransaction | null>(null)
const bankInfo = ref<BankInfo | null>(null)
const loading = ref(true)
const error = ref('')

async function load() {
  try {
    const [p, b] = await Promise.all([
      getPayment(route.params.id as string),
      getPaymentMethods(),
    ])
    if (p.status !== 'pending') {
      router.replace(`/billing/payments/${p.id}`)
      return
    }
    payment.value = p
    bankInfo.value = b
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

function goUploadSlip() {
  router.push(`/billing/slip/${payment.value!.id}`)
}

function goBack() {
  router.push('/settings/account?tab=plan')
}

const planName = computed(() => {
  const meta = payment.value?.metadata as Record<string, string> | undefined
  return meta?.plan_display_name ?? payment.value?.plan_key ?? ''
})
const amountText = computed(() => `฿${payment.value?.amount_thb?.toLocaleString() ?? 0} THB`)
</script>

<template>
  <div class="min-h-dvh w-full flex flex-col items-center justify-start pt-8 sm:pt-12 pb-10 sm:pb-16 px-4 sm:px-6 overflow-x-hidden"
    style="background:#09090b">
    <div class="w-full max-w-2xl">
      <!-- Back -->
      <button class="mb-6 flex items-center gap-1 text-sm text-white/50 hover:text-white/80 transition-colors"
        @click="goBack">
        ← Back to Plan
      </button>

      <!-- Loading -->
      <div v-if="loading" class="text-center text-white/50 py-16">Loading…</div>

      <!-- Error -->
      <div v-else-if="error" class="text-center text-red-400 py-16">{{ error }}</div>

      <template v-else-if="payment && bankInfo">
        <!-- Header -->
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-white">ยืนยันการชำระเงิน</h1>
          <p class="text-white/50 mt-1 text-sm">กรุณาโอนเงินตามช่องทางด้านล่าง แล้วอัปโหลดสลิปในขั้นตอนถัดไป</p>
        </div>

        <!-- Order summary -->
        <div class="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 sm:p-5 mb-4">
          <p class="text-white/50 text-xs uppercase tracking-wide mb-3">สรุปคำสั่งซื้อ</p>
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p class="text-white font-semibold text-lg">{{ planName }} Plan</p>
              <p class="text-white/40 text-sm">รายเดือน</p>
            </div>
            <p class="text-2xl font-bold text-blue-400">{{ amountText }}</p>
          </div>
        </div>

        <!-- Bank info -->
        <div class="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 sm:p-5 mb-4">
          <p class="text-white/50 text-xs uppercase tracking-wide mb-4">ช่องทางการชำระเงิน</p>

          <!-- Bank transfer -->
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <div v-if="bankInfo.bank_logo_url"
                class="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                <img :src="bankInfo.bank_logo_url" alt="bank logo" class="w-full h-full object-contain" />
              </div>
              <div v-else
                class="w-10 h-10 rounded-xl bg-white/[0.07] flex items-center justify-center flex-shrink-0 text-white/40">
                🏦
              </div>
              <div>
                <p class="text-white font-medium">{{ bankInfo.bank_name }}</p>
                <p class="text-white/50 text-sm">{{ bankInfo.bank_account_type === 'savings' ? 'บัญชีออมทรัพย์' : bankInfo.bank_account_type }}</p>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              <div class="rounded-xl bg-white/[0.04] border border-white/[0.06] p-3">
                <p class="text-white/40 text-xs mb-1">ชื่อบัญชี</p>
                <p class="text-white text-sm font-medium">{{ bankInfo.bank_account_name }}</p>
              </div>
              <div class="rounded-xl bg-white/[0.04] border border-white/[0.06] p-3">
                <p class="text-white/40 text-xs mb-1">เลขบัญชี</p>
                <p class="text-white text-sm font-mono font-bold tracking-wider">{{ bankInfo.bank_account_number }}</p>
              </div>
            </div>
          </div>

          <!-- PromptPay divider -->
          <template v-if="bankInfo.prompt_pay_id">
            <div class="my-4 border-t border-white/[0.06]" />
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-xl bg-white/[0.07] flex items-center justify-center flex-shrink-0 text-white/40">
                📱
              </div>
              <div>
                <p class="text-white font-medium">PromptPay</p>
                <p class="text-white/50 text-sm font-mono">{{ bankInfo.prompt_pay_id }}</p>
              </div>
            </div>
          </template>
        </div>

        <!-- Amount reminder -->
        <div class="rounded-xl border border-yellow-500/20 bg-yellow-500/[0.05] p-4 mb-6 flex items-start gap-3">
          <span class="text-yellow-400 text-lg mt-0.5">⚠</span>
          <p class="text-yellow-300/80 text-sm leading-relaxed">
            กรุณาโอนยอดเงินที่ถูกต้อง <strong class="text-yellow-300">{{ amountText }}</strong>
            หากโอนผิดจำนวน ระบบอาจตรวจสอบนานขึ้น
          </p>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-3">
          <button
            class="w-full sm:flex-1 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold transition-colors"
            @click="goUploadSlip">
            โอนแล้ว — อัปโหลดสลิป →
          </button>
          <button
            class="w-full sm:w-auto sm:px-6 py-3 rounded-xl border border-white/[0.08] text-white/60 hover:text-white hover:border-white/20 text-sm transition-colors"
            @click="goBack">
            ยกเลิก
          </button>
        </div>
      </template>
    </div>
  </div>
</template>
