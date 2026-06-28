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
          <template v-if="user">
            <NuxtLink
              to="/dashboard"
              class="text-[13px] text-white/60 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors"
            >
              Dashboard
            </NuxtLink>
            <NuxtLink
              to="/upload"
              class="text-[13px] text-white px-3 py-1.5 rounded-lg bg-white/[0.06] font-medium"
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
          </template>
          <template v-else>
            <NuxtLink
              to="/auth/login"
              class="text-[13px] text-white/60 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors"
            >
              Sign in
            </NuxtLink>
            <NuxtLink
              to="/auth/register"
              class="text-[13px] text-white font-medium bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg transition-colors"
            >
              Sign up free
            </NuxtLink>
          </template>
        </nav>
      </div>
    </header>

    <main class="pt-[64px]">
      <div class="max-w-7xl mx-auto px-6 py-10">

        <!-- Title -->
        <div class="mb-8">
          <h1 class="text-[26px] font-bold tracking-tight leading-tight text-white">Upload Image</h1>
          <p class="text-white/35 text-sm mt-1.5">Drag & drop or browse to upload. Get a shareable link instantly.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <!-- Left Column: Upload Form & Result -->
          <div class="lg:col-span-7 space-y-4">

        <!-- Guest notice -->
        <div
          v-if="!user"
          class="mb-6 flex items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/[0.06] px-4 py-3.5"
        >
          <svg class="w-4 h-4 text-amber-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <div class="flex-1 min-w-0">
            <p class="text-[13px] font-medium text-amber-300">Guest upload — images expire in 24 hours</p>
            <p class="text-[11.5px] text-amber-400/70 mt-0.5">
              Max 5 MB &middot; JPEG &amp; PNG only &middot;
              <NuxtLink to="/auth/register" class="underline underline-offset-2 hover:text-amber-300 transition-colors">Sign up free</NuxtLink>
              for permanent storage
            </p>
          </div>
        </div>

        <!-- Success card -->
        <Transition
          enter-from-class="opacity-0 scale-[0.98]"
          enter-active-class="transition duration-200"
          leave-to-class="opacity-0"
          leave-active-class="transition duration-150"
        >
          <div v-if="result" class="mb-6 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl">
            <!-- Image preview -->
            <div v-if="resultPreview" class="relative w-full bg-black/30 flex items-center justify-center" style="min-height:180px; max-height:280px; overflow:hidden;">
              <img :src="resultPreview" class="w-full object-contain" style="max-height:280px;" alt="uploaded" />
              <!-- overlay gradient -->
              <div class="absolute inset-0 bg-gradient-to-t from-[#09090b]/80 via-transparent to-transparent pointer-events-none" />
              <!-- badge -->
              <div class="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-sm">
                <svg class="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span class="text-[11px] font-semibold text-emerald-400 leading-none">Uploaded</span>
              </div>
            </div>

            <!-- Content -->
            <div class="p-5">
              <p class="text-[15px] font-semibold text-white mb-0.5">Upload complete!</p>
              <p class="text-white/40 text-[12.5px] mb-4">Your image is live and ready to share.</p>

              <!-- URL copy row -->
              <div class="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 mb-4">
                <svg class="w-3.5 h-3.5 text-white/25 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                </svg>
                <span class="text-blue-300/90 text-[12.5px] font-mono truncate flex-1 select-all">{{ result.public_url }}</span>
                <button
                  @click="copyResult"
                  class="shrink-0 flex items-center gap-1 text-[11.5px] font-medium transition-colors px-2 py-0.5 rounded-md"
                  :class="copied ? 'text-emerald-400 bg-emerald-500/10' : 'text-white/40 hover:text-white/70 hover:bg-white/[0.05]'"
                >
                  <svg v-if="!copied" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {{ copied ? 'Copied!' : 'Copy' }}
                </button>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-2">
                <a
                  :href="result.public_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-[13px] font-semibold transition-all shadow-lg shadow-blue-600/20"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                  Open
                </a>
                <button
                  @click="resetForm"
                  class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-white/[0.09] bg-white/[0.03] hover:bg-white/[0.07] text-white/60 hover:text-white text-[13px] font-medium transition-all"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Upload another
                </button>
                <NuxtLink
                  v-if="user"
                  to="/dashboard"
                  class="flex items-center justify-center px-3.5 py-2 rounded-xl border border-white/[0.09] bg-white/[0.03] hover:bg-white/[0.07] text-white/40 hover:text-white/70 transition-all"
                  title="Go to Dashboard"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </NuxtLink>
              </div>

              <!-- Guest sign-up CTA -->
              <div
                v-if="!user"
                class="mt-4 flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3"
              >
                <div class="flex-1 min-w-0">
                  <p class="text-[12.5px] font-medium text-white/70">
                    This image expires
                    <span class="text-amber-400">{{ result.expires_at ? formatExpiry(result.expires_at) : 'in 24 hours' }}</span>
                  </p>
                  <p class="text-[11px] text-white/35 mt-0.5">Sign up free to keep your images forever</p>
                </div>
                <NuxtLink
                  to="/auth/register"
                  class="shrink-0 text-[12px] font-semibold text-white bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Sign up
                </NuxtLink>
              </div>
            </div>
          </div>
        </Transition>

        <!-- Upload Form -->
        <form v-if="!result" @submit.prevent="handleSubmit" class="space-y-4">

          <!-- Drop Zone -->
          <div
            ref="dropzone"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="onDrop"
            @click="triggerFilePicker"
            :class="[
              'relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer flex flex-col items-center justify-center min-h-[200px] select-none',
              isDragging
                ? 'border-blue-500/60 bg-blue-500/[0.06]'
                : selectedFile
                ? 'border-white/[0.12] bg-white/[0.03]'
                : 'border-white/[0.1] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.03]',
            ]"
          >
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="sr-only"
              @change="onFileChange"
            />

            <!-- Preview when file is selected -->
            <template v-if="selectedFile">
              <div class="w-full p-4 flex items-center gap-4">
                <!-- Thumbnail -->
                <div class="w-16 h-16 rounded-xl border border-white/[0.08] overflow-hidden bg-white/[0.04] flex items-center justify-center shrink-0">
                  <img v-if="previewUrl" :src="previewUrl" class="w-full h-full object-cover" alt="preview" />
                  <svg v-else class="w-6 h-6 text-white/20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                </div>
                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <p class="text-[13.5px] font-medium text-white truncate">{{ selectedFile.name }}</p>
                  <p class="text-white/35 text-xs mt-0.5">{{ formatSize(selectedFile.size) }} · {{ selectedFile.type || 'image' }}</p>
                </div>
                <!-- Remove button -->
                <button
                  type="button"
                  @click.stop="clearFile"
                  class="w-7 h-7 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] flex items-center justify-center transition-colors shrink-0"
                >
                  <svg class="w-3.5 h-3.5 text-white/50" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p class="pb-3 text-[11.5px] text-white/25">Click or drag to replace</p>
            </template>

            <!-- Empty state -->
            <template v-else>
              <div
                class="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-4 transition-transform"
                :class="isDragging ? 'scale-110' : ''"
              >
                <svg class="w-6 h-6 text-white/25" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <p class="text-[13.5px] font-medium text-white/60 mb-1">
                <span class="text-blue-400">Browse</span> or drag & drop
              </p>
              <p class="text-white/25 text-xs">PNG, JPG, WEBP, GIF, AVIF up to 10 MB</p>
            </template>
          </div>

          <!-- File required error -->
          <Transition enter-from-class="opacity-0 -translate-y-0.5" enter-active-class="transition duration-150">
            <p v-if="fileError" class="text-[11.5px] text-red-400 flex items-center gap-1 -mt-1">
              <svg class="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              {{ fileError }}
            </p>
          </Transition>


          <!-- Upload progress -->
          <div v-if="loading" class="rounded-xl border border-blue-500/20 bg-blue-500/[0.05] p-4">
            <div class="flex items-center gap-3 mb-3">
              <svg class="w-4 h-4 text-blue-400 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span class="text-[13px] text-blue-300 font-medium">Uploading…</span>
              <span class="ml-auto text-[12px] text-blue-400/70">{{ uploadProgress }}%</span>
            </div>
            <div class="h-1 w-full bg-white/[0.07] rounded-full overflow-hidden">
              <div
                class="h-full bg-blue-500 rounded-full transition-all duration-300"
                :style="{ width: `${uploadProgress}%` }"
              />
            </div>
          </div>

          <!-- Submit button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full rounded-xl py-2.5 text-[13.5px] font-semibold text-white transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            :class="loading ? 'bg-blue-600/70' : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-600/25'"
          >
            Upload Image
          </button>

        </form>
          </div>

          <!-- Right Column: Sidebar -->
          <div class="lg:col-span-5 space-y-6">
            <!-- If logged in: Quota and Plan Details -->
            <div v-if="user" class="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 space-y-5">
              <div class="flex items-center justify-between border-b border-white/[0.06] pb-4">
                <div>
                  <p class="text-[12px] text-white/40 mb-0.5">Current Plan</p>
                  <p class="text-[16px] font-bold text-white">{{ user.plan }}</p>
                </div>
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-medium border" :class="planBadge.class">
                  <span class="w-1.5 h-1.5 rounded-full" :class="planBadge.dot" />
                  Active
                </span>
              </div>

              <!-- Storage Quota -->
              <div v-if="quota" class="space-y-4">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-[12px] text-white/50">Storage Used</span>
                    <span class="text-[12px] font-medium text-white/80">
                      {{ formatBytes(quota.used_storage_bytes) }}
                      <span class="text-white/30"> / {{ quota.storage_limit_bytes === -1 ? 'Unlimited' : formatBytes(quota.storage_limit_bytes) }}</span>
                    </span>
                  </div>
                  <div class="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-500"
                      :class="storagePercent >= 90 ? 'bg-red-500' : storagePercent >= 70 ? 'bg-yellow-500' : 'bg-blue-500'"
                      :style="{ width: quota.storage_limit_bytes === -1 ? '0%' : `${storagePercent}%` }"
                    />
                  </div>
                </div>

                <!-- Usage: Images -->
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-[12px] text-white/50">Images Stored</span>
                    <span class="text-[12px] font-medium text-white/80">
                      {{ quota.image_count.toLocaleString() }}
                      <span class="text-white/30"> / {{ quota.max_images === 0 ? 'Unlimited' : quota.max_images.toLocaleString() }}</span>
                    </span>
                  </div>
                  <div v-if="quota.max_images > 0" class="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-500"
                      :class="imagePercent >= 90 ? 'bg-red-500' : imagePercent >= 70 ? 'bg-yellow-500' : 'bg-blue-500'"
                      :style="{ width: `${imagePercent}%` }"
                    />
                  </div>
                  <div v-else class="h-1.5 rounded-full bg-white/[0.06]" />
                </div>

                <!-- Additional details -->
                <div class="pt-2 grid grid-cols-2 gap-3 border-t border-white/[0.06]">
                  <div class="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
                    <p class="text-[10px] text-white/30 uppercase tracking-wider mb-1">Max File Size</p>
                    <p class="text-[13px] font-semibold text-white/80">
                      {{ quota.file_size_limit_bytes === -1 ? 'Unlimited' : formatBytes(quota.file_size_limit_bytes) }}
                    </p>
                  </div>
                  <div class="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
                    <p class="text-[10px] text-white/30 uppercase tracking-wider mb-1">Allowed Formats</p>
                    <p class="text-[13px] font-semibold text-white/80">
                      All Images
                    </p>
                  </div>
                </div>
              </div>

              <!-- Skeleton while loading -->
              <div v-else class="space-y-4">
                <div class="h-8 rounded-lg bg-white/[0.04] animate-pulse" />
                <div class="h-8 rounded-lg bg-white/[0.04] animate-pulse" />
                <div class="grid grid-cols-2 gap-3">
                  <div class="h-12 rounded-xl bg-white/[0.04] animate-pulse" />
                  <div class="h-12 rounded-xl bg-white/[0.04] animate-pulse" />
                </div>
              </div>
            </div>

            <!-- If guest: Benefits of upgrading / creating account -->
            <div v-else class="rounded-2xl border border-blue-500/20 bg-blue-500/[0.03] p-6 space-y-5">
              <div>
                <h3 class="text-[16px] font-semibold text-white">ต้องการพื้นที่จัดเก็บถาวร?</h3>
                <p class="text-[12.5px] text-white/50 mt-1 leading-relaxed">
                  สร้างบัญชีใช้งานฟรีเพื่อปลดล็อกฟีเจอร์ระดับพรีเมียมและเก็บรูปภาพได้ถาวร
                </p>
              </div>

              <ul class="space-y-3">
                <li class="flex items-start gap-2.5 text-[12.5px] text-white/70">
                  <svg class="w-4 h-4 text-blue-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span>จัดเก็บรูปภาพถาวร (ไม่มีการลบหลัง 24 ชั่วโมง)</span>
                </li>
                <li class="flex items-start gap-2.5 text-[12.5px] text-white/70">
                  <svg class="w-4 h-4 text-blue-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span>แผงควบคุม (Dashboard) สำหรับจัดการและแชร์รูปภาพ</span>
                </li>
                <li class="flex items-start gap-2.5 text-[12.5px] text-white/70">
                  <svg class="w-4 h-4 text-blue-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span>ขนาดอัปโหลดสูงสุดสูงสุดเพิ่มขึ้นเป็น 5 MB</span>
                </li>

              </ul>

              <div class="pt-2">
                <NuxtLink
                  to="/auth/register"
                  class="w-full flex items-center justify-center py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-[13px] font-semibold transition-all shadow-lg shadow-blue-600/20"
                >
                  สมัครสมาชิกฟรี
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
interface UploadResult {
  id: string
  storage_id: string
  is_private: boolean
  expires_at: string | null
  created_at: string
  short_code: string
  provider: string
  file_size: number
  mime_type: string | null
  public_url: string
}

interface ApiResponse<T> {
  code: string
  message: string
  data: T
}

const config = useRuntimeConfig()
const router = useRouter()
const { user, fetchMe, getToken } = useAuth()
const { open: openLogoutModal } = useLogoutModal()
const { success, error } = useToast()

const canPrivate = computed(() => {
  const plan = user.value?.plan ?? 'Free'
  return plan !== 'Free'
})

// File state
const fileInput = ref<HTMLInputElement | null>(null)
const dropzone = ref<HTMLDivElement | null>(null)
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const isDragging = ref(false)
const isPrivate = ref(false)
const fileError = ref('')

// Upload state
const loading = ref(false)
const uploadProgress = ref(0)
const result = ref<UploadResult | null>(null)
const resultPreview = ref<string | null>(null)
const copied = ref(false)

const quota = ref<{
  plan: string
  used_storage_bytes: number
  storage_limit_bytes: number
  image_count: number
  max_images: number
  file_size_limit_bytes: number
  allow_private: boolean
} | null>(null)

const planBadge = computed((): { class: string; dot: string } => {
  const map: Record<string, { class: string; dot: string }> = {
    Free:       { class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-400' },
    Basic:      { class: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',    dot: 'bg-yellow-400' },
    Pro:        { class: 'bg-orange-500/10 text-orange-400 border-orange-500/20',    dot: 'bg-orange-400' },
    Enterprise: { class: 'bg-red-500/10 text-red-400 border-red-500/20',             dot: 'bg-red-400' },
  }
  return map[user.value?.plan ?? 'Free'] ?? map['Free']!
})

const storagePercent = computed(() => {
  if (!quota.value || quota.value.storage_limit_bytes <= 0) return 0
  return Math.min(Math.round((quota.value.used_storage_bytes / quota.value.storage_limit_bytes) * 100), 100)
})

const imagePercent = computed(() => {
  if (!quota.value || quota.value.max_images <= 0) return 0
  return Math.min(Math.round((quota.value.image_count / quota.value.max_images) * 100), 100)
})

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`
}

onMounted(async () => {
  const me = await fetchMe() // silent — guests stay on the page
  if (me) {
    try {
      const res = await $fetch<{ data: any }>(`${config.public.apiBase}/auth/quota`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      quota.value = res.data
    } catch {
      // ignore
    }
  }
})

onUnmounted(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  if (resultPreview.value) URL.revokeObjectURL(resultPreview.value)
})

function triggerFilePicker() {
  fileInput.value?.click()
}

function onFileChange(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (f) applyFile(f)
}

function onDrop(e: DragEvent) {
  isDragging.value = false
  const f = e.dataTransfer?.files?.[0]
  if (!f) return
  if (!f.type.startsWith('image/')) {
    error('Please drop an image file.')
    return
  }
  applyFile(f)
}

function applyFile(f: File) {
  fileError.value = ''
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  selectedFile.value = f
  previewUrl.value = URL.createObjectURL(f)
}

function clearFile() {
  selectedFile.value = null
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = null
  fileError.value = ''
  if (fileInput.value) fileInput.value.value = ''
}

async function handleSubmit() {
  fileError.value = ''
  if (!selectedFile.value) {
    fileError.value = 'Please select an image to upload.'
    return
  }

  loading.value = true
  uploadProgress.value = 0

  // Simulate progress while uploading
  const progressInterval = setInterval(() => {
    if (uploadProgress.value < 85) uploadProgress.value += Math.random() * 12
  }, 200)

  try {
    const fd = new FormData()
    fd.append('file', selectedFile.value)

    let res: ApiResponse<UploadResult>
    if (user.value) {
      fd.append('is_private', isPrivate.value ? 'true' : 'false')
      res = await $fetch<ApiResponse<UploadResult>>(`${config.public.apiBase}/storage/upload-file`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: fd,
      })
    } else {
      res = await $fetch<ApiResponse<UploadResult>>(`${config.public.apiBase}/storage/upload-file-guest`, {
        method: 'POST',
        body: fd,
      })
    }

    uploadProgress.value = 100
    resultPreview.value = previewUrl.value
    previewUrl.value = null
    result.value = res.data
    success('Image uploaded!')
  } catch (err: unknown) {
    const body = (err as { data?: ApiResponse<null | { error?: string }> })?.data
    const code = body?.message
    const msgMap: Record<string, string> = {
      'image-private-not-allowed': 'Private images are not available on your current plan. Upgrade to Basic or higher.',
      'image-file-too-large': 'File size exceeds your plan limit.',
      'image-quota-exceeded': 'Storage quota exceeded. Please delete some images or upgrade your plan.',
      'image-limit-reached': 'Image limit reached for your plan.',
      'image-mime-not-allowed': 'This file type is not allowed on your current plan.',
    }
    const msg = (code && msgMap[code]) || body?.data?.error || body?.message || 'Upload failed. Please try again.'
    if (code === 'image-private-not-allowed') isPrivate.value = false
    error(msg)
  } finally {
    clearInterval(progressInterval)
    loading.value = false
  }
}

async function copyResult() {
  if (!result.value?.public_url) return
  try {
    await navigator.clipboard.writeText(result.value.public_url)
    copied.value = true
    success('URL copied!')
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    error('Failed to copy.')
  }
}

function resetForm() {
  result.value = null
  if (resultPreview.value) URL.revokeObjectURL(resultPreview.value)
  resultPreview.value = null
  clearFile()
  isPrivate.value = false
  uploadProgress.value = 0
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatExpiry(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now()
  if (diff <= 0) return 'soon'
  const h = Math.floor(diff / 3_600_000)
  const m = Math.floor((diff % 3_600_000) / 60_000)
  if (h > 0) return `in ${h}h ${m}m`
  return `in ${m}m`
}
</script>
