<template>
  <div class="min-h-screen bg-[#09090b] text-white font-sans">
    <!-- Fixed Header -->
    <header class="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.08] bg-[#09090b]/90 backdrop-blur-xl">
      <div class="max-w-7xl mx-auto px-6 h-[64px] flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-0.5">
          <span class="text-blue-500 text-xl font-bold tracking-tight">PicHost</span>
          <span class="text-white text-xl font-light">.io</span>
        </NuxtLink>
        <nav class="flex items-center gap-1">
          <NuxtLink
            to="/dashboard"
            class="text-[13px] text-white px-3 py-1.5 rounded-lg bg-white/[0.06] font-medium"
          >
            Dashboard
          </NuxtLink>
          <NuxtLink
            to="/upload"
            class="text-[13px] text-white/60 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors"
          >
            Upload
          </NuxtLink>
          <NuxtLink
            to="/settings/account"
            class="text-[13px] text-white/60 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors"
          >
            Settings
          </NuxtLink>
          <button
            @click="openLogoutModal()"
            class="text-[13px] text-red-400 hover:text-white border border-red-500/30 hover:border-red-500/60 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors font-medium"
          >
            Sign out
          </button>
        </nav>
      </div>
    </header>

    <main class="pt-[64px]">
      <div class="max-w-7xl mx-auto px-6 py-10">

        <!-- Welcome Row -->
        <div class="flex items-start justify-between mb-10">
          <div>
            <p class="text-white/35 text-sm mb-1.5">{{ todayStr }}</p>
            <h1 class="text-[26px] font-bold tracking-tight leading-tight">
              Good {{ timeGreeting }},
              <span class="text-blue-400">{{ userName }}</span>
            </h1>
            <p class="text-white/35 text-sm mt-1.5">
              <template v-if="loading">Loading your overview…</template>
              <template v-else-if="files.length === 0">You haven't uploaded anything yet.</template>
              <template v-else>You have {{ files.length }} image{{ files.length !== 1 ? 's' : '' }} stored — {{ totalStorageUsed }} used.</template>
            </p>
          </div>
          <NuxtLink
            to="/upload"
            class="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex-shrink-0"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Upload
          </NuxtLink>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <!-- Total Images -->
          <div class="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
            <div class="flex items-center justify-between mb-4">
              <p class="text-[11px] font-semibold text-white/35 uppercase tracking-widest">Total Images</p>
              <div class="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
              </div>
            </div>
            <div v-if="loading" class="h-9 w-16 bg-white/[0.06] rounded-lg animate-pulse" />
            <p v-else class="text-[32px] font-bold leading-none">{{ files.length }}</p>
          </div>

          <!-- Storage Used -->
          <div class="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
            <div class="flex items-center justify-between mb-4">
              <p class="text-[11px] font-semibold text-white/35 uppercase tracking-widest">Storage Used</p>
              <div class="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                <svg class="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 2.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                </svg>
              </div>
            </div>
            <div v-if="loading" class="h-9 w-24 bg-white/[0.06] rounded-lg animate-pulse" />
            <p v-else class="text-[32px] font-bold leading-none">{{ totalStorageUsed }}</p>
          </div>

          <!-- Public -->
          <div class="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
            <div class="flex items-center justify-between mb-4">
              <p class="text-[11px] font-semibold text-white/35 uppercase tracking-widest">Public</p>
              <div class="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              </div>
            </div>
            <div v-if="loading" class="h-9 w-12 bg-white/[0.06] rounded-lg animate-pulse" />
            <p v-else class="text-[32px] font-bold leading-none">{{ publicCount }}</p>
          </div>

          <!-- Private -->
          <div class="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
            <div class="flex items-center justify-between mb-4">
              <p class="text-[11px] font-semibold text-white/35 uppercase tracking-widest">Private</p>
              <div class="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25z" />
                </svg>
              </div>
            </div>
            <div v-if="loading" class="h-9 w-12 bg-white/[0.06] rounded-lg animate-pulse" />
            <p v-else class="text-[32px] font-bold leading-none">{{ privateCount }}</p>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
          <NuxtLink
            to="/upload"
            class="group flex items-center gap-4 rounded-2xl border border-blue-500/20 bg-blue-500/[0.04] hover:bg-blue-500/[0.08] hover:border-blue-500/35 p-5 transition-all"
          >
            <div class="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <div class="min-w-0">
              <p class="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">Upload Image</p>
              <p class="text-white/40 text-xs mt-0.5">Upload from device or import from URL</p>
            </div>
            <svg class="w-4 h-4 text-white/15 group-hover:text-blue-400 ml-auto flex-shrink-0 transition-colors" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </NuxtLink>

          <NuxtLink
            to="/settings/account"
            class="group flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] hover:bg-white/[0.04] hover:border-white/[0.12] p-5 transition-all"
          >
            <div class="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-white/45" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </div>
            <div class="min-w-0">
              <p class="text-sm font-semibold text-white/70 group-hover:text-white transition-colors">Account Settings</p>
              <p class="text-white/40 text-xs mt-0.5">Manage your profile and plan</p>
            </div>
            <svg class="w-4 h-4 text-white/15 group-hover:text-white/40 ml-auto flex-shrink-0 transition-colors" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </NuxtLink>
        </div>

        <!-- Recent Uploads Section -->
        <div>
          <div class="flex items-center justify-between mb-5">
            <div>
              <h2 class="text-[15px] font-semibold text-white">Recent Uploads</h2>
              <p class="text-white/30 text-xs mt-0.5">
                <template v-if="loading">Loading…</template>
                <template v-else-if="files.length === 0">No uploads yet</template>
                <template v-else>Showing {{ (currentPage - 1) * PAGE_SIZE + 1 }}–{{ Math.min(currentPage * PAGE_SIZE, files.length) }} of {{ files.length }}</template>
              </p>
            </div>
            <!-- Pagination controls -->
            <div v-if="!loading && totalPages > 1" class="flex items-center gap-1">
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="w-7 h-7 rounded-lg border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.07] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </button>
              <template v-for="p in pageNumbers" :key="p">
                <span v-if="p === '...'" class="w-7 text-center text-white/25 text-xs">…</span>
                <button
                  v-else
                  @click="currentPage = p as number"
                  :class="[
                    'w-7 h-7 rounded-lg border text-xs font-medium transition-colors',
                    currentPage === p
                      ? 'border-blue-500/50 bg-blue-500/15 text-blue-400'
                      : 'border-white/[0.08] bg-white/[0.03] text-white/40 hover:text-white hover:bg-white/[0.07]',
                  ]"
                >{{ p }}</button>
              </template>
              <button
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                class="w-7 h-7 rounded-lg border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.07] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Skeleton -->
          <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div
              v-for="i in 6"
              :key="i"
              class="animate-pulse rounded-xl border border-white/[0.06] bg-white/[0.03] overflow-hidden"
            >
              <div class="bg-white/[0.05] aspect-square" />
              <div class="p-2.5 space-y-1.5">
                <div class="h-2.5 bg-white/[0.07] rounded-full w-2/3" />
                <div class="h-2 bg-white/[0.04] rounded-full w-1/2" />
              </div>
            </div>
          </div>

          <!-- Error -->
          <div
            v-else-if="fetchError"
            class="flex flex-col items-center justify-center py-16 rounded-2xl border border-white/[0.06] bg-white/[0.02] text-center"
          >
            <div class="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center mb-3">
              <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <p class="text-white/40 text-sm mb-3">Failed to load images.</p>
            <button @click="loadFiles" class="text-xs text-blue-400 hover:text-blue-300 transition-colors">Try again</button>
          </div>

          <!-- Empty State -->
          <div
            v-else-if="files.length === 0"
            class="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-white/[0.08] text-center"
          >
            <div class="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-5">
              <svg class="w-7 h-7 text-white/20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
            </div>
            <h3 class="text-white/60 font-semibold mb-1.5">No images yet</h3>
            <p class="text-white/25 text-sm mb-6 max-w-xs">Upload your first image to get a shareable link instantly.</p>
            <NuxtLink
              to="/upload"
              class="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all"
            >
              Upload an Image
            </NuxtLink>
          </div>

          <!-- Image Grid -->
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div
              v-for="file in paginatedFiles"
              :key="file.id"
              class="group relative rounded-xl border border-white/[0.06] bg-white/[0.03] overflow-hidden hover:border-blue-500/30 hover:bg-white/[0.05] transition-all duration-200"
            >
              <!-- Preview -->
              <div class="relative aspect-square bg-white/[0.04] flex items-center justify-center overflow-hidden">
                <img
                  v-if="isImage(file.mime_type)"
                  :src="file.public_url"
                  :alt="file.id"
                  class="w-full h-full object-cover"
                  loading="lazy"
                  @error="(e) => ((e.target as HTMLImageElement).style.display = 'none')"
                />
                <div v-else class="text-white/20">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                </div>

                <!-- Private badge -->
                <div
                  v-if="file.is_private"
                  class="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-sm border border-amber-500/30 flex items-center gap-1"
                >
                  <svg class="w-2.5 h-2.5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-[9px] text-amber-400 font-medium">Private</span>
                </div>

                <!-- Hover actions -->
                <div class="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    @click.stop="copyURL(file)"
                    title="Copy URL"
                    class="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center transition-colors"
                  >
                    <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <a
                    :href="file.public_url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center transition-colors"
                    @click.stop
                  >
                    <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </a>

                </div>
              </div>

              <!-- Meta -->
              <div class="p-2.5">
                <div class="flex items-center gap-1.5 mb-1">
                  <span class="text-[10px] font-semibold px-1 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/20 uppercase tracking-wide">
                    {{ fileExt(file.mime_type) }}
                  </span>
                  <span class="text-white/25 text-[10px]">{{ formatSize(file.file_size) }}</span>
                </div>
                <p class="text-white/30 text-[10px]">{{ formatDate(file.created_at) }}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
interface StorageFile {
  id: string
  storage_id: string
  short_code: string
  provider: string
  is_private: boolean
  public_url: string
  file_size: number
  mime_type: string | null
  created_at: string
}

interface ApiResponse<T> {
  code: string
  message: string
  data: T
}

const PAGE_SIZE = 12

const config = useRuntimeConfig()
const router = useRouter()
const { user, fetchMe, getToken } = useAuth()
const { open: openLogoutModal } = useLogoutModal()
const { success, error } = useToast()

const files = ref<StorageFile[]>([])
const loading = ref(true)
const fetchError = ref(false)
const currentPage = ref(1)

// Computed stats
const totalStorageUsed = computed(() =>
  formatSize(files.value.reduce((sum, f) => sum + f.file_size, 0))
)
const publicCount = computed(() => files.value.filter((f) => !f.is_private).length)
const privateCount = computed(() => files.value.filter((f) => f.is_private).length)
const totalPages = computed(() => Math.max(1, Math.ceil(files.value.length / PAGE_SIZE)))
const paginatedFiles = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return files.value.slice(start, start + PAGE_SIZE)
})
const pageNumbers = computed((): (number | '...')[] => {
  const total = totalPages.value
  const cur = currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | '...')[] = [1]
  if (cur > 3) pages.push('...')
  for (let p = Math.max(2, cur - 1); p <= Math.min(total - 1, cur + 1); p++) pages.push(p)
  if (cur < total - 2) pages.push('...')
  pages.push(total)
  return pages
})

// Greeting
const timeGreeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
})
const todayStr = computed(() =>
  new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
)
const userName = computed(() => user.value?.username || user.value?.email?.split('@')[0] || 'there')

onMounted(async () => {
  const me = await fetchMe()
  if (!me) {
    router.push('/auth/login')
    return
  }
  await loadFiles()
})

async function loadFiles() {
  loading.value = true
  fetchError.value = false
  try {
    const res = await $fetch<ApiResponse<StorageFile[]>>(`${config.public.apiBase}/images`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
    files.value = res.data ?? []
  } catch {
    fetchError.value = true
    error('Failed to load images.')
  } finally {
    loading.value = false
  }
}

async function copyURL(file: StorageFile) {
  try {
    await navigator.clipboard.writeText(file.public_url)
    success('URL copied to clipboard!')
  } catch {
    error('Failed to copy URL.')
  }
}

function isImage(mime: string | null): boolean {
  return !!mime && mime.startsWith('image/')
}

function fileExt(mime: string | null): string {
  if (!mime) return 'file'
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/avif': 'avif',
    'image/bmp': 'bmp',
    'image/tiff': 'tiff',
    'image/heic': 'heic',
  }
  return map[mime] ?? mime.split('/')[1] ?? 'file'
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>
