<template>
  <main class="min-h-screen bg-[#09090b] text-white font-sans">

    <!-- Navbar -->
    <header class="border-b border-white/[0.06] bg-[#09090b]/90 backdrop-blur-md sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
        <div class="flex items-center gap-1.5">
          <div class="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3 21h18M2.25 12V4.5A2.25 2.25 0 0 1 4.5 2.25h15A2.25 2.25 0 0 1 21.75 4.5V12" />
            </svg>
          </div>
          <span class="text-white font-bold text-[17px] tracking-tight">PicHost<span class="text-white/40 font-normal">.io</span></span>
        </div>

        <nav class="hidden md:flex items-center gap-0.5">
          <a href="#features" class="text-[13px] text-white/55 hover:text-white px-3.5 py-2 rounded-lg hover:bg-white/[0.04] transition-colors">Features</a>
          <a href="#pricing" class="text-[13px] text-white/55 hover:text-white px-3.5 py-2 rounded-lg hover:bg-white/[0.04] transition-colors">Pricing</a>
          <a href="#api" class="text-[13px] text-white/55 hover:text-white px-3.5 py-2 rounded-lg hover:bg-white/[0.04] transition-colors">API</a>
        </nav>

        <div class="flex items-center gap-2">
          <template v-if="user">
            <NuxtLink to="/dashboard" class="text-[13px] text-white/60 hover:text-white px-3.5 py-2 rounded-lg hover:bg-white/[0.04] transition-colors">Dashboard</NuxtLink>
            <NuxtLink to="/upload" class="text-[13px] text-white font-medium bg-blue-600 hover:bg-blue-500 px-3.5 py-2 rounded-lg transition-colors">Upload</NuxtLink>
          </template>
          <template v-else>
            <NuxtLink to="/upload" class="text-[13px] text-white/80 font-medium border border-white/20 hover:border-white/40 hover:bg-white/[0.04] px-3.5 py-2 rounded-lg transition-colors">
              Try Free
            </NuxtLink>
            <NuxtLink to="/auth/login" class="text-[13px] text-white/55 hover:text-white px-3.5 py-2 rounded-lg hover:bg-white/[0.04] transition-colors">Sign in</NuxtLink>
            <NuxtLink to="/auth/register" class="text-[13px] text-white font-medium bg-blue-600 hover:bg-blue-500 px-3.5 py-2 rounded-lg transition-colors">Get started</NuxtLink>
          </template>
        </div>
      </div>
    </header>

    <!-- Hero -->
    <section class="max-w-6xl mx-auto px-6 pt-28 pb-24 text-center">
      <div class="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[11.5px] px-3 py-1.5 rounded-full mb-10 font-medium">
        <span class="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span>
        No account required — upload instantly
      </div>

      <h1 class="text-5xl md:text-[68px] font-bold tracking-tight leading-[1.1] mb-6">
        Upload an image.<br />
        <span class="text-blue-500">Get a link.</span>
      </h1>
      <p class="text-white/40 text-lg max-w-xl mx-auto mb-12 leading-relaxed">
        Drag in any image and share the permanent URL in seconds.
        No login, no watermark — free forever.
      </p>

      <div class="flex flex-col sm:flex-row gap-3 justify-center mb-20">
        <NuxtLink
          to="/upload"
          class="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-7 py-3 rounded-xl font-semibold transition-colors text-[14px] shadow-lg shadow-blue-600/20"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Upload now — it's free
        </NuxtLink>
        <NuxtLink
          to="/auth/register"
          class="inline-flex items-center justify-center gap-2 border border-white/[0.12] hover:border-white/25 text-white/60 hover:text-white px-7 py-3 rounded-xl font-medium transition-colors text-[14px]"
        >
          Create account
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </NuxtLink>
      </div>

      <!-- Social proof strip -->
      <div class="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[12.5px] text-white/30">
        <span class="flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
          Permanent links
        </span>
        <span class="flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
          No watermark
        </span>
        <span class="flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
          S3-backed storage
        </span>
        <span class="flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
          Private image support
        </span>
        <span class="flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
          REST API access
        </span>
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="max-w-6xl mx-auto px-6 py-24">
      <div class="text-center mb-16">
        <p class="text-blue-500 text-[12px] font-semibold uppercase tracking-widest mb-3">Features</p>
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Everything you need to host images</h2>
        <p class="text-white/40 max-w-lg mx-auto text-[15px]">Built for developers, designers, and teams who need reliable image hosting with zero friction.</p>
      </div>

      <div class="grid md:grid-cols-3 gap-4">
        <div
          v-for="feat in features"
          :key="feat.title"
          class="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 hover:border-blue-500/30 hover:bg-blue-500/[0.03] transition-all"
        >
          <div class="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mb-4" v-html="feat.icon"></div>
          <h3 class="text-[15px] font-semibold text-white mb-2">{{ feat.title }}</h3>
          <p class="text-white/40 text-[13px] leading-relaxed">{{ feat.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section id="pricing" class="max-w-6xl mx-auto px-6 py-24">
      <div class="text-center mb-16">
        <p class="text-blue-500 text-[12px] font-semibold uppercase tracking-widest mb-3">Pricing</p>
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Simple, transparent pricing</h2>
        <p class="text-white/40 max-w-lg mx-auto text-[15px]">Start free — upgrade only when you need more storage or private image features.</p>
      </div>

      <div class="grid md:grid-cols-4 gap-4">
        <div
          v-for="plan in plans"
          :key="plan.name"
          :class="[
            'rounded-2xl border p-6 flex flex-col transition-all',
            plan.highlighted
              ? 'border-blue-500/50 bg-blue-600/[0.08] relative'
              : 'border-white/[0.07] bg-white/[0.02]'
          ]"
        >
          <div v-if="plan.highlighted" class="absolute -top-3 left-1/2 -translate-x-1/2">
            <span class="bg-blue-600 text-white text-[11px] font-bold px-3 py-1 rounded-full">Most Popular</span>
          </div>
          <p class="text-[12px] font-semibold text-white/50 uppercase tracking-widest mb-2">{{ plan.name }}</p>
          <div class="mb-5">
            <span class="text-3xl font-bold text-white">{{ plan.price }}</span>
            <span v-if="plan.period" class="text-white/35 text-sm ml-1">{{ plan.period }}</span>
          </div>
          <ul class="space-y-2.5 mb-8 flex-1">
            <li v-for="item in plan.features" :key="item" class="flex items-start gap-2 text-[13px] text-white/55">
              <svg class="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              {{ item }}
            </li>
          </ul>
          <NuxtLink
            :to="plan.cta.href"
            :class="[
              'text-center text-[13px] font-semibold py-2.5 rounded-xl transition-colors',
              plan.highlighted
                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                : 'border border-white/[0.12] hover:border-white/25 text-white/60 hover:text-white'
            ]"
          >
            {{ plan.cta.label }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- API / Docs -->
    <section id="api" class="max-w-6xl mx-auto px-6 py-24">
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p class="text-blue-500 text-[12px] font-semibold uppercase tracking-widest mb-3">REST API</p>
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-5">Integrate in minutes</h2>
          <p class="text-white/40 text-[15px] leading-relaxed mb-8">
            Upload, retrieve, and manage images programmatically with our simple REST API.
            Bearer token auth — works with any language or framework.
          </p>
          <div class="space-y-3">
            <div v-for="ep in endpoints" :key="ep.path" class="flex items-center gap-3">
              <span :class="['text-[11px] font-bold px-2 py-0.5 rounded font-mono min-w-[46px] text-center', ep.methodClass]">{{ ep.method }}</span>
              <span class="text-[13px] font-mono text-white/60">{{ ep.path }}</span>
              <span class="text-[12px] text-white/30 ml-auto">{{ ep.desc }}</span>
            </div>
          </div>
        </div>

        <!-- Code sample -->
        <div class="rounded-2xl border border-white/[0.07] bg-[#0d0d10] overflow-hidden">
          <div class="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
            <span class="w-2.5 h-2.5 rounded-full bg-red-500/60"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-yellow-500/60"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-green-500/60"></span>
            <span class="text-white/25 text-[12px] ml-2 font-mono">upload.sh</span>
          </div>
          <pre class="p-5 text-[12.5px] font-mono leading-relaxed overflow-x-auto"><code><span class="text-white/30"># Upload an image (no auth needed)</span>
<span class="text-blue-400">curl</span> <span class="text-green-400">-X POST</span> \
  <span class="text-white/60">https://api.pichost.io/api/v1/storage/upload-file-guest</span> \
  <span class="text-yellow-400">-F</span> <span class="text-white/80">"file=@photo.jpg"</span>

<span class="text-white/30"># Response</span>
<span class="text-white/50">{
  <span class="text-blue-300">"data"</span>: {
    <span class="text-blue-300">"public_url"</span>: <span class="text-green-300">"https://cdn.pichost.io/..."</span>,
    <span class="text-blue-300">"short_code"</span>: <span class="text-green-300">"aB3xKq7"</span>,
    <span class="text-blue-300">"expires_at"</span>: <span class="text-green-300">"2026-05-06T10:00:00Z"</span>
  }
}</span></code></pre>
        </div>
      </div>
    </section>

    <!-- CTA Banner -->
    <section class="max-w-6xl mx-auto px-6 pb-24">
      <div class="rounded-2xl border border-blue-500/20 bg-blue-600/[0.06] px-8 py-12 text-center">
        <h2 class="text-3xl font-bold text-white mb-3">Ready to start hosting?</h2>
        <p class="text-white/40 mb-8 max-w-md mx-auto text-[15px]">Upload your first image right now — no account required. Sign up later to keep it forever.</p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <NuxtLink to="/upload" class="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-7 py-3 rounded-xl font-semibold transition-colors text-[14px] shadow-lg shadow-blue-600/20">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Upload now
          </NuxtLink>
          <NuxtLink to="/auth/register" class="inline-flex items-center justify-center border border-white/[0.12] hover:border-white/25 text-white/60 hover:text-white px-7 py-3 rounded-xl font-medium transition-colors text-[14px]">
            Create free account
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-white/[0.06] py-10">
      <div class="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-white/25">
        <div class="flex items-center gap-2">
          <div class="w-5 h-5 bg-blue-600 rounded-md flex items-center justify-center">
            <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3 21h18M2.25 12V4.5A2.25 2.25 0 0 1 4.5 2.25h15A2.25 2.25 0 0 1 21.75 4.5V12" />
            </svg>
          </div>
          <span class="text-white/40 font-medium">PicHost.io</span>
          <span class="mx-2">·</span>
          <span>© 2026 All rights reserved.</span>
        </div>
        <div class="flex gap-6">
          <a href="#" class="hover:text-white/50 transition-colors">Privacy</a>
          <a href="#" class="hover:text-white/50 transition-colors">Terms</a>
          <a href="#" class="hover:text-white/50 transition-colors">Status</a>
        </div>
      </div>
    </footer>
  </main>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'PicHost.io',
  description: 'Upload images instantly and share permanent links. Free image hosting for developers and teams. No watermark, no login required.',
})

const { user, fetchMe } = useAuth()
onMounted(() => { fetchMe() })

const features = [
  {
    icon: `<svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"/></svg>`,
    title: 'Instant shareable links',
    desc: 'Every upload gets a permanent short URL and a direct CDN link. Ready to paste anywhere in seconds.',
  },
  {
    icon: `<svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25z"/></svg>`,
    title: 'Private images',
    desc: 'Mark any image as private on Basic+ plans. Only accessible via signed URL — never exposed publicly.',
  },
  {
    icon: `<svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 2.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125M3.75 15c0 2.278 3.694 4.125 8.25 4.125s8.25-1.847 8.25-4.125"/></svg>`,
    title: 'S3-backed storage',
    desc: 'Files stored in S3-compatible object storage. Durable, redundant, and scalable — your images never disappear.',
  },
  {
    icon: `<svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/></svg>`,
    title: 'No account needed',
    desc: 'Upload as a guest without registering. Sign up only when you need permanent storage, private images, or higher limits.',
  },
  {
    icon: `<svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"/></svg>`,
    title: 'Simple REST API',
    desc: 'Upload, manage, and serve images via clean REST endpoints. Bearer token auth with full OpenAPI docs.',
  },
  {
    icon: `<svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"/></svg>`,
    title: 'Quota & usage tracking',
    desc: 'Real-time dashboard showing storage used, image count, and per-plan limits. Upgrade prompts when approaching quota.',
  },
]

const plans = [
  {
    name: 'Guest',
    price: 'Free',
    period: '',
    highlighted: false,
    features: [
      '50 MB storage',
      'Max 5 MB per file',
      'Up to 10 images',
      'JPEG & PNG only',
      'Links expire in 24h',
      'No login required',
    ],
    cta: { label: 'Try now', href: '/upload' },
  },
  {
    name: 'Free',
    price: '$0',
    period: '/ mo',
    highlighted: false,
    features: [
      '500 MB storage',
      'Max 10 MB per file',
      'Up to 200 images',
      'JPEG, PNG, WebP',
      'Permanent links',
      'Dashboard access',
    ],
    cta: { label: 'Sign up free', href: '/auth/register' },
  },
  {
    name: 'Basic',
    price: '$5',
    period: '/ mo',
    highlighted: true,
    features: [
      '10 GB storage',
      'Max 20 MB per file',
      'Unlimited images',
      'JPEG, PNG, WebP, GIF, AVIF',
      'Private images',
      'API access',
    ],
    cta: { label: 'Get Basic', href: '/auth/register' },
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/ mo',
    highlighted: false,
    features: [
      '100 GB storage',
      'Max 50 MB per file',
      'Unlimited images',
      'All formats incl. HEIC',
      'Private images',
      'Priority support',
    ],
    cta: { label: 'Get Pro', href: '/auth/register' },
  },
]

const endpoints = [
  { method: 'POST', methodClass: 'bg-green-500/15 text-green-400', path: '/storage/upload-file-guest', desc: 'Guest upload' },
  { method: 'POST', methodClass: 'bg-green-500/15 text-green-400', path: '/storage/upload-file', desc: 'Auth upload' },
  { method: 'GET',  methodClass: 'bg-blue-500/15 text-blue-400',  path: '/images',               desc: 'List images' },
  { method: 'GET',  methodClass: 'bg-blue-500/15 text-blue-400',  path: '/auth/me',               desc: 'Current user' },
  { method: 'POST', methodClass: 'bg-green-500/15 text-green-400', path: '/public/auth/refresh',  desc: 'Refresh token' },
]
</script>

