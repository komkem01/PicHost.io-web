<template>
  <div class="min-h-screen bg-[#09090b] text-white font-sans selection:bg-blue-500/30 selection:text-blue-200">
    <!-- Hero Glows -->
    <div class="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      <div class="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-blue-600/[0.07] rounded-full blur-[140px]"></div>
    </div>

    <!-- Header Navigation -->
    <!-- Main Content -->
    <main class="max-w-3xl mx-auto px-6 py-16">
      <div class="text-center mb-12">
        <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 uppercase tracking-widest mb-4">
          {{ $t('contact.title') }}
        </span>
        <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
          {{ $t('contact.title') }}
        </h1>
        <p class="text-white/45 text-sm sm:text-base">
          {{ $t('contact.subtitle') }}
        </p>
      </div>

      <!-- Contact Form Card -->
      <div class="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 shadow-2xl backdrop-blur-xl relative">
        <form v-if="!submitted" @submit.prevent="handleSubmit" class="space-y-5">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label for="name" class="block text-xs font-medium text-white/50 mb-1.5">{{ $t('contact.name') }}</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                placeholder="Alex Smith"
                class="w-full bg-white/[0.05] border border-white/[0.09] focus:border-blue-500/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none"
              />
            </div>
            <div>
              <label for="email" class="block text-xs font-medium text-white/50 mb-1.5">{{ $t('contact.email') }}</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                placeholder="you@example.com"
                class="w-full bg-white/[0.05] border border-white/[0.09] focus:border-blue-500/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none"
              />
            </div>
          </div>

          <div>
            <label for="subject" class="block text-xs font-medium text-white/50 mb-1.5">{{ $t('contact.subject') }}</label>
            <input
              id="subject"
              v-model="form.subject"
              type="text"
              required
              class="w-full bg-white/[0.05] border border-white/[0.09] focus:border-blue-500/50 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
            />
          </div>

          <div>
            <label for="message" class="block text-xs font-medium text-white/50 mb-1.5">{{ $t('contact.message') }}</label>
            <textarea
              id="message"
              v-model="form.message"
              rows="5"
              required
              class="w-full bg-white/[0.05] border border-white/[0.09] focus:border-blue-500/50 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
            ></textarea>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {{ loading ? $t('common.loading') : $t('contact.submitBtn') }}
          </button>
        </form>

        <div v-else class="text-center py-10 space-y-4">
          <h2 class="text-2xl font-bold text-white">{{ $t('contact.successMsg') }}</h2>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const SITE_URL = 'https://pichost.io'
const { success } = useToast()
const { t, locale } = useI18n()

useHead({
  htmlAttrs: {
    lang: computed(() => locale.value)
  },
  link: [{ rel: 'canonical', href: `${SITE_URL}/contact` }],
})

const form = reactive({
  name: '',
  email: '',
  subject: 'General Question',
  message: '',
})

const loading = ref(false)
const submitted = ref(false)

async function handleSubmit() {
  loading.value = true
  await new Promise((resolve) => setTimeout(resolve, 600))
  loading.value = false
  submitted.value = true
  success(t('contact.successMsg'))
}

useSeoMeta({
  title: 'Contact Support — PicHost.io',
  description: 'Get in touch with PicHost.io support team.',
})
</script>
