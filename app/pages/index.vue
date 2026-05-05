<template>
  <main class="min-h-screen bg-black text-white font-sans">
    <!-- Navbar -->
    <header class="border-b border-white/10 bg-black/90 backdrop-blur-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-blue-500 text-2xl font-bold tracking-tight">PicHost</span>
          <span class="text-white text-2xl font-light">.io</span>
        </div>
        <nav class="hidden md:flex items-center gap-8 text-sm text-white/70">
          <a href="#features" class="hover:text-white transition-colors">Features</a>
          <a href="#pricing" class="hover:text-white transition-colors">Pricing</a>
          <a href="#docs" class="hover:text-white transition-colors">Docs</a>
        </nav>
        <div class="flex items-center gap-3">
          <template v-if="user">
            <NuxtLink
              to="/dashboard"
              class="text-sm text-white/70 hover:text-white px-4 py-2 transition-colors"
            >
              Dashboard
            </NuxtLink>
            <NuxtLink
              to="/upload"
              class="text-sm text-white/70 hover:text-white px-4 py-2 transition-colors"
            >
              Upload
            </NuxtLink>
            <NuxtLink
              to="/settings/account"
              class="text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition-colors font-medium"
            >
              Settings
            </NuxtLink>
          </template>
          <template v-else>
            <NuxtLink
              to="/upload"
              class="text-sm text-white font-medium border border-white/25 hover:border-white/50 hover:bg-white/[0.06] px-4 py-2 rounded-md transition-colors"
            >
              Try Upload
            </NuxtLink>
            <NuxtLink
              to="/auth/login"
              class="text-sm text-white/70 hover:text-white px-4 py-2 transition-colors"
            >
              Sign In
            </NuxtLink>
            <NuxtLink
              to="/auth/register"
              class="text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition-colors font-medium"
            >
              Get Started
            </NuxtLink>
          </template>
        </div>
      </div>
    </header>

    <!-- Hero -->
    <section class="max-w-7xl mx-auto px-6 pt-24 pb-20 text-center">
      <div class="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-600/30 text-blue-400 text-xs px-3 py-1 rounded-full mb-8">
        <span class="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
        Professional Image Hosting
      </div>
      <h1 class="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6">
        Host Images.<br />
        <span class="text-blue-500">Effortlessly.</span>
      </h1>
      <p class="text-white/50 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
        Fast, secure, and reliable image hosting for developers and businesses.
        Upload once, serve globally.
      </p>
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <NuxtLink
          to="/auth/register"
          class="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-md font-medium transition-colors text-sm text-center"
        >
          Start for Free
        </NuxtLink>
        <a
          href="#features"
          class="border border-white/20 hover:border-white/40 text-white/70 hover:text-white px-8 py-3 rounded-md font-medium transition-colors text-sm text-center"
        >
          View Documentation
        </a>
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="max-w-7xl mx-auto px-6 py-20">
      <div class="grid md:grid-cols-3 gap-6">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="border border-white/10 rounded-xl p-6 hover:border-blue-600/40 transition-colors bg-white/[0.02]"
        >
          <div class="w-10 h-10 bg-blue-600/15 rounded-lg flex items-center justify-center mb-4">
            <span class="text-blue-400 text-lg">{{ feature.icon }}</span>
          </div>
          <h3 class="text-white font-semibold mb-2">{{ feature.title }}</h3>
          <p class="text-white/50 text-sm leading-relaxed">{{ feature.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-white/10 py-8">
      <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/30">
        <span>© 2026 PicHost.io — All rights reserved.</span>
        <div class="flex gap-6">
          <a href="#" class="hover:text-white/60 transition-colors">Privacy</a>
          <a href="#" class="hover:text-white/60 transition-colors">Terms</a>
          <a href="#" class="hover:text-white/60 transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  </main>
</template>

<script setup lang="ts">
const { user, fetchMe } = useAuth()
onMounted(() => { fetchMe() })

const features = [
  {
    icon: '⚡',
    title: 'Ultra-Fast CDN',
    desc: 'Images delivered at blazing speed from edge nodes worldwide, ensuring minimal latency for every request.',
  },
  {
    icon: '🔒',
    title: 'Secure Storage',
    desc: 'End-to-end encrypted storage with access control, keeping your images safe and private.',
  },
  {
    icon: '🔗',
    title: 'Simple API',
    desc: 'Integrate in minutes with our REST API. Upload, retrieve, and manage images programmatically with ease.',
  },
  {
    icon: '📦',
    title: 'Flexible Formats',
    desc: 'Support for JPEG, PNG, WebP, AVIF, GIF and more. Automatic format conversion on the fly.',
  },
  {
    icon: '📊',
    title: 'Analytics Dashboard',
    desc: 'Track bandwidth usage, view counts, and request logs with a clean real-time dashboard.',
  },
  {
    icon: '🌐',
    title: 'Custom Domain',
    desc: 'Serve images from your own domain with a single DNS record. Full HTTPS included.',
  },
]
</script>
