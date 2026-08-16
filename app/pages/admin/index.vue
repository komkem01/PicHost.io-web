<template>
  <div class="p-6 md:p-8 w-full min-w-0 max-w-full space-y-6">

    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200/80">
      <div>
        <h2 class="text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-2.5">
          <span>{{ $t('admin.overview.title') || 'ภาพรวมระบบผู้ดูแลระบบ' }}</span>
        </h2>
        <p class="text-xs text-zinc-500 mt-1 flex items-center gap-2">
          <span>{{ todayStr }}</span>
          <span class="w-1 h-1 rounded-full bg-zinc-300" />
          <span class="font-mono text-[11px] text-zinc-400">PicHost Analytics Console</span>
        </p>
      </div>

      <div class="flex items-center gap-2.5">
        <button
          @click="exportDashboardSummary"
          :disabled="!stats"
          class="h-9 px-3.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-medium transition-all shadow-2xs flex items-center gap-1.5 active:scale-95 disabled:opacity-40 cursor-pointer"
        >
          <svg class="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          <span>{{ $t('common.exportCsv') }}</span>
        </button>

        <button
          @click="fetchData"
          :disabled="refreshing"
          class="h-9 px-3.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-medium transition-all shadow-2xs flex items-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <svg class="w-3.5 h-3.5 text-zinc-500" :class="{ 'animate-spin': refreshing }" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          <span>{{ refreshing ? ($t('common.loading') || 'กำลังโหลด...') : ($t('common.refresh') || 'รีเฟรชข้อมูล') }}</span>
        </button>

        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 text-[11px] font-semibold text-emerald-700 shadow-2xs">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{{ $t('admin.overview.live') || 'ระบบออนไลน์' }}</span>
        </span>
      </div>
    </div>

    <!-- Loading Skeleton -->
    <template v-if="loading">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="h-28 rounded-2xl bg-zinc-100 border border-zinc-200 animate-pulse" />
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="lg:col-span-8 h-80 rounded-2xl bg-zinc-100 border border-zinc-200 animate-pulse" />
        <div class="lg:col-span-4 h-80 rounded-2xl bg-zinc-100 border border-zinc-200 animate-pulse" />
      </div>
    </template>

    <!-- Error State -->
    <div v-else-if="error" class="rounded-2xl border border-red-200 bg-red-50 p-6 text-xs text-red-700 space-y-2">
      <p class="font-bold text-sm">ไม่สามารถโหลดข้อมูลสถิติได้</p>
      <p>{{ error }}</p>
      <button @click="fetchData" class="px-3 py-1.5 rounded-xl bg-red-600 text-white font-semibold text-xs hover:bg-red-500 transition-colors">
        ลองใหม่อีกครั้ง
      </button>
    </div>

    <!-- Main Dashboard Body -->
    <template v-else-if="stats">
      <!-- Top 4 Primary KPI Metrics Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <!-- Total Users Card -->
        <div class="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-card hover:shadow-md transition-shadow relative overflow-hidden group">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{{ $t('admin.overview.totalUsers') || 'ผู้ใช้งานทั้งหมด' }}</span>
            <div class="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
            </div>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-3xl font-extrabold text-zinc-900 tabular-nums">{{ stats.total_users.toLocaleString() }}</span>
            <span class="text-xs text-zinc-500 font-medium">คน</span>
          </div>
          <div class="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
            <span>สมาชิก: <strong class="text-emerald-700 font-semibold tabular-nums">{{ registeredCount.toLocaleString() }}</strong></span>
            <span>Guest: <strong class="text-amber-700 font-semibold tabular-nums">{{ stats.guest_users.toLocaleString() }}</strong></span>
          </div>
        </div>

        <!-- Active Users Card -->
        <div class="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-card hover:shadow-md transition-shadow relative overflow-hidden group">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{{ $t('admin.overview.active') || 'บัญชีเปิดใช้งาน' }}</span>
            <div class="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-105 transition-transform">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-3xl font-extrabold text-zinc-900 tabular-nums">{{ stats.active_users.toLocaleString() }}</span>
            <span class="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
              {{ activeRate }}% Active
            </span>
          </div>
          <div class="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
            <span>อัตราการใช้งาน: <strong class="text-purple-700 font-semibold tabular-nums">{{ activeRate }}%</strong></span>
            <span>สัดส่วน Guest: <strong class="text-amber-700 font-semibold tabular-nums">{{ guestRate }}%</strong></span>
          </div>
        </div>

        <!-- Total Storage Used Card -->
        <div class="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-card hover:shadow-md transition-shadow relative overflow-hidden group">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold text-zinc-500 uppercase tracking-wider">พื้นที่จัดเก็บทั้งหมด</span>
            <div class="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 14.25h13.5m-13.5 3h13.5m-13.5 3h13.5M3 3h18v6H3V3z" />
              </svg>
            </div>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl font-extrabold text-zinc-900 tabular-nums">{{ formatSize(totalStorageBytes) }}</span>
          </div>
          <div class="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
            <span>สมาชิก: <strong class="text-emerald-700 font-semibold tabular-nums">{{ formatSize(registeredStorageBytes) }}</strong></span>
            <span>Guest: <strong class="text-amber-700 font-semibold tabular-nums">{{ formatSize(stats.guest_storage_bytes) }}</strong></span>
          </div>
        </div>

        <!-- Total Images Card -->
        <div class="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-card hover:shadow-md transition-shadow relative overflow-hidden group">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold text-zinc-500 uppercase tracking-wider">รูปภาพในระบบรวม</span>
            <div class="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-105 transition-transform">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
            </div>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-3xl font-extrabold text-zinc-900 tabular-nums">{{ totalImagesCount.toLocaleString() }}</span>
            <span class="text-xs text-zinc-500 font-medium">ไฟล์</span>
          </div>
          <div class="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
            <span>รูปภาพ Guest: <strong class="text-amber-700 font-semibold tabular-nums">{{ stats.guest_images.toLocaleString() }}</strong></span>
            <span>แคช 24 ชม.</span>
          </div>
        </div>

      </div>

      <!-- Advanced Deep Analytics Bar -->
      <div class="rounded-2xl border border-zinc-200/80 bg-zinc-900 text-white p-6 shadow-card space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-1-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.25 2.25 3.75-3.75" />
              </svg>
            </div>
            <div>
              <h3 class="text-base font-bold text-white">การวิเคราะห์สถิติและการเงินเชิงลึก (System Analytics & Financial Projection)</h3>
              <p class="text-xs text-zinc-400">สรุปข้อมูลเชิงลึก รายได้คาดการณ์ และการเติบโตของผู้ใช้งาน</p>
            </div>
          </div>
          <span class="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold self-start sm:self-auto">
            📈 Real-Time Analytical Matrix
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          
          <div class="p-4 rounded-xl bg-zinc-800/80 border border-zinc-700/60 space-y-1">
            <p class="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">รายได้ประมาณการรวม/เดือน</p>
            <p class="text-2xl font-extrabold text-emerald-400 tabular-nums">฿{{ estimatedMonthlyRevenue.toLocaleString() }} <span class="text-xs text-zinc-400 font-normal">THB</span></p>
            <p class="text-[10.5px] text-zinc-500">{{ paidPlanNamesText }}</p>
          </div>

          <div class="p-4 rounded-xl bg-zinc-800/80 border border-zinc-700/60 space-y-1">
            <p class="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">อัตราส่วนสมาชิกชำระเงิน (Conversion Rate)</p>
            <p class="text-2xl font-extrabold text-purple-400 tabular-nums">{{ conversionRate }}%</p>
            <p class="text-[10.5px] text-zinc-500">{{ paidSubscribersCount.toLocaleString() }} สมาชิกที่ชำระเงิน</p>
          </div>

          <div class="p-4 rounded-xl bg-zinc-800/80 border border-zinc-700/60 space-y-1">
            <p class="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">พื้นที่จัดเก็บเฉลี่ย/ผู้ใช้</p>
            <p class="text-2xl font-extrabold text-blue-400 tabular-nums">{{ formatSize(avgStoragePerUser) }}</p>
            <p class="text-[10.5px] text-zinc-500">คำนวณจากสมาชิกที่ลงทะเบียน</p>
          </div>

          <div class="p-4 rounded-xl bg-zinc-800/80 border border-zinc-700/60 space-y-1">
            <p class="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">จำนวนรูปภาพเฉลี่ย/ผู้ใช้</p>
            <p class="text-2xl font-extrabold text-amber-400 tabular-nums">{{ avgImagesPerUser }} <span class="text-xs text-zinc-400 font-normal">รูป</span></p>
            <p class="text-[10.5px] text-zinc-500">อัตราส่วนการอัปโหลดรูปต่อคน</p>
          </div>

        </div>
      </div>

      <!-- Main Analytics & Hub Section -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">

        <!-- Left Column: Plan Breakdown Table & Guest Activity -->
        <div class="lg:col-span-8 space-y-6">

          <!-- Comprehensive Package & Financial Matrix Table -->
          <div class="rounded-2xl border border-zinc-200/80 bg-white shadow-card overflow-hidden">
            <div class="p-6 pb-4 border-b border-zinc-100 flex items-center justify-between">
              <div>
                <h3 class="text-base font-bold text-zinc-900 flex items-center gap-2">
                  <svg class="w-4.5 h-4.5 text-zinc-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-1-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.25 2.25 3.75-3.75" />
                  </svg>
                  <span>ตารางวิเคราะห์สถิติและรายได้จำแนกตามแพ็กเกจ</span>
                </h3>
                <p class="text-xs text-zinc-500 mt-0.5">การวิเคราะห์จำนวนสมาชิก สัดส่วนตลาด และประมาณการรายได้</p>
              </div>

              <NuxtLink
                to="/admin/plans"
                class="px-3 py-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 transition-colors shadow-2xs"
              >
                จัดการเงื่อนไขแพ็กเกจ
              </NuxtLink>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-zinc-50/80 border-b border-zinc-200/80 text-[11px] uppercase tracking-wider text-zinc-500 font-semibold">
                    <th class="px-5 py-3.5">แพ็กเกจ (Plan)</th>
                    <th class="px-4 py-3.5">ราคา/เดือน</th>
                    <th class="px-4 py-3.5">จำนวนสมาชิก</th>
                    <th class="px-4 py-3.5">สัดส่วนตลาด (%)</th>
                    <th class="px-5 py-3.5 text-right">รายได้ประเมิน/เดือน</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-zinc-200/60 text-xs">
                  <tr v-for="item in planAnalyticsRows" :key="item.plan" class="hover:bg-zinc-50/60 transition-colors">
                    <td class="px-5 py-4 whitespace-nowrap">
                      <div class="flex items-center gap-2.5">
                        <span class="w-3 h-3 rounded-full shrink-0 shadow-2xs" :class="item.dot" />
                        <span class="font-bold text-zinc-900">{{ item.plan }}</span>
                      </div>
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap tabular-nums text-zinc-600 font-medium">
                      {{ item.priceStr }}
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap tabular-nums font-bold text-zinc-900">
                      {{ item.count.toLocaleString() }} คน
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap">
                      <div class="flex items-center gap-2.5">
                        <div class="w-20 h-2 rounded-full bg-zinc-200 overflow-hidden">
                          <div class="h-full rounded-full transition-all duration-700" :class="item.bar" :style="{ width: item.pct + '%' }" />
                        </div>
                        <span class="font-bold tabular-nums" :class="item.pctColor">{{ item.pct }}%</span>
                      </div>
                    </td>
                    <td class="px-5 py-4 whitespace-nowrap text-right tabular-nums font-extrabold text-emerald-700">
                      ฿{{ item.estimatedRevenue.toLocaleString() }} THB
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Guest Upload Activity Card -->
          <div class="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-card space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-base font-bold text-zinc-900 flex items-center gap-2">
                  <svg class="w-4.5 h-4.5 text-amber-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                  </svg>
                  <span>{{ $t('admin.overview.guestUploadActivity') || 'กิจกรรมอัปโหลดของผู้ใช้ทั่วไป (Guest)' }}</span>
                </h3>
                <p class="text-xs text-zinc-500 mt-0.5">รูปภาพจะหมดอายุและถูกลบอัตโนมัติเมื่อครบ 24 ชั่วโมง</p>
              </div>
              <NuxtLink
                to="/admin/images"
                class="px-3 py-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 transition-colors shadow-2xs"
              >
                ตรวจสอบรูปภาพ Guest
              </NuxtLink>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div class="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1">
                <p class="text-amber-800/80 font-semibold text-[11px] uppercase tracking-wider">ผู้ใช้ชั่วคราวทั้งหมด</p>
                <p class="text-2xl font-extrabold text-amber-700 tabular-nums">{{ stats.guest_users.toLocaleString() }}</p>
              </div>
              <div class="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1">
                <p class="text-amber-800/80 font-semibold text-[11px] uppercase tracking-wider">รูปภาพ Guest ปัจจุบัน</p>
                <p class="text-2xl font-extrabold text-amber-700 tabular-nums">{{ stats.guest_images.toLocaleString() }}</p>
              </div>
              <div class="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1">
                <p class="text-amber-800/80 font-semibold text-[11px] uppercase tracking-wider">พื้นที่จัดเก็บที่ใช้</p>
                <p class="text-2xl font-extrabold text-amber-700 tabular-nums">{{ formatSize(stats.guest_storage_bytes) }}</p>
              </div>
            </div>
          </div>

        </div>

        <!-- Right Column: Admin Shortcuts & System Health -->
        <div class="lg:col-span-4 space-y-6">

          <!-- Quick Admin Nav Hub -->
          <div class="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-card space-y-4">
            <h3 class="text-base font-bold text-zinc-900 flex items-center gap-2 border-b border-zinc-100 pb-3">
              <svg class="w-4.5 h-4.5 text-zinc-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
              </svg>
              <span>เมนูลัดสำหรับผู้ดูแลระบบ</span>
            </h3>

            <div class="space-y-2">
              <NuxtLink
                to="/admin/users"
                class="group p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/50 hover:bg-zinc-100 transition-all flex items-center justify-between"
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs font-bold text-zinc-900 group-hover:text-blue-700 transition-colors">จัดการผู้ใช้งาน</p>
                    <p class="text-[11px] text-zinc-500">สิทธิ์ บัญชี และแพ็กเกจ</p>
                  </div>
                </div>
                <svg class="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </NuxtLink>

              <NuxtLink
                to="/admin/plans"
                class="group p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/50 hover:bg-zinc-100 transition-all flex items-center justify-between"
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.75 7.5h16.5m-16.5 0l1.3-2.6A2.25 2.25 0 0 1 6.562 3.75h10.876a2.25 2.25 0 0 1 2.012 1.15l1.3 2.6" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs font-bold text-zinc-900 group-hover:text-purple-700 transition-colors">จัดการแพ็กเกจ</p>
                    <p class="text-[11px] text-zinc-500">ตั้งค่าราคา และโควตาความจุ</p>
                  </div>
                </div>
                <svg class="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </NuxtLink>

              <NuxtLink
                to="/admin/payments"
                class="group p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/50 hover:bg-zinc-100 transition-all flex items-center justify-between"
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15A2.25 2.25 0 0 0 2.25 6.75v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs font-bold text-zinc-900 group-hover:text-emerald-700 transition-colors">การชำระเงิน</p>
                    <p class="text-[11px] text-zinc-500">อนุมัติสลิปโอนเงินผ่านธนาคาร</p>
                  </div>
                </div>
                <svg class="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </NuxtLink>

              <NuxtLink
                to="/admin/images"
                class="group p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/50 hover:bg-zinc-100 transition-all flex items-center justify-between"
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs font-bold text-zinc-900 group-hover:text-amber-700 transition-colors">Content Moderation</p>
                    <p class="text-[11px] text-zinc-500">ตรวจสอบและลบรูปภาพผิดกฎ</p>
                  </div>
                </div>
                <svg class="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </NuxtLink>

              <NuxtLink
                to="/admin/audit"
                class="group p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/50 hover:bg-zinc-100 transition-all flex items-center justify-between"
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-700 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs font-bold text-zinc-900 group-hover:text-zinc-700 transition-colors">Audit Logs</p>
                    <p class="text-[11px] text-zinc-500">ประวัติกิจกรรมและการทำงาน</p>
                  </div>
                </div>
                <svg class="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </NuxtLink>
            </div>
          </div>

          <!-- System Health Status Widget -->
          <div class="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-card space-y-3.5">
            <h3 class="text-base font-bold text-zinc-900 flex items-center gap-2 border-b border-zinc-100 pb-3">
              <svg class="w-4.5 h-4.5 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <span>สถานะการทำงานของระบบ</span>
            </h3>

            <div class="space-y-2.5 text-xs">
              <div class="p-2.5 rounded-xl border border-zinc-200/60 bg-zinc-50/50 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-500" />
                  <span class="font-medium text-zinc-700">ฐานข้อมูล (Database)</span>
                </div>
                <span class="font-semibold text-emerald-700 text-[11px]">Normal</span>
              </div>

              <div class="p-2.5 rounded-xl border border-zinc-200/60 bg-zinc-50/50 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-500" />
                  <span class="font-medium text-zinc-700">จัดเก็บไฟล์ (Cloud Storage)</span>
                </div>
                <span class="font-semibold text-emerald-700 text-[11px]">Normal</span>
              </div>

              <div class="p-2.5 rounded-xl border border-zinc-200/60 bg-zinc-50/50 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-500" />
                  <span class="font-medium text-zinc-700">ระบบเข้าสู่ระบบ (Auth)</span>
                </div>
                <span class="font-semibold text-emerald-700 text-[11px]">Normal</span>
              </div>

              <div class="p-2.5 rounded-xl border border-zinc-200/60 bg-zinc-50/50 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-500" />
                  <span class="font-medium text-zinc-700">ระบบชำระเงิน (PromptPay)</span>
                </div>
                <span class="font-semibold text-emerald-700 text-[11px]">Active</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </template>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

import { exportToCsv } from '~/utils/export'

const { t, locale } = useI18n()
const { getStats } = useAdmin()
const { list: listPlanSettings, load: loadPlanSettings } = usePlanSettings()

const stats = ref<Awaited<ReturnType<typeof getStats>> | null>(null)
const loading = ref(true)
const refreshing = ref(false)
const error = ref('')

function exportDashboardSummary() {
  if (!stats.value) return
  const s = stats.value
  const headers = [
    { label: 'หมวดหมู่ (Category)', key: 'category' },
    { label: 'ตัวชี้วัด (Metric)', key: 'metric' },
    { label: 'ค่าตัวเลข (Value)', key: 'value_formatted' },
    { label: 'หน่วย (Unit)', key: 'unit' }
  ]
  const rows = [
    { category: 'ผู้ใช้งาน (Users)', metric: 'ผู้ใช้งานทั้งหมด (Total Users)', value_formatted: (s.users?.total_count || 0).toLocaleString(), unit: 'บัญชี (accounts)' },
    { category: 'ผู้ใช้งาน (Users)', metric: 'บัญชีเปิดใช้งาน (Active Users)', value_formatted: (s.users?.active_count || 0).toLocaleString(), unit: 'บัญชี (accounts)' },
    { category: 'ผู้ใช้งาน (Users)', metric: 'บัญชีถูกระงับ (Inactive Users)', value_formatted: (s.users?.inactive_count || 0).toLocaleString(), unit: 'บัญชี (accounts)' },
    { category: 'ผู้ใช้งาน (Users)', metric: 'ผู้ใช้ทั่วไป (Guest Users)', value_formatted: (s.users?.guest_count || 0).toLocaleString(), unit: 'บัญชี (accounts)' },
    { category: 'รูปภาพ (Images)', metric: 'รูปภาพทั้งหมด (Total Images)', value_formatted: (s.images?.total_count || 0).toLocaleString(), unit: 'ไฟล์ (files)' },
    { category: 'รูปภาพ (Images)', metric: 'พื้นที่จัดเก็บทั้งหมด (Total Storage)', value_formatted: formatBytes(s.images?.total_bytes || 0), unit: 'พื้นที่ (storage)' },
    { category: 'รูปภาพ (Images)', metric: 'อัปโหลดวันนี้ (Today Uploads)', value_formatted: (s.images?.today_count || 0).toLocaleString(), unit: 'ไฟล์ (files)' },
    { category: 'รูปภาพ (Images)', metric: 'อัปโหลดสัปดาห์นี้ (This Week Uploads)', value_formatted: (s.images?.week_count || 0).toLocaleString(), unit: 'ไฟล์ (files)' },
    { category: 'รูปภาพ (Images)', metric: 'อัปโหลดเดือนนี้ (This Month Uploads)', value_formatted: (s.images?.month_count || 0).toLocaleString(), unit: 'ไฟล์ (files)' },
    { category: 'การชำระเงิน (Payments)', metric: 'รายได้รวม (Total Revenue)', value_formatted: `฿${(s.payments?.total_amount_thb || 0).toLocaleString()}`, unit: 'บาท (THB)' },
    { category: 'การชำระเงิน (Payments)', metric: 'รายการอนุมัติสำเร็จ (Paid Tx)', value_formatted: (s.payments?.paid_count || 0).toLocaleString(), unit: 'รายการ (tx)' },
    { category: 'การชำระเงิน (Payments)', metric: 'รายการรอตรวจสอบ (Pending Tx)', value_formatted: (s.payments?.pending_count || 0).toLocaleString(), unit: 'รายการ (tx)' },
    { category: 'การชำระเงิน (Payments)', metric: 'รายการปฏิเสธ / ล้มเหลว (Failed Tx)', value_formatted: (s.payments?.failed_count || 0).toLocaleString(), unit: 'รายการ (tx)' },
    { category: 'Storage Providers', metric: 'จำนวน Storage Providers', value_formatted: (s.storage_providers?.length || 0).toLocaleString(), unit: 'ผู้ให้บริการ (providers)' }
  ]
  exportToCsv('pichost_dashboard_summary', headers, rows)
}

const knownPlans = ['free', 'basic', 'pro', 'enterprise']

const todayStr = computed(() =>
  new Date().toLocaleDateString(locale.value === 'th' ? 'th-TH' : 'en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
)

async function fetchData() {
  refreshing.value = true
  try {
    await Promise.all([
      getStats().then((s) => (stats.value = s)),
      loadPlanSettings(),
    ])
    error.value = ''
  } catch (e: any) {
    error.value = e?.data?.message ?? 'ไม่สามารถโหลดข้อมูลสถิติได้'
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

onMounted(() => {
  fetchData()
})

const registeredCount = computed(() => {
  if (!stats.value) return 0
  if (stats.value.registered_users !== undefined) return stats.value.registered_users
  return Math.max(0, stats.value.total_users - stats.value.guest_users)
})

const activeRate = computed(() => {
  if (!stats.value?.total_users) return 0
  return Math.round((stats.value.active_users / stats.value.total_users) * 100)
})

const guestRate = computed(() => {
  if (!stats.value?.total_users) return 0
  return Math.round((stats.value.guest_users / stats.value.total_users) * 100)
})

const totalStorageBytes = computed(() => {
  if (!stats.value) return 0
  return stats.value.total_storage_bytes ?? stats.value.guest_storage_bytes ?? 0
})

const registeredStorageBytes = computed(() => {
  if (!stats.value) return 0
  if (stats.value.registered_storage_bytes !== undefined) return stats.value.registered_storage_bytes
  return Math.max(0, totalStorageBytes.value - (stats.value.guest_storage_bytes || 0))
})

const totalImagesCount = computed(() => {
  if (!stats.value) return 0
  return stats.value.total_images ?? stats.value.guest_images ?? 0
})

const planPrices: Record<string, number> = {
  free: 0,
  basic: 99,
  pro: 299,
  enterprise: 999,
}

const planMeta: Record<string, { dot: string; bar: string; pctBg: string; pctColor: string }> = {
  free:       { dot: 'bg-zinc-400',   bar: 'bg-zinc-400',    pctBg: 'bg-zinc-100 text-zinc-700', pctColor: 'text-zinc-600' },
  basic:      { dot: 'bg-blue-500',   bar: 'bg-blue-500',    pctBg: 'bg-blue-50 text-blue-700',   pctColor: 'text-blue-700' },
  pro:        { dot: 'bg-purple-500', bar: 'bg-purple-500',  pctBg: 'bg-purple-50 text-purple-700', pctColor: 'text-purple-700' },
  enterprise: { dot: 'bg-emerald-500', bar: 'bg-emerald-500', pctBg: 'bg-emerald-50 text-emerald-700', pctColor: 'text-emerald-700' },
}

function normalizePlanKey(plan: string) {
  return plan.trim().toLowerCase()
}

function prettyPlan(plan: string) {
  const key = normalizePlanKey(plan)
  if (key === 'free') return 'Free'
  if (key === 'basic') return 'Basic'
  if (key === 'pro') return 'Pro'
  if (key === 'enterprise') return 'Enterprise'
  if (!key) return 'Unknown'
  return key.charAt(0).toUpperCase() + key.slice(1)
}

const planRows = computed(() => {
  if (!stats.value) return []
  const settingsRows = listPlanSettings()
  const settingsByKey = Object.fromEntries(settingsRows.map((s) => [s.key.toLowerCase(), s]))

  const aggregated: Record<string, number> = {}
  for (const [rawPlan, count] of Object.entries(stats.value.plan_breakdown ?? {})) {
    const key = normalizePlanKey(rawPlan)
    if (!key) continue
    aggregated[key] = (aggregated[key] ?? 0) + count
  }

  const settingsKeys = settingsRows.map((s) => s.key.toLowerCase())
  const breakdownKeys = Object.keys(aggregated)
  const keys = Array.from(new Set([...settingsKeys, ...breakdownKeys]))

  const sum = Object.values(aggregated).reduce((acc, val) => acc + val, 0)
  const total = (sum || stats.value.total_users || 1)

  const rows = keys.map((key) => {
    const count = aggregated[key] ?? 0
    const setting = settingsByKey[key]
    const planName = setting?.name ?? (key ? key.charAt(0).toUpperCase() + key.slice(1) : 'Unknown')
    const price = setting?.monthlyPrice ?? planPrices[key] ?? 0

    return {
      key,
      plan: planName,
      price,
      count,
      pct: Math.round((count / total) * 100),
      ...(planMeta[key] ?? { dot: 'bg-zinc-400', bar: 'bg-zinc-300', pctBg: 'bg-zinc-100 text-zinc-700', pctColor: 'text-zinc-600' }),
    }
  })

  return rows.filter((r) => r.count > 0 || settingsByKey[r.key]).sort((a, b) => b.price - a.price || b.count - a.count)
})

const planAnalyticsRows = computed(() => {
  return planRows.value.map((item) => {
    const price = item.price
    const estimatedRevenue = price * item.count
    return {
      ...item,
      price,
      priceStr: price ? `฿${price.toLocaleString()} / mo` : 'Free',
      estimatedRevenue,
    }
  })
})

const paidPlanNamesText = computed(() => {
  const paidPlans = planAnalyticsRows.value
    .filter((r) => r.price > 0)
    .map((r) => r.plan)
  if (!paidPlans.length) return 'คำนวณจากแผนบริการที่ชำระเงิน'
  return `คำนวณจากแผน ${paidPlans.join(', ')}`
})

const estimatedMonthlyRevenue = computed(() => {
  if (!stats.value) return 0
  if (stats.value.est_monthly_revenue_thb !== undefined) return stats.value.est_monthly_revenue_thb
  if (stats.value.total_revenue_thb !== undefined && stats.value.total_revenue_thb > 0) return stats.value.total_revenue_thb
  return planAnalyticsRows.value.reduce((acc, r) => acc + r.estimatedRevenue, 0)
})

const paidSubscribersCount = computed(() => {
  return planRows.value.filter((r) => r.key !== 'free').reduce((acc, r) => acc + r.count, 0)
})

const conversionRate = computed(() => {
  if (!stats.value) return 0
  if (stats.value.conversion_rate_pct !== undefined) return stats.value.conversion_rate_pct
  if (!registeredCount.value) return 0
  return Math.round((paidSubscribersCount.value / registeredCount.value) * 100)
})

const avgStoragePerUser = computed(() => {
  if (!stats.value) return 0
  if (stats.value.avg_storage_per_user_bytes !== undefined) return stats.value.avg_storage_per_user_bytes
  if (!registeredCount.value) return 0
  return Math.round(registeredStorageBytes.value / registeredCount.value)
})

const avgImagesPerUser = computed(() => {
  if (!stats.value) return 0
  if (stats.value.avg_images_per_user !== undefined) return stats.value.avg_images_per_user
  if (!registeredCount.value) return 0
  const memberImages = Math.max(0, totalImagesCount.value - (stats.value.guest_images || 0))
  return Math.round(memberImages / registeredCount.value)
})

function formatSize(bytes: number = 0) {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}
</script>
