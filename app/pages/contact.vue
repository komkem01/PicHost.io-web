<template>
  <div class="min-h-screen bg-[#FAFAFA] text-zinc-900 font-sans">
    <!-- Main Content -->
    <main class="max-w-3xl mx-auto px-6 py-16">
      <div class="text-center mb-12">
        <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-700 uppercase tracking-widest mb-4">
          {{ $t('contact.title') }}
        </span>
        <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 mb-3">
          {{ $t('contact.title') }}
        </h1>
        <p class="text-zinc-500 text-sm sm:text-base">
          {{ $t('contact.subtitle') }}
        </p>
      </div>

      <!-- Contact Form Card -->
      <div class="rounded-2xl border border-zinc-200 bg-white p-8 shadow-card relative">
        <form v-if="!submitted" @submit.prevent="handleSubmit" class="space-y-5">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label for="name" class="block text-xs font-medium text-zinc-700 mb-1.5">{{ $t('contact.name') }}</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                placeholder="Alex Smith"
                class="w-full bg-white border border-zinc-200 focus:border-zinc-400 rounded-xl px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors"
              />
            </div>
            <div>
              <label for="email" class="block text-xs font-medium text-zinc-700 mb-1.5">{{ $t('contact.email') }}</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                placeholder="you@example.com"
                class="w-full bg-white border border-zinc-200 focus:border-zinc-400 rounded-xl px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label for="subject" class="block text-xs font-medium text-zinc-700 mb-1.5">{{ $t('contact.subject') }}</label>
            <input
              id="subject"
              v-model="form.subject"
              type="text"
              required
              class="w-full bg-white border border-zinc-200 focus:border-zinc-400 rounded-xl px-4 py-2.5 text-sm text-zinc-900 outline-none transition-colors"
            />
          </div>

          <div>
            <label for="message" class="block text-xs font-medium text-zinc-700 mb-1.5">{{ $t('contact.message') }}</label>
            <textarea
              id="message"
              v-model="form.message"
              rows="5"
              required
              class="w-full bg-white border border-zinc-200 focus:border-zinc-400 rounded-xl px-4 py-2.5 text-sm text-zinc-900 outline-none transition-colors"
            ></textarea>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-sm shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {{ loading ? $t('common.loading') : $t('contact.submitBtn') }}
          </button>
        </form>

        <div v-else class="text-center py-10 space-y-4">
          <h2 class="text-2xl font-bold text-zinc-900">{{ $t('contact.successMsg') }}</h2>
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
