<template>
  <div class="min-h-screen bg-[#FAFAFA] text-zinc-900 font-sans flex flex-col overflow-hidden">
    <!-- Main content -->
    <div class="flex-1 flex items-center justify-center px-4 py-12 pt-[88px]">
      <div class="w-full max-w-[420px]">

        <!-- Loading State -->
        <div v-if="verifying" class="rounded-2xl border border-zinc-200 bg-white p-8 text-center space-y-4 shadow-card">
          <div class="w-12 h-12 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto text-zinc-900">
            <svg class="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
          <h3 class="text-[18px] font-bold text-zinc-900">
            {{ locale === 'th' ? 'กำลังตรวจสอบการยืนยันอีเมล' : 'Verifying Email' }}
          </h3>
          <p class="text-[13.5px] text-zinc-500">
            {{ locale === 'th' ? 'กรุณารอสักครู่ ระบบกำลังยืนยันที่อยู่อีเมลของคุณ…' : 'Please wait while we confirm your email address…' }}
          </p>
        </div>

        <!-- Success State -->
        <div v-else-if="successState" class="rounded-2xl border border-emerald-200 bg-white p-8 text-center space-y-4 shadow-card">
          <div class="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="text-[18px] font-bold text-zinc-900">
            {{ locale === 'th' ? 'ยืนยันอีเมลสำเร็จ!' : 'Email Verified!' }}
          </h3>
          <p class="text-[13.5px] text-zinc-600 leading-relaxed">
            {{ locale === 'th' ? 'อีเมลของคุณได้รับการยืนยันเรียบร้อยแล้ว คุณสามารถอัปเกรดแพ็กเกจและใช้งานฟีเจอร์เต็มรูปแบบได้ทันที' : 'Your email address has been successfully verified. You now have full access to all PicHost.io features!' }}
          </p>
          <div class="pt-2">
            <NuxtLink to="/dashboard" class="inline-block w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-[13.5px] font-semibold transition-all shadow-xs cursor-pointer">
              {{ locale === 'th' ? 'ไปยังหน้าแดชบอร์ด' : 'Go to Dashboard' }}
            </NuxtLink>
          </div>
        </div>

        <!-- Error State -->
        <div v-else class="rounded-2xl border border-red-200 bg-white p-8 text-center space-y-4 shadow-card">
          <div class="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto text-red-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="text-[18px] font-bold text-zinc-900">
            {{ locale === 'th' ? 'การยืนยันอีเมลไม่สำเร็จ' : 'Verification Failed' }}
          </h3>
          <p class="text-[13.5px] text-zinc-600 leading-relaxed">
            {{ errorMessage || (locale === 'th' ? 'ลิงก์ยืนยันไม่ถูกต้องหรือหมดอายุแล้ว' : 'The verification link is invalid or has expired.') }}
          </p>
          <div class="pt-2 space-y-2">
            <NuxtLink to="/settings/account" class="inline-block w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-[13.5px] font-semibold transition-all cursor-pointer shadow-xs">
              {{ locale === 'th' ? 'ไปที่ตั้งค่าบัญชี' : 'Account Settings' }}
            </NuxtLink>
            <NuxtLink to="/dashboard" class="inline-block w-full py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-[13.5px] font-semibold transition-all cursor-pointer shadow-xs">
              {{ locale === 'th' ? 'ไปยังหน้าแดชบอร์ด' : 'Go to Dashboard' }}
            </NuxtLink>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { verifyEmail, refreshMe } = useAuth()
const { locale } = useI18n()

const verifying = ref(true)
const successState = ref(false)
const errorMessage = ref('')

onMounted(async () => {
  const token = String(route.query.token || '').trim()
  if (!token) {
    verifying.value = false
    errorMessage.value = locale.value === 'th' ? 'ไม่พบระบุโทเค็นสำหรับยืนยันอีเมล' : 'No verification token provided in URL.'
    return
  }

  try {
    await verifyEmail(token)
    await refreshMe()
    successState.value = true
  } catch (err: any) {
    errorMessage.value = err?.data?.message || err?.message || (locale.value === 'th' ? 'ลิงก์ยืนยันไม่ถูกต้องหรือหมดอายุแล้ว' : 'Verification link is invalid or expired.')
  } finally {
    verifying.value = false
  }
})
</script>
