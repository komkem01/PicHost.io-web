<template>
  <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 text-zinc-900 font-sans text-left">

    <!-- Header & Welcome Row -->
    <div class="w-full flex flex-col sm:flex-row sm:items-center justify-between items-start gap-4 mb-8 text-left">
      <div>
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 text-[11.5px] font-medium mb-3">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          {{ todayStr }}
        </div>
        <h1 class="text-2xl sm:text-[28px] font-bold tracking-tight text-zinc-900">
          {{ $t('dashboard.title') }}
        </h1>
        <p class="text-zinc-500 text-sm mt-1">
          {{ locale === 'th' ? `ยินดีต้อนรับกลับมา, ${userName}` : `Welcome back, ${userName}` }}
        </p>
      </div>

      <NuxtLink
        to="/upload"
        class="inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white text-[13.5px] font-semibold px-5 py-2.5 rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        {{ $t('nav.upload') }}
      </NuxtLink>
    </div>

    <!-- Stats Overview Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
      <!-- Card 1: Total Views -->
      <div class="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between">
        <div class="flex items-center justify-between mb-3">
          <span class="text-[12px] font-semibold text-zinc-400 uppercase tracking-wider">{{ $t('dashboard.stats.totalViews') }}</span>
          <div class="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 shrink-0 shadow-2xs">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.573 16.49 16.638 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
        <div>
          <div v-if="loading" class="h-8 w-20 bg-zinc-200 rounded-lg animate-pulse" />
          <p v-else class="text-3xl font-bold text-zinc-900 tracking-tight">{{ totalViews.toLocaleString() }}</p>
          <p class="text-[12px] text-zinc-400 mt-1">
            {{ locale === 'th' ? 'จำนวนครั้งที่ถูกเปิดดูรูปภาพรวม' : 'Total times images were viewed' }}
          </p>
        </div>
      </div>

      <!-- Card 2: Storage Used -->
      <div class="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between">
        <div class="flex items-center justify-between mb-3">
          <span class="text-[12px] font-semibold text-zinc-400 uppercase tracking-wider">{{ $t('dashboard.stats.storageUsed') }}</span>
          <div class="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 shrink-0 shadow-2xs">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 2.25c0 2.278-3.504 4.125-8.06 4.125s-8.06-1.847-8.06-4.125" />
            </svg>
          </div>
        </div>
        <div>
          <div v-if="loading" class="h-8 w-24 bg-zinc-200 rounded-lg animate-pulse" />
          <div v-else class="space-y-2">
            <div class="flex items-baseline justify-between">
              <p class="text-3xl font-bold text-zinc-900 tracking-tight">{{ totalStorageUsed }}</p>
              <span class="text-[11.5px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/70">
                {{ storagePercent }}%
              </span>
            </div>
            <!-- Progress Bar -->
            <div class="w-full bg-zinc-100 rounded-full h-1.5 overflow-hidden border border-zinc-200">
              <div class="bg-amber-500 h-full rounded-full transition-all duration-300" :style="{ width: `${storagePercent}%` }" />
            </div>
          </div>
        </div>
      </div>

      <!-- Card 3: Total Files -->
      <div class="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between">
        <div class="flex items-center justify-between mb-3">
          <span class="text-[12px] font-semibold text-zinc-400 uppercase tracking-wider">{{ $t('dashboard.stats.totalFiles') }}</span>
          <div class="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shrink-0 shadow-2xs">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0Z" />
            </svg>
          </div>
        </div>
        <div>
          <div v-if="loading" class="h-8 w-16 bg-zinc-200 rounded-lg animate-pulse" />
          <p v-else class="text-3xl font-bold text-zinc-900 tracking-tight">{{ totalImageCount.toLocaleString() }}</p>
          <p class="text-[12px] text-zinc-400 mt-1">
            {{ locale === 'th' ? 'รูปภาพจัดเก็บในระบบ' : 'Images stored in cloud' }}
          </p>
        </div>
      </div>

      <!-- Card 4: Current Plan -->
      <div class="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between">
        <div class="flex items-center justify-between mb-3">
          <span class="text-[12px] font-semibold text-zinc-400 uppercase tracking-wider">{{ $t('dashboard.stats.currentPlan') }}</span>
          <div class="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200/80 flex items-center justify-center text-purple-600 shrink-0 shadow-2xs">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
        </div>
        <div>
          <div v-if="loading" class="h-8 w-20 bg-zinc-200 rounded-lg animate-pulse" />
          <div v-else class="flex items-center justify-between">
            <p class="text-2xl font-bold text-zinc-900 tracking-tight">{{ userPlanName }}</p>
            <NuxtLink
              to="/pricing"
              class="text-[12px] font-semibold text-zinc-700 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 px-3 py-1 rounded-lg transition-colors cursor-pointer"
            >
              {{ $t('pricing.upgradeBtn') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid (Search, Filter, Image List) -->
    <div class="w-full space-y-6">

      <!-- Action Bar: Search & Filters -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-zinc-200/90 shadow-card">
        <!-- Search Input -->
        <div class="relative flex-1 min-w-[240px]">
          <svg class="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="$t('dashboard.searchPlaceholder')"
            class="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
          />
        </div>

        <!-- Custom Sort Dropdown -->
        <div ref="sortDropdownRef" class="relative shrink-0">
          <button
            type="button"
            @click="isSortOpen = !isSortOpen"
            class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-zinc-200/90 hover:border-zinc-300 text-xs font-semibold text-zinc-800 shadow-2xs hover:shadow-xs transition-all cursor-pointer select-none"
          >
            <svg class="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5-3L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
            </svg>
            <span class="text-zinc-400 font-normal hidden sm:inline">{{ $t('dashboard.sortBy') }}:</span>
            <span class="font-bold text-zinc-900">{{ currentSortLabel }}</span>
            <svg
              class="w-3.5 h-3.5 text-zinc-400 transition-transform duration-200"
              :class="{ 'rotate-180': isSortOpen }"
              fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          <!-- Dropdown Menu Popover -->
          <transition
            enter-active-class="transition ease-out duration-150 transform"
            enter-from-class="opacity-0 scale-95 -translate-y-1"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition ease-in duration-100 transform"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 -translate-y-1"
          >
            <div
              v-if="isSortOpen"
              class="absolute right-0 mt-2 w-48 rounded-2xl bg-white border border-zinc-200/90 shadow-xl p-1.5 z-50 space-y-0.5 backdrop-blur-md"
            >
              <button
                v-for="opt in sortOptions"
                :key="opt.value"
                type="button"
                @click="selectSort(opt.value as any)"
                class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left"
                :class="sortBy === opt.value ? 'bg-zinc-900 text-white shadow-xs' : 'text-zinc-700 hover:bg-zinc-100/80 hover:text-zinc-900'"
              >
                <div class="flex items-center gap-2.5">
                  <svg v-if="opt.icon === 'clock'" class="w-3.5 h-3.5 shrink-0" :class="sortBy === opt.value ? 'text-white' : 'text-zinc-400'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <svg v-else-if="opt.icon === 'eye'" class="w-3.5 h-3.5 shrink-0" :class="sortBy === opt.value ? 'text-white' : 'text-blue-500'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.573 16.49 16.638 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <svg v-else-if="opt.icon === 'size'" class="w-3.5 h-3.5 shrink-0" :class="sortBy === opt.value ? 'text-white' : 'text-amber-500'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 2.25c0 2.278-3.504 4.125-8.06 4.125s-8.06-1.847-8.06-4.125" />
                  </svg>
                  <svg v-else-if="opt.icon === 'calendar'" class="w-3.5 h-3.5 shrink-0" :class="sortBy === opt.value ? 'text-white' : 'text-zinc-400'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  <span>{{ opt.label }}</span>
                </div>
                <svg v-if="sortBy === opt.value" class="w-3.5 h-3.5 text-white shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </button>
            </div>
          </transition>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && filteredFiles.length === 0" class="rounded-2xl border border-zinc-200/90 bg-white p-12 text-center space-y-4 shadow-card">
        <div class="w-12 h-12 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto text-zinc-400">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5Z" />
          </svg>
        </div>
        <p class="text-sm font-semibold text-zinc-900">
          {{ searchQuery ? (locale === 'th' ? 'ไม่พบรูปภาพที่ค้นหา' : 'No matching images found') : (locale === 'th' ? 'คุณยังไม่มีรูปภาพในระบบ' : 'No images uploaded yet') }}
        </p>
        <p class="text-xs text-zinc-400 max-w-sm mx-auto">
          {{ searchQuery ? (locale === 'th' ? 'ลองค้นหาด้วยคำอื่น หรือประเภทไฟล์ภาพอื่น' : 'Try searching with another keyword or extension') : (locale === 'th' ? 'เริ่มต้นฝากรูปภาพแรกของคุณเข้าสู่ะระบบ PicHost.io ได้เลย' : 'Upload your first image to get started.') }}
        </p>
        <div v-if="!searchQuery" class="pt-2">
          <NuxtLink to="/upload" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-all">
            {{ $t('nav.upload') }}
          </NuxtLink>
        </div>
      </div>

      <!-- Image Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        <div
          v-for="file in paginatedFiles"
          :key="file.id"
          class="group rounded-2xl border border-zinc-200/90 bg-white overflow-hidden shadow-card hover:shadow-elevated transition-all flex flex-col justify-between"
        >
          <!-- Image Preview -->
          <div class="relative aspect-4/3 bg-zinc-100 overflow-hidden border-b border-zinc-100 flex items-center justify-center">
            <img
              :src="file.public_url || getPublicUrl(file.id)"
              :alt="file.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-zinc-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <a
                :href="getPublicUrl(file.id)"
                target="_blank"
                class="p-2 rounded-xl bg-white/90 hover:bg-white text-zinc-900 shadow-sm transition-all"
                title="View Full"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
              <button
                @click="copyUrl(getPublicUrl(file.id))"
                class="p-2 rounded-xl bg-white/90 hover:bg-white text-zinc-900 shadow-sm transition-all cursor-pointer"
                title="Copy Link"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.75v-6.75" />
                </svg>
              </button>
              <button
                @click="confirmDelete(file)"
                class="p-2 rounded-xl bg-red-600/90 hover:bg-red-600 text-white shadow-sm transition-all cursor-pointer"
                title="Delete"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
          </div>

          <!-- File Info -->
          <div class="p-3.5 space-y-2 text-left bg-white">
            <div class="flex items-center justify-between gap-1.5">
              <span class="font-bold text-[13px] text-zinc-900 truncate" :title="file.name">
                {{ file.name || 'Untitled Image' }}
              </span>
              <!-- File Extension Badge -->
              <span class="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200/80 uppercase tracking-wide shrink-0">
                {{ fileExt(file.content_type) }}
              </span>
            </div>

            <!-- Upload Date & Time -->
            <div class="flex items-center gap-1.5 text-[11px] text-zinc-400 font-medium">
              <svg class="w-3.5 h-3.5 text-zinc-400 shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="truncate">{{ formatDateTime(file.created_at) }}</span>
            </div>

            <div class="flex items-center justify-between text-[11.5px] text-zinc-400 font-medium pt-1.5 border-t border-zinc-100">
              <span class="font-mono text-zinc-500 text-[11px] font-semibold">{{ formatBytes(file.file_size) }}</span>
              <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/70 shrink-0" :title="locale === 'th' ? 'จำนวนครั้งที่ถูกเปิดดู' : 'Total views'">
                <svg class="w-3 h-3 text-blue-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.573 16.49 16.638 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{ (file as any).views_count ?? 0 }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-between pt-4 border-t border-zinc-200/80">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="px-3.5 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 disabled:opacity-40 text-xs font-semibold text-zinc-700 transition-colors cursor-pointer"
        >
          {{ $t('common.prev') }}
        </button>
        <span class="text-xs font-semibold text-zinc-500">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="px-3.5 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 disabled:opacity-40 text-xs font-semibold text-zinc-700 transition-colors cursor-pointer"
        >
          {{ $t('common.next') }}
        </button>
      </div>

    </div>

    <!-- Delete Modal -->
    <div v-if="deletingFile" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs">
      <div class="w-full max-w-sm bg-white rounded-2xl p-6 text-center space-y-4 shadow-2xl border border-zinc-100">
        <!-- Centered Red Trash Icon -->
        <div class="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto text-red-600 shadow-2xs">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </div>

        <div class="space-y-1.5">
          <h3 class="text-base font-bold text-zinc-900">
            {{ locale === 'th' ? 'ลบรูปภาพนี้หรือไม่?' : 'Delete Image?' }}
          </h3>
          <p class="text-xs text-zinc-500 leading-relaxed max-w-xs mx-auto">
            {{ locale === 'th' ? 'รูปภาพนี้จะถูกลบออกจากระบบถาวร ไม่สามารถกู้คืนได้' : 'This image will be permanently removed from your account.' }}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-3 pt-2">
          <button
            @click="deletingFile = null"
            class="w-full py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
          >
            {{ $t('common.cancel') }}
          </button>
          <button
            @click="handleDelete"
            :disabled="deleteLoading"
            class="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold disabled:opacity-50 flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <AppSpinner v-if="deleteLoading" size="sm" />
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            {{ locale === 'th' ? 'ยืนยันลบ' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { formatBytes } from '~/utils/format'

definePageMeta({ middleware: 'auth' })

const { user, getToken } = useAuth()
const { t, locale } = useI18n()
const { success: toastSuccess, error: toastError } = useToast()
const config = useRuntimeConfig()

const loading = ref(true)
const files = ref<StorageFile[]>([])

const currentPage = ref(1)
const searchQuery = ref('')
const sortBy = ref<'newest' | 'views' | 'size' | 'oldest'>('newest')
const pageSize = 12

const deletingFile = ref<StorageFile | null>(null)
const deleteLoading = ref(false)

const quota = ref<{
  plan: string
  used_storage_bytes: number
  storage_limit_bytes: number
  image_count: number
  max_images: number
  file_size_limit_bytes: number
  total_views: number
} | null>(null)

interface StorageFile {
  id: string
  name: string
  file_size: number
  content_type: string
  public_url?: string
  created_at: string
}

const userName = computed(() => user.value?.username || user.value?.email || 'User')
const userPlanName = computed(() => quota.value?.plan || user.value?.plan || 'Free')

const todayStr = computed(() => {
  return new Date().toLocaleDateString(locale.value === 'th' ? 'th-TH' : 'en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
})

function getPublicUrl(id: string): string {
  return `${config.public.apiBase.replace(/\/api\/v1$/, '')}/i/${id}`
}

function formatDateTime(dateStr: string): string {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleString(locale.value === 'th' ? 'th-TH' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const totalViews = computed(() => {
  if (quota.value && typeof quota.value.total_views === 'number') {
    return quota.value.total_views
  }
  return files.value.reduce((sum, f) => sum + (typeof (f as any).views_count === 'number' ? (f as any).views_count : 0), 0)
})

const totalImageCount = computed(() => {
  if (quota.value && typeof quota.value.image_count === 'number') {
    return quota.value.image_count
  }
  return files.value.length
})

const totalStorageUsed = computed(() => {
  if (quota.value && typeof quota.value.used_storage_bytes === 'number') {
    return formatBytes(quota.value.used_storage_bytes)
  }
  return formatBytes(files.value.reduce((sum, f) => sum + f.file_size, 0))
})

const storagePercent = computed(() => {
  if (!quota.value || quota.value.storage_limit_bytes <= 0) return 0
  const used = quota.value.used_storage_bytes ?? files.value.reduce((sum, f) => sum + f.file_size, 0)
  return Math.min(Math.round((used / quota.value.storage_limit_bytes) * 100), 100)
})

function fileExt(mime: string | null): string {
  if (!mime) return 'IMG'
  const cleanMime = mime.toLowerCase()
  if (cleanMime.includes('jpeg') || cleanMime.includes('jpg')) return 'JPG'
  if (cleanMime.includes('png')) return 'PNG'
  if (cleanMime.includes('webp')) return 'WEBP'
  if (cleanMime.includes('gif')) return 'GIF'
  if (cleanMime.includes('avif')) return 'AVIF'
  if (cleanMime.includes('svg')) return 'SVG'
  return cleanMime.split('/')[1]?.toUpperCase() || 'IMG'
}

const filteredFiles = computed(() => {
  let list = [...files.value]

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter((f) => {
      const ext = fileExt(f.content_type).toLowerCase()
      const code = (f.short_code || f.id || '').toLowerCase()
      const name = (f.name || '').toLowerCase()
      const mime = (f.content_type || '').toLowerCase()
      return (
        name.includes(q) ||
        code.includes(q) ||
        ext.includes(q) ||
        mime.includes(q)
      )
    })
  }

  if (sortBy.value === 'newest') {
    list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  } else if (sortBy.value === 'oldest') {
    list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  } else if (sortBy.value === 'views') {
    list.sort((a, b) => ((b as any).views_count || 0) - ((a as any).views_count || 0))
  } else if (sortBy.value === 'size') {
    list.sort((a, b) => b.file_size - a.file_size)
  }

  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredFiles.value.length / pageSize)))

const paginatedFiles = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredFiles.value.slice(start, start + pageSize)
})

async function apiFetch<T>(path: string, options: any = {}): Promise<T> {
  const token = getToken()
  return $fetch<T>(`${config.public.apiBase}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
}

async function loadData() {
  loading.value = true
  try {
    const [filesRes, quotaRes] = await Promise.allSettled([
      apiFetch<{ data: any[] }>('/images'),
      apiFetch<{ data: any }>('/auth/quota'),
    ])

    if (filesRes.status === 'fulfilled' && Array.isArray(filesRes.value?.data)) {
      files.value = filesRes.value.data.map((f: any) => ({
        id: f.id,
        name: f.short_code ? `Image #${f.short_code}` : `Image #${f.id?.slice(0, 8)}`,
        file_size: f.file_size || 0,
        content_type: f.mime_type || 'image/jpeg',
        public_url: f.public_url || getPublicUrl(f.id),
        created_at: f.created_at,
        views_count: f.views_count ?? 0,
      }))
    } else {
      try {
        const fallback = await apiFetch<{ data: StorageFile[] }>('/storage/files')
        if (fallback?.data) files.value = fallback.data
      } catch {}
    }

    if (quotaRes.status === 'fulfilled' && quotaRes.value?.data) {
      quota.value = quotaRes.value.data
    }
  } catch (err: any) {
    toastError(err?.message || 'Failed to load dashboard data')
  } finally {
    loading.value = false
  }
}

function copyUrl(url: string) {
  navigator.clipboard.writeText(url)
  toastSuccess(locale.value === 'th' ? 'คัดลอกลิงก์เรียบร้อยแล้ว' : 'Link copied to clipboard')
}

function confirmDelete(file: StorageFile) {
  deletingFile.value = file
}

async function handleDelete() {
  if (!deletingFile.value || deleteLoading.value) return
  deleteLoading.value = true
  try {
    await apiFetch(`/storage/files/${deletingFile.value.id}`, { method: 'DELETE' })
    toastSuccess(locale.value === 'th' ? 'ลบรูปภาพเรียบร้อยแล้ว' : 'Image deleted successfully')
    files.value = files.value.filter((f) => f.id !== deletingFile.value!.id)
    deletingFile.value = null
  } catch (err: any) {
    toastError(err?.message || 'Failed to delete file')
  } finally {
    deleteLoading.value = false
  }
}

const isSortOpen = ref(false)
const sortDropdownRef = ref<HTMLElement | null>(null)

const sortOptions = computed(() => [
  { value: 'newest', label: t('dashboard.sortNewest'), icon: 'clock' },
  { value: 'views', label: t('dashboard.sortViews'), icon: 'eye' },
  { value: 'size', label: t('dashboard.sortSize'), icon: 'size' },
  { value: 'oldest', label: t('dashboard.sortOldest'), icon: 'calendar' },
])

const currentSortLabel = computed(() => {
  const opt = sortOptions.value.find((o) => o.value === sortBy.value)
  return opt ? opt.label : t('dashboard.sortNewest')
})

function selectSort(val: 'newest' | 'oldest' | 'views' | 'size') {
  sortBy.value = val
  isSortOpen.value = false
}

function handleClickOutside(e: MouseEvent) {
  if (sortDropdownRef.value && !sortDropdownRef.value.contains(e.target as Node)) {
    isSortOpen.value = false
  }
}

let quotaPollTimer: ReturnType<typeof setInterval> | null = null

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  await loadData()
  quotaPollTimer = setInterval(async () => {
    try {
      const res = await apiFetch<{ data: any }>('/auth/quota')
      if (res?.data) quota.value = res.data
    } catch {}
  }, 4000)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (quotaPollTimer) clearInterval(quotaPollTimer)
})
</script>
