<template>
  <div class="p-6 md:p-8 w-full max-w-7xl mx-auto space-y-6">

    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200/80">
      <div>
        <h1 class="text-xl font-bold text-zinc-900 tracking-tight flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-zinc-900 text-white flex items-center justify-center shadow-xs">
            <svg class="w-4.5 h-4.5 text-zinc-100" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 5.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125m16.5 5.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
            </svg>
          </div>
          <span>{{ $t('admin.storage.title') }}</span>
        </h1>
        <p class="text-xs text-zinc-500 mt-1">{{ $t('admin.storage.subtitle') }}</p>
      </div>

      <div class="flex items-center gap-2.5">
        <!-- Status health badge -->
        <span
          v-if="stats"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11.5px] font-semibold transition shadow-2xs"
          :class="(stats.orphan_files || 0) > 0
            ? 'border-amber-200 bg-amber-50 text-amber-800'
            : 'border-emerald-200 bg-emerald-50 text-emerald-700'"
        >
          <span
            class="w-2 h-2 rounded-full"
            :class="(stats.orphan_files || 0) > 0 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'"
          />
          <span>{{ (stats.orphan_files || 0) > 0 ? $t('admin.storage.needsCleanup') : $t('admin.storage.healthyStatus') }}</span>
        </span>

        <button
          @click="exportStorageCsv"
          :disabled="loading"
          class="h-9 px-3.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-medium transition-all shadow-2xs flex items-center gap-1.5 active:scale-95 disabled:opacity-40 cursor-pointer"
        >
          <svg class="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          <span>{{ $t('common.exportCsv') }}</span>
        </button>

        <button
          @click="loadAll"
          :disabled="loading"
          class="h-9 px-3.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-medium transition-all shadow-2xs flex items-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <svg class="w-3.5 h-3.5 text-zinc-500" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          <span>{{ $t('common.refresh') }}</span>
        </button>
      </div>
    </div>

    <!-- Loading Skeleton -->
    <template v-if="loading && !stats">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="h-28 rounded-2xl bg-zinc-100 border border-zinc-200 animate-pulse" />
      </div>
      <div class="h-64 rounded-2xl bg-zinc-100 border border-zinc-200 animate-pulse" />
    </template>

    <!-- Error State -->
    <div v-else-if="error" class="rounded-2xl border border-red-200 bg-red-50 p-6 text-xs text-red-700 space-y-2">
      <p class="font-bold text-sm">ไม่สามารถโหลดข้อมูลพื้นที่จัดเก็บได้</p>
      <p>{{ error }}</p>
      <button @click="loadAll" class="px-3 py-1.5 rounded-xl bg-red-600 text-white font-semibold text-xs hover:bg-red-500 transition-colors">
        ลองใหม่อีกครั้ง
      </button>
    </div>

    <template v-else>
      <!-- KPI Stats 4 Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <!-- Card 1: Total Stored Files -->
        <div class="rounded-2xl border border-zinc-200 bg-white shadow-card p-5 space-y-2 hover:border-zinc-300 transition">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">{{ $t('admin.storage.totalFiles') }}</span>
            <div class="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold tracking-tight text-zinc-900 tabular-nums">
            {{ (stats?.total_files || 0).toLocaleString() }}
          </p>
          <div class="flex items-center gap-1.5 text-[11px] text-zinc-400">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span>ไฟล์ที่จัดเก็บในฐานข้อมูล</span>
          </div>
        </div>

        <!-- Card 2: Total Storage Used -->
        <div class="rounded-2xl border border-zinc-200 bg-white shadow-card p-5 space-y-2 hover:border-zinc-300 transition">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">{{ $t('admin.storage.totalStorage') }}</span>
            <div class="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200/80 flex items-center justify-center text-purple-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 5.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold tracking-tight text-zinc-900 tabular-nums">
            {{ formatBytes(stats?.total_bytes || 0) }}
          </p>
          <div class="flex items-center gap-1.5 text-[11px] text-zinc-400">
            <span class="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
            <span>พื้นที่ดิสก์และคลาวด์ทั้งหมด</span>
          </div>
        </div>

        <!-- Card 3: Orphaned Files -->
        <div
          class="rounded-2xl border shadow-card p-5 space-y-2 transition"
          :class="(stats?.orphan_files || 0) > 0
            ? 'border-amber-200 bg-amber-50/40 hover:border-amber-300'
            : 'border-zinc-200 bg-white hover:border-zinc-300'"
        >
          <div class="flex items-center justify-between">
            <span
              class="text-[11px] font-semibold uppercase tracking-wider"
              :class="(stats?.orphan_files || 0) > 0 ? 'text-amber-800' : 'text-zinc-500'"
            >{{ $t('admin.storage.orphanFiles') }}</span>
            <div
              class="w-8 h-8 rounded-xl flex items-center justify-center border"
              :class="(stats?.orphan_files || 0) > 0
                ? 'bg-amber-100 border-amber-300 text-amber-700'
                : 'bg-zinc-100 border-zinc-200 text-zinc-500'"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.008v.008H12v-.008Z" />
              </svg>
            </div>
          </div>
          <p
            class="text-2xl font-bold tracking-tight tabular-nums"
            :class="(stats?.orphan_files || 0) > 0 ? 'text-amber-900' : 'text-zinc-900'"
          >
            {{ (stats?.orphan_files || 0).toLocaleString() }}
          </p>
          <div
            class="flex items-center gap-1.5 text-[11px]"
            :class="(stats?.orphan_files || 0) > 0 ? 'text-amber-700' : 'text-zinc-400'"
          >
            <span
              class="w-1.5 h-1.5 rounded-full"
              :class="(stats?.orphan_files || 0) > 0 ? 'bg-amber-500' : 'bg-zinc-400'"
            ></span>
            <span>ไม่มีรูปภาพหรือสลิปเชื่อมโยง</span>
          </div>
        </div>

        <!-- Card 4: Recoverable Space -->
        <div
          class="rounded-2xl border shadow-card p-5 space-y-2 transition"
          :class="(stats?.orphan_bytes || 0) > 0
            ? 'border-emerald-200 bg-emerald-50/40 hover:border-emerald-300'
            : 'border-zinc-200 bg-white hover:border-zinc-300'"
        >
          <div class="flex items-center justify-between">
            <span
              class="text-[11px] font-semibold uppercase tracking-wider"
              :class="(stats?.orphan_bytes || 0) > 0 ? 'text-emerald-800' : 'text-zinc-500'"
            >{{ $t('admin.storage.orphanStorage') }}</span>
            <div
              class="w-8 h-8 rounded-xl flex items-center justify-center border"
              :class="(stats?.orphan_bytes || 0) > 0
                ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                : 'bg-zinc-100 border-zinc-200 text-zinc-500'"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </div>
          </div>
          <p
            class="text-2xl font-bold tracking-tight tabular-nums"
            :class="(stats?.orphan_bytes || 0) > 0 ? 'text-emerald-800' : 'text-zinc-900'"
          >
            {{ formatBytes(stats?.orphan_bytes || 0) }}
          </p>
          <div
            class="flex items-center gap-1.5 text-[11px]"
            :class="(stats?.orphan_bytes || 0) > 0 ? 'text-emerald-700' : 'text-zinc-400'"
          >
            <span
              class="w-1.5 h-1.5 rounded-full"
              :class="(stats?.orphan_bytes || 0) > 0 ? 'bg-emerald-500' : 'bg-zinc-400'"
            ></span>
            <span>พื้นที่ที่สามารถเรียกคืนได้</span>
          </div>
        </div>

      </div>

      <!-- Provider Breakdown Bar -->
      <div v-if="stats?.provider_breakdown && Object.keys(stats.provider_breakdown).length > 0" class="rounded-2xl border border-zinc-200 bg-white shadow-card p-5 space-y-3">
        <div class="flex items-center justify-between">
          <h2 class="text-xs font-bold uppercase tracking-wider text-zinc-500">{{ $t('admin.storage.providerBreakdown') }}</h2>
          <span class="text-[11px] text-zinc-400 font-mono">{{ Object.keys(stats.provider_breakdown).length }} Providers</span>
        </div>

        <div class="flex flex-wrap items-center gap-3 pt-1">
          <div
            v-for="(bytes, provider) in stats.provider_breakdown"
            :key="provider"
            class="px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/70 flex items-center gap-3 shadow-2xs"
          >
            <div class="w-2.5 h-2.5 rounded-full" :class="providerColor(provider)"></div>
            <div>
              <p class="text-xs font-bold text-zinc-900 capitalize">{{ provider }}</p>
              <p class="text-[11px] text-zinc-500 tabular-nums">{{ formatBytes(bytes) }} ({{ calculatePercent(bytes, stats.total_bytes) }}%)</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Orphaned Files Action Banner (When files need cleaning) -->
      <div
        v-if="(stats?.orphan_files || 0) > 0 || orphanedList.length > 0"
        class="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50/90 via-amber-50/50 to-amber-100/40 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-card"
      >
        <div class="flex items-start gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </div>
          <div>
            <h3 class="text-sm font-bold text-amber-950">
              ตรวจพบไฟล์ขยะตกค้าง {{ (stats?.orphan_files || orphanedList.length).toLocaleString() }} ไฟล์ ({{ formatBytes(stats?.orphan_bytes || totalOrphanedBytes) }})
            </h3>
            <p class="text-xs text-amber-800/90 mt-0.5 leading-relaxed">
              ไฟล์เหล่านี้ไม่มีรูปภาพหรือสลิปการชำระเงินอ้างอิงถึง สามารถกดล้างเพื่อเรียกคืนพื้นที่จัดเก็บบนคลาวด์ได้ทันที
            </p>
          </div>
        </div>

        <button
          @click="showCleanupModal = true"
          class="h-10 px-5 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
          <span>{{ $t('admin.storage.cleanupAll') }}</span>
        </button>
      </div>

      <!-- Orphaned Files Table Card -->
      <div class="rounded-2xl border border-zinc-200 bg-white shadow-card overflow-hidden">
        
        <!-- Filter Toolbar -->
        <div class="p-4 border-b border-zinc-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-50/40">
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 max-w-xl">
            <!-- Search input -->
            <div class="relative flex-1">
              <svg class="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="$t('admin.storage.searchPlaceholder')"
                class="w-full h-9 pl-9 pr-3 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 shadow-2xs transition"
              />
            </div>

            <!-- Provider filter -->
            <div class="w-full sm:w-44">
              <AppSelect
                v-model="filterProvider"
                :options="providerOptions"
              />
            </div>
          </div>

          <div class="flex items-center gap-2 text-xs font-semibold text-zinc-600">
            <span class="px-3 py-1 rounded-lg bg-zinc-100 border border-zinc-200 tabular-nums">
              {{ filteredList.length.toLocaleString() }} รายการ
            </span>
          </div>
        </div>

        <!-- Table View -->
        <div v-if="filteredList.length === 0" class="py-16 text-center text-zinc-400 text-xs space-y-2">
          <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <p class="font-bold text-sm text-zinc-700">{{ $t('admin.storage.noOrphan') }}</p>
          <p class="text-zinc-400 text-xs">ไฟล์ทั้งหมดใน Storage มีการเชื่อมโยงกับรูปภาพหรือสลิปอย่างถูกต้อง</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-xs min-w-[800px]">
            <thead class="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase text-[10.5px] tracking-wider">
              <tr>
                <th class="px-5 py-3 font-semibold">Short Code / Storage ID</th>
                <th class="px-4 py-3 font-semibold">Provider</th>
                <th class="px-4 py-3 font-semibold">ขนาดไฟล์</th>
                <th class="px-4 py-3 font-semibold">ประเภทไฟล์</th>
                <th class="px-4 py-3 font-semibold">วันที่สร้าง</th>
                <th class="px-5 py-3 font-semibold text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-200/70">
              <tr v-for="item in paginatedList" :key="item.id" class="hover:bg-zinc-50/80 transition-colors">
                
                <!-- Short Code & UUID snippet -->
                <td class="px-5 py-3.5">
                  <div class="flex items-center gap-2">
                    <span class="font-mono font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded-md border border-zinc-200/80">
                      {{ item.short_code || '—' }}
                    </span>
                    <button
                      v-if="item.short_code"
                      type="button"
                      @click="copyText(item.short_code)"
                      class="text-zinc-400 hover:text-zinc-700 p-1 cursor-pointer"
                      title="คัดลอก Short Code"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v2.25A2.25 2.25 0 0 1 13.5 21h-7.5A2.25 2.25 0 0 1 3.75 18.75V7.5A2.25 2.25 0 0 1 6 5.25h2.25m3 0h4.5A2.25 2.25 0 0 1 18 7.5v11.25a2.25 2.25 0 0 1-2.25 2.25h-4.5A2.25 2.25 0 0 1 9 18.75V7.5A2.25 2.25 0 0 1 11.25 5.25Z" />
                      </svg>
                    </button>
                    <span class="text-[10px] text-zinc-400 font-mono truncate max-w-[140px]" :title="item.id">
                      {{ item.id }}
                    </span>
                  </div>
                </td>

                <!-- Provider badge -->
                <td class="px-4 py-3.5">
                  <span
                    class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border capitalize"
                    :class="providerBadgeClass(item.provider)"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" :class="providerDotClass(item.provider)"></span>
                    {{ item.provider || 'local' }}
                  </span>
                </td>

                <!-- File size -->
                <td class="px-4 py-3.5 font-bold text-zinc-900 tabular-nums">
                  {{ formatBytes(item.file_size) }}
                </td>

                <!-- MIME Type -->
                <td class="px-4 py-3.5">
                  <span class="inline-block px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600 font-mono text-[10.5px]">
                    {{ item.mime_type || 'unknown' }}
                  </span>
                </td>

                <!-- Created Date -->
                <td class="px-4 py-3.5 text-zinc-500 tabular-nums text-[11.5px] whitespace-nowrap">
                  {{ formatDate(item.created_at) }}
                </td>

                <!-- Action button -->
                <td class="px-5 py-3.5 text-right whitespace-nowrap">
                  <button
                    @click="deleteSingleOrphan(item.id)"
                    class="h-7 px-2.5 inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100/70 text-red-700 text-[11px] font-medium transition cursor-pointer"
                    title="ลบไฟล์นี้ออกจาก Storage"
                  >
                    <svg class="w-3 h-3 text-red-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                    <span>ลบ</span>
                  </button>
                </td>

              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <AppPagination
          v-if="filteredList.length > pageSize"
          v-model:page="currentPage"
          :total="filteredList.length"
          :limit="pageSize"
        />
      </div>
    </template>

    <!-- Cleanup Confirmation Modal -->
    <Teleport to="body">
      <div v-if="showCleanupModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs" @click.self="showCleanupModal = false">
        <div class="relative w-full max-w-[430px] rounded-2xl border border-zinc-200 bg-white shadow-2xl p-6 text-center space-y-4">
          <div class="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </div>

          <div class="space-y-1">
            <h3 class="text-base font-bold text-zinc-900">{{ $t('admin.storage.cleanupAll') }}</h3>
            <p class="text-xs text-zinc-500 leading-relaxed">
              {{ $t('admin.storage.cleanupConfirm') }}
            </p>
          </div>

          <div class="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs space-y-2 text-left">
            <div class="flex justify-between text-zinc-600">
              <span>จำนวนไฟล์ขยะที่จะลบ:</span>
              <strong class="text-zinc-900 font-mono text-[13px]">{{ (stats?.orphan_files || orphanedList.length).toLocaleString() }} ไฟล์</strong>
            </div>
            <div class="flex justify-between text-zinc-600">
              <span>พื้นที่ที่เรียกคืนได้:</span>
              <strong class="text-emerald-700 font-mono text-[13px]">{{ formatBytes(stats?.orphan_bytes || totalOrphanedBytes) }}</strong>
            </div>
          </div>

          <div class="flex items-center gap-2 pt-2">
            <button
              @click="showCleanupModal = false"
              class="flex-1 py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-medium cursor-pointer"
            >
              {{ $t('common.cancel') }}
            </button>
            <button
              @click="executeCleanup"
              :disabled="cleaning"
              class="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold cursor-pointer disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
            >
              <svg v-if="cleaning" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>{{ cleaning ? 'กำลังล้างไฟล์...' : $t('admin.storage.cleanNow') }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { exportToCsv } from '~/utils/export'

const { t, locale } = useI18n()
const { success: toastSuccess, error: toastError } = useToast()

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

interface StorageStats {
  total_files: number
  total_bytes: number
  orphan_files: number
  orphan_bytes: number
  provider_breakdown: Record<string, number>
}

interface OrphanedStorageItem {
  id: string
  short_code: string
  provider: string
  file_size: number
  mime_type: string
  created_at: string
}

const stats = ref<StorageStats | null>(null)
const orphanedList = ref<OrphanedStorageItem[]>([])
const loading = ref(true)
const cleaning = ref(false)
const error = ref('')
const showCleanupModal = ref(false)

const searchQuery = ref('')
const filterProvider = ref('')
const currentPage = ref(1)
const pageSize = 15

const providerOptions = computed(() => {
  const providers = new Set<string>()
  orphanedList.value.forEach(i => {
    if (i.provider) providers.add(i.provider)
  })
  if (stats.value?.provider_breakdown) {
    Object.keys(stats.value.provider_breakdown).forEach(p => providers.add(p))
  }
  return [
    { label: t('admin.storage.allProviders'), value: '' },
    ...Array.from(providers).map(p => ({ label: p.charAt(0).toUpperCase() + p.slice(1), value: p }))
  ]
})

const filteredList = computed(() => {
  let list = orphanedList.value
  if (filterProvider.value) {
    list = list.filter(item => item.provider === filterProvider.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(item =>
      (item.id && item.id.toLowerCase().includes(q)) ||
      (item.short_code && item.short_code.toLowerCase().includes(q)) ||
      (item.mime_type && item.mime_type.toLowerCase().includes(q))
    )
  }
  return list
})

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredList.value.slice(start, start + pageSize)
})

const totalOrphanedBytes = computed(() => {
  return orphanedList.value.reduce((sum, item) => sum + (item.file_size || 0), 0)
})

async function loadAll() {
  loading.value = true
  error.value = ''
  try {
    const [statsRes, orphanedRes] = await Promise.all([
      apiFetch<any>('/admin/storage/stats'),
      apiFetch<any>('/admin/storage/orphaned', { params: { limit: 100 } })
    ])
    stats.value = statsRes.data
    orphanedList.value = orphanedRes.data?.items || []
  } catch (e: any) {
    error.value = e?.data?.message || e?.message || 'Failed to load storage data'
  } finally {
    loading.value = false
  }
}

async function executeCleanup() {
  cleaning.value = true
  try {
    const res = await apiFetch<any>('/admin/storage/cleanup', {
      method: 'POST'
    })
    const count = res.data?.deleted_count || 0
    showCleanupModal.value = false
    toastSuccess(t('toast.cleanupSuccess', { count }))
    await loadAll()
  } catch (e: any) {
    toastError(t('toast.cleanupError'))
  } finally {
    cleaning.value = false
  }
}

async function deleteSingleOrphan(id: string) {
  try {
    await apiFetch('/admin/storage/cleanup', {
      method: 'POST',
      body: { ids: [id] }
    })
    toastSuccess(t('toast.deleteSuccess'))
    await loadAll()
  } catch (e) {
    toastError(t('toast.deleteError'))
  }
}

async function copyText(text: string) {
  if (!text) return
  await navigator.clipboard.writeText(text)
  toastSuccess(t('toast.copySuccess'))
}

function exportStorageCsv() {
  const headers = [
    { label: 'รหัสพื้นที่จัดเก็บ (Storage ID)', key: 'id' },
    { label: 'รหัสอ้างอิง (Short Code)', key: 'short_code' },
    { label: 'ผู้ให้บริการจัดเก็บ (Provider)', key: 'provider' },
    { label: 'ขนาดไฟล์ (File Size)', key: 'file_size_formatted' },
    { label: 'ประเภทไฟล์ (MIME Type)', key: 'mime_type' },
    { label: 'วันที่บันทึก (Created At)', key: 'created_at_formatted' }
  ]
  const data = filteredList.value.map(s => ({
    id: s.id,
    short_code: s.short_code || '-',
    provider: s.provider,
    file_size_formatted: formatBytes(s.file_size || 0),
    mime_type: s.mime_type || '-',
    created_at_formatted: s.created_at ? new Date(s.created_at).toLocaleString('th-TH') : '-'
  }))
  exportToCsv('pichost_orphaned_storage', headers, data)
}

function formatBytes(bytes?: number): string {
  if (!bytes || bytes <= 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

function calculatePercent(bytes: number, total?: number): string {
  if (!total || total <= 0) return '0'
  return Math.min(100, Math.round((bytes / total) * 100)).toString()
}

function formatDate(iso?: string) {
  if (!iso) return '-'
  return new Date(iso).toLocaleDateString(locale.value === 'th' ? 'th-TH' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function providerBadgeClass(provider?: string) {
  switch (provider?.toLowerCase()) {
    case 'railway':
      return 'border-purple-200 bg-purple-50 text-purple-700'
    case 's3':
    case 'aws':
      return 'border-amber-200 bg-amber-50 text-amber-700'
    case 'r2':
    case 'cloudflare':
      return 'border-orange-200 bg-orange-50 text-orange-700'
    case 'local':
      return 'border-blue-200 bg-blue-50 text-blue-700'
    default:
      return 'border-zinc-200 bg-zinc-50 text-zinc-700'
  }
}

function providerDotClass(provider?: string) {
  switch (provider?.toLowerCase()) {
    case 'railway': return 'bg-purple-500'
    case 's3':
    case 'aws': return 'bg-amber-500'
    case 'r2':
    case 'cloudflare': return 'bg-orange-500'
    case 'local': return 'bg-blue-500'
    default: return 'bg-zinc-500'
  }
}

function providerColor(provider?: string) {
  switch (provider?.toLowerCase()) {
    case 'railway': return 'bg-purple-500'
    case 's3':
    case 'aws': return 'bg-amber-500'
    case 'r2':
    case 'cloudflare': return 'bg-orange-500'
    case 'local': return 'bg-blue-500'
    default: return 'bg-zinc-500'
  }
}

onMounted(() => {
  loadAll()
})
</script>
