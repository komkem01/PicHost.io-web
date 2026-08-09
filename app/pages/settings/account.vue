<template>
  <div class="max-w-7xl mx-auto px-6 py-10">

        <div class="mb-8">
          <h1 class="text-[26px] font-bold tracking-tight leading-tight text-white">Settings</h1>
          <p class="text-white/35 text-sm mt-1.5">Manage your account preferences.</p>
        </div>

        <div v-if="pageLoading" class="space-y-4">
          <div class="h-10 rounded-xl bg-white/[0.04] animate-pulse" />
          <div class="h-48 rounded-2xl bg-white/[0.03] animate-pulse" />
        </div>

        <template v-else-if="user">
          <div class="flex flex-col lg:flex-row gap-8 items-start">
            <!-- Left Sidebar Menu (lg:w-[220px] shrink-0) -->
            <div class="hidden lg:flex flex-col gap-1 w-[220px] shrink-0">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                class="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[13.5px] font-medium transition-all text-left border"
                :class="activeTab === tab.id ? 'bg-blue-600/10 border-blue-500/25 text-blue-200 font-semibold' : 'text-white/45 hover:text-white/70 hover:bg-white/[0.02] border-transparent'"
              >
                <span v-html="tab.icon" class="w-4 h-4 shrink-0" />
                {{ tab.label }}
              </button>
            </div>

            <!-- Mobile Horizontal Tab Switcher (lg:hidden) -->
            <div class="lg:hidden w-full flex items-center gap-1 mb-2 border-b border-white/[0.07] overflow-x-auto scrollbar-none">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'flex items-center gap-1.5 px-3.5 py-2.5 text-[13px] font-medium transition-colors relative shrink-0',
                  activeTab === tab.id ? 'text-white' : 'text-white/40 hover:text-white/70',
                ]"
              >
                <span v-html="tab.icon" class="w-4 h-4 shrink-0" />
                {{ tab.label }}
                <span v-if="activeTab === tab.id" class="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500 rounded-full" />
              </button>
            </div>

            <!-- Main Content Area -->
            <div class="flex-1 min-w-0 w-full space-y-6">

          <!-- PROFILE TAB -->
          <div v-if="activeTab === 'profile'" class="space-y-5">
            <div class="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 flex items-center gap-4">
              <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-blue-900/30 shrink-0">
                {{ avatarInitial }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-[15px] truncate">{{ user.username ?? user.email ?? "—" }}</p>
                <p class="text-white/40 text-sm truncate mt-0.5">{{ user.email ?? "—" }}</p>
              </div>
              <span class="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-medium border" :class="planBadge.class">
                <span class="w-1.5 h-1.5 rounded-full" :class="planBadge.dot" />
                {{ user.plan }}
              </span>
            <!-- Email Verification Notice -->
            <div v-if="user.email && !user.email_verified_at" class="rounded-2xl border border-yellow-500/20 bg-yellow-500/[0.04] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-yellow-500/30 bg-yellow-500/10 text-yellow-400">
                    Unverified Email
                  </span>
                </div>
                <p class="text-[13px] text-white/70">Please verify your email address to unlock plan upgrades and account recovery.</p>
              </div>
              <button
                type="button"
                @click="handleResendVerification"
                :disabled="resendingVerification"
                class="shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-[12.5px] font-semibold transition-all disabled:opacity-40"
              >
                <svg v-if="resendingVerification" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                {{ resendingVerification ? "Sending…" : "Resend Verification Email" }}
              </button>
            </div>

            <div class="rounded-2xl border border-white/[0.07] bg-white/[0.02]">
              <div class="px-5 py-4 border-b border-white/[0.06]">
                <p class="text-[13.5px] font-semibold text-white/80">Profile information</p>
              </div>
              <form @submit.prevent="saveProfile" class="p-5 space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[12px] font-medium text-white/45 mb-1.5">Username</label>
                    <input v-model="profileForm.username" type="text" autocomplete="username" placeholder="Your username"
                      class="w-full bg-white/[0.05] border border-white/[0.09] focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/15 rounded-xl px-3.5 py-2.5 text-[13.5px] text-white placeholder:text-white/20 outline-none transition-all" />
                  </div>
                  <div>
                    <label class="block text-[12px] font-medium text-white/45 mb-1.5">Email address</label>
                    <input v-model="profileForm.email" type="email" autocomplete="email" placeholder="your@email.com"
                      class="w-full bg-white/[0.05] border border-white/[0.09] focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/15 rounded-xl px-3.5 py-2.5 text-[13.5px] text-white placeholder:text-white/20 outline-none transition-all" />
                  </div>
                </div>
                <div class="flex justify-end pt-1">
                  <button type="submit" :disabled="profileSaving || !profileDirty"
                    class="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    :class="profileDirty && !profileSaving ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-600/20' : 'bg-white/[0.06] text-white/40'">
                    <svg v-if="profileSaving" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    {{ profileSaving ? "Saving…" : "Save changes" }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- SECURITY TAB -->
          <div v-if="activeTab === 'security'" class="space-y-5">
            <div class="rounded-2xl border border-white/[0.07] bg-white/[0.02]">
              <div class="px-5 py-4 border-b border-white/[0.06]">
                <p class="text-[13.5px] font-semibold text-white/80">Change password</p>
                <p class="text-[12px] text-white/30 mt-0.5">Use a strong password with at least 8 characters.</p>
              </div>
              <form @submit.prevent="changePassword" class="p-5 space-y-4">

                <div>
                  <label class="block text-[12px] font-medium text-white/45 mb-1.5">Current password</label>
                  <div class="relative">
                    <input v-model="pwForm.current" :type="showCurrent ? 'text' : 'password'" autocomplete="current-password" placeholder="Enter current password"
                      class="w-full bg-white/[0.05] border border-white/[0.09] focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/15 rounded-xl px-3.5 py-2.5 pr-10 text-[13.5px] text-white placeholder:text-white/20 outline-none transition-all" />
                    <button type="button" @click="showCurrent = !showCurrent" class="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                      <svg v-if="!showCurrent" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                    </button>
                  </div>
                </div>

                <div>
                  <label class="block text-[12px] font-medium text-white/45 mb-1.5">New password</label>
                  <div class="relative">
                    <input v-model="pwForm.newPwd" :type="showNew ? 'text' : 'password'" autocomplete="new-password" placeholder="At least 8 characters"
                      class="w-full bg-white/[0.05] border border-white/[0.09] focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/15 rounded-xl px-3.5 py-2.5 pr-10 text-[13.5px] text-white placeholder:text-white/20 outline-none transition-all" />
                    <button type="button" @click="showNew = !showNew" class="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                      <svg v-if="!showNew" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                    </button>
                  </div>
                  <div v-if="pwForm.newPwd" class="mt-2 flex items-center gap-2">
                    <div class="flex gap-1 flex-1">
                      <div v-for="i in 4" :key="i" class="h-1 flex-1 rounded-full transition-all duration-300" :class="i <= pwStrength ? pwStrengthColor : 'bg-white/[0.07]'" />
                    </div>
                    <span class="text-[11px] shrink-0" :class="pwStrengthTextColor">{{ pwStrengthLabel }}</span>
                  </div>
                </div>

                <div>
                  <label class="block text-[12px] font-medium text-white/45 mb-1.5">Confirm new password</label>
                  <div class="relative">
                    <input v-model="pwForm.confirm" :type="showConfirm ? 'text' : 'password'" autocomplete="new-password" placeholder="Repeat new password"
                      class="w-full bg-white/[0.05] border border-white/[0.09] focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/15 rounded-xl px-3.5 py-2.5 pr-10 text-[13.5px] text-white placeholder:text-white/20 outline-none transition-all"
                      :class="pwForm.confirm && pwForm.newPwd !== pwForm.confirm ? 'border-red-500/40' : ''" />
                    <button type="button" @click="showConfirm = !showConfirm" class="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                      <svg v-if="!showConfirm" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                    </button>
                  </div>
                  <p v-if="pwForm.confirm && pwForm.newPwd !== pwForm.confirm" class="text-[11.5px] text-red-400 mt-1.5">Passwords do not match</p>
                </div>

                <div class="flex justify-end pt-1">
                  <button type="submit"
                    :disabled="pwSaving || !pwForm.current || !pwForm.newPwd || !pwForm.confirm || pwForm.newPwd !== pwForm.confirm || pwForm.newPwd.length < 8"
                    class="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-600/20">
                    <svg v-if="pwSaving" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    {{ pwSaving ? "Saving…" : "Update password" }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- PLAN TAB -->
          <div v-if="activeTab === 'plan'" class="space-y-4">
            <div class="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
              <div class="flex items-center justify-between gap-4 mb-5">
                <div>
                  <p class="text-[12px] text-white/40 mb-1">Current plan</p>
                  <p class="text-xl font-bold">{{ user.plan }}</p>
                </div>
                <span v-if="user.plan_cancelled_at" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium border border-orange-500/20 bg-orange-500/10 text-orange-400">
                  <span class="w-1.5 h-1.5 rounded-full bg-orange-400" />Cancelled
                </span>
                <span v-else class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium border" :class="planBadge.class">
                  <span class="w-1.5 h-1.5 rounded-full" :class="planBadge.dot" />Active
                </span>
              </div>

              <!-- Subscription expiry / cancellation notice -->
              <div v-if="user.plan !== 'Free' && user.plan_expires_at" class="mb-4">
                <div v-if="user.plan_cancelled_at" class="rounded-xl border border-orange-500/20 bg-orange-500/[0.04] px-4 py-3 text-[12px] text-orange-300 leading-relaxed">
                  Your subscription has been cancelled. You will keep <span class="font-semibold">{{ user.plan }}</span> access until
                  <span class="font-semibold">{{ formatPlanExpiryDate(user.plan_expires_at) }}</span>, then your account will be downgraded to the Free plan.
                </div>
                <div v-else class="flex items-center gap-2 text-[12px] text-white/45">
                  <svg class="w-3.5 h-3.5 text-white/30 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  Active until <span class="text-white/70 font-medium">{{ formatPlanExpiryDate(user.plan_expires_at) }}</span>
                </div>
              </div>

              <!-- Usage: Storage -->
              <div v-if="quota" class="space-y-4">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-[12px] text-white/50">Storage used</span>
                    <span class="text-[12px] font-medium">
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
                    <span class="text-[12px] text-white/50">Images</span>
                    <span class="text-[12px] font-medium">
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

                <!-- Info grid -->
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                  <div class="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3.5">
                    <p class="text-[11px] text-white/30 mb-1">Max file size</p>
                    <p class="text-[14px] font-semibold">{{ quota.file_size_limit_bytes === -1 ? 'Unlimited' : formatBytes(quota.file_size_limit_bytes) }}</p>
                  </div>
                  <div class="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3.5">
                    <p class="text-[11px] text-white/30 mb-1">API access</p>
                    <p class="text-[14px] font-semibold">{{ quota.plan !== 'Free' ? 'Enabled' : 'Disabled' }}</p>
                  </div>
                  <div class="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3.5">
                    <p class="text-[11px] text-white/30 mb-1">Plan tier</p>
                    <p class="text-[14px] font-semibold" :class="planBadge?.class.includes('emerald') ? 'text-emerald-400' : planBadge?.class.includes('yellow') ? 'text-yellow-400' : planBadge?.class.includes('orange') ? 'text-orange-400' : 'text-red-400'">{{ quota.plan }}</p>
                  </div>
                </div>
              </div>

              <!-- Loading skeleton -->
              <div v-else class="space-y-4">
                <div class="h-8 rounded-lg bg-white/[0.04] animate-pulse" />
                <div class="h-8 rounded-lg bg-white/[0.04] animate-pulse" />
                <div class="grid grid-cols-3 gap-3">
                  <div class="h-16 rounded-xl bg-white/[0.04] animate-pulse" />
                  <div class="h-16 rounded-xl bg-white/[0.04] animate-pulse" />
                  <div class="h-16 rounded-xl bg-white/[0.04] animate-pulse" />
                </div>
              </div>

            </div>

            <!-- Tier cards -->
            <div class="rounded-xl border border-blue-500/20 bg-blue-500/[0.06] p-4">
              <p class="text-[13px] font-medium text-blue-300">Upgrade flow</p>
              <p class="text-[12px] text-blue-300/70 mt-1">Select a plan and continue to checkout. Your account plan upgrades automatically after payment confirmation.</p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div v-for="tier in planTiers" :key="tier.key" class="rounded-xl border p-4 transition-all"
                :class="tier.name === user.plan ? 'border-blue-500/40 bg-blue-600/[0.05]' : 'border-white/[0.07] bg-white/[0.02]'">
                <div class="flex items-center justify-between mb-2">
                  <p class="font-semibold text-[14px]">{{ tier.name }}</p>
                  <span v-if="tier.name === user.plan" class="text-[10px] font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">Current</span>
                </div>
                <p class="text-[18px] font-bold text-white mb-1">
                  {{ tier.priceLabel }}
                  <span v-if="tier.monthlyPrice > 0" class="text-[12px] font-medium text-white/45">/ month</span>
                </p>
                <p class="text-[12px] text-white/40 mb-3">{{ tier.desc }}</p>
                <ul class="space-y-1.5">
                  <li v-for="feat in tier.features" :key="feat" class="flex items-center gap-2 text-[12px] text-white/55">
                    <svg class="w-3.5 h-3.5 text-blue-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                    {{ feat }}
                  </li>
                </ul>
                <button
                  type="button"
                  class="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  :class="tier.name === user.plan
                    ? 'bg-white/[0.06] text-white/45 border border-white/[0.09]'
                    : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-600/20'"
                  :disabled="tier.name === user.plan || (tier.name === 'Free' && user.plan !== 'Free')"
                  @click="startCheckout(tier.key)"
                >
                  {{ tier.name === user.plan
                    ? 'Current plan'
                    : (tier.name === 'Free' && user.plan !== 'Free')
                      ? 'Use cancellation to downgrade'
                      : `Upgrade to ${tier.name}` }}
                </button>

                <div v-if="tier.name === user.plan && user.plan !== 'Free' && !user.plan_cancelled_at" class="mt-3 rounded-xl border border-red-500/20 bg-red-500/[0.04] p-3 space-y-2.5">
                  <p class="text-[11px] text-red-300/80">Choose month/year then cancel this subscription.</p>
                  <div class="grid grid-cols-2 gap-2">
                    <select
                      v-model="cancelMonth"
                      class="px-2.5 py-2 rounded-lg bg-black/30 border border-white/[0.12] focus:border-red-500/50 focus:outline-none text-[12px] text-white"
                    >
                      <option v-for="m in cancelMonthOptions" :key="m.value" :value="m.value">{{ m.label }}</option>
                    </select>
                    <select
                      v-model="cancelYear"
                      class="px-2.5 py-2 rounded-lg bg-black/30 border border-white/[0.12] focus:border-red-500/50 focus:outline-none text-[12px] text-white"
                    >
                      <option v-for="y in cancelYearOptions" :key="y" :value="String(y)">{{ y }}</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    class="w-full px-3 py-2 rounded-lg text-[12px] font-semibold bg-red-600/80 hover:bg-red-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    :disabled="cancelLoading"
                    @click="handleCancelSubscription"
                  >
                    <svg v-if="cancelLoading" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    {{ cancelLoading ? 'Cancelling…' : `Cancel at ${cancelMonthLabel} ${cancelYear}` }}
                  </button>
                </div>

                <div v-if="tier.name === user.plan && user.plan_cancelled_at" class="mt-3 rounded-xl border border-orange-500/20 bg-orange-500/[0.04] p-3 text-[11px] text-orange-300/80">
                  Cancelled. Active until {{ formatPlanExpiryDate(user.plan_expires_at) }}.
                </div>
              </div>
              <div v-if="!plansLoaded && !plansLoading" class="sm:col-span-2 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 text-[12px] text-white/40">
                Plan options are loading.
              </div>
              <div v-if="plansLoaded && !plansLoading && planTiers.length === 0" class="sm:col-span-2 rounded-xl border border-red-500/20 bg-red-500/[0.04] p-4 text-[12px] text-red-300/80">
                No purchasable plans are available right now.
              </div>
            </div>

            <!-- PAYMENT HISTORY CARD -->
            <div v-if="myPayments.length > 0" class="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
              <div class="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                <p class="text-[13.5px] font-semibold text-white/80">Payment History</p>
                <span class="text-[11px] text-white/35 font-medium">{{ myPayments.length }} orders</span>
              </div>
              <div class="divide-y divide-white/[0.04]">
                <div v-for="pmt in paginatedPayments" :key="pmt.id"
                  @click="router.push(`/billing/payments/${pmt.id}`)"
                  class="flex items-center justify-between gap-4 p-4 hover:bg-white/[0.02] transition-colors cursor-pointer group">
                  <div class="min-w-0">
                    <p class="text-[13px] font-semibold text-white/90 flex items-center gap-2">
                      {{ toPlanDisplayName(pmt.plan_key) }} Plan
                      <span class="text-[11px] font-mono text-white/30" :title="pmt.id">
                        #{{ pmt.id.slice(0, 8).toUpperCase() }}
                      </span>
                    </p>
                    <p class="text-[11px] text-white/40 mt-0.5">
                      Ordered on {{ formatPlanExpiryDate(pmt.created_at) }}
                    </p>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="text-right">
                      <p class="text-[13px] font-bold text-white">฿{{ pmt.amount_thb.toLocaleString() }}</p>
                      <!-- Badge -->
                      <span class="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border mt-1"
                        :class="getHistoryBadgeClass(pmt.status)">
                        {{ pmt.status.toUpperCase() }}
                      </span>
                    </div>
                    <!-- Chevron -->
                    <svg class="w-4 h-4 text-white/20 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Pagination controls -->
              <div v-if="totalPages > 1" class="px-5 py-3.5 border-t border-white/[0.06] bg-white/[0.01] flex items-center justify-between">
                <span class="text-[11.5px] text-white/35 font-medium">
                  Page <span class="text-white/60 font-semibold">{{ currentPage }}</span> of <span class="text-white/60 font-semibold">{{ totalPages }}</span>
                </span>
                <div class="flex items-center gap-2">
                  <button
                    @click="currentPage--"
                    :disabled="currentPage === 1"
                    class="px-2.5 py-1.5 rounded-lg border border-white/[0.08] text-[11.5px] font-medium text-white/60 hover:text-white hover:border-white/15 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-white/60 disabled:hover:border-white/[0.08] transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    @click="currentPage++"
                    :disabled="currentPage === totalPages"
                    class="px-2.5 py-1.5 rounded-lg border border-white/[0.08] text-[11.5px] font-medium text-white/60 hover:text-white hover:border-white/15 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-white/60 disabled:hover:border-white/[0.08] transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- DANGER TAB -->
          <div v-if="activeTab === 'danger'" class="space-y-4">
            <div class="rounded-2xl border border-red-500/15 bg-red-500/[0.02] overflow-hidden">
              <div class="px-5 py-4 border-b border-red-500/10">
                <p class="text-[13.5px] font-semibold text-red-400">Danger zone</p>
                <p class="text-[12px] text-white/30 mt-0.5">These actions are irreversible. Please proceed with caution.</p>
              </div>
              <div class="divide-y divide-red-500/[0.08]">
                <div class="flex items-center justify-between gap-4 p-5">
                  <div>
                    <p class="text-[13.5px] font-medium">Sign out of all sessions</p>
                    <p class="text-[12px] text-white/30 mt-0.5">You will be signed out immediately</p>
                  </div>
                  <button @click="openLogoutModal()"
                    class="shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-lg border border-white/[0.09] bg-white/[0.04] hover:bg-white/[0.08] text-white/60 hover:text-white text-[13px] font-medium transition-all">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                    Sign out
                  </button>
                </div>

                <div class="p-5">
                  <div class="flex items-center justify-between gap-4">
                    <div>
                      <p class="text-[13.5px] font-medium text-red-400">Delete account</p>
                      <p class="text-[12px] text-white/30 mt-0.5">Permanently delete your account and all data. This cannot be undone.</p>
                    </div>
                    <button @click="openDeleteModal"
                      class="shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-lg border border-red-500/30 bg-red-500/[0.06] hover:bg-red-500/[0.12] text-red-400 hover:text-red-300 text-[13px] font-medium transition-all">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      Delete account
                    </button>
                  </div>

                  <!-- Delete Account Confirmation Modal -->
                  <Teleport to="body">
                    <Transition
                      enter-active-class="transition duration-200 ease-out"
                      enter-from-class="opacity-0"
                      leave-active-class="transition duration-150 ease-in"
                      leave-to-class="opacity-0"
                    >
                      <div v-if="deleteModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <div class="fixed inset-0" @click="closeDeleteModal"></div>

                        <Transition
                          enter-active-class="transition duration-200 ease-out"
                          enter-from-class="opacity-0 scale-95"
                          leave-active-class="transition duration-150 ease-in"
                          leave-to-class="opacity-0 scale-95"
                        >
                          <div v-if="deleteModalOpen" class="relative w-full max-w-md rounded-2xl border border-red-500/20 bg-[#0c0c0e] p-6 shadow-2xl">
                            <div class="flex items-center gap-3.5 mb-4">
                              <span class="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                                <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                                </svg>
                              </span>
                              <div>
                                <h3 class="text-[16px] font-bold text-white">Delete Account?</h3>
                                <p class="text-[11.5px] text-white/35 mt-0.5">This action is permanent and cannot be undone.</p>
                              </div>
                            </div>

                            <div class="space-y-4">
                              <p class="text-[12.5px] text-white/60 leading-relaxed">
                                All your uploaded images, subscription settings, and billing history will be permanently deleted from our servers.
                              </p>

                              <div class="rounded-xl bg-red-500/[0.03] border border-red-500/10 p-3.5">
                                <p class="text-[12px] text-red-300/80">
                                  Please type your email <span class="font-bold text-red-200">{{ user?.email }}</span> below to confirm.
                                </p>
                              </div>

                              <input
                                v-model="deleteConfirmEmail"
                                type="email"
                                placeholder="Enter your email"
                                class="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.08] focus:border-red-500/40 focus:outline-none text-[13px] text-white placeholder-white/20 transition-all"
                              />

                              <div class="flex items-center justify-end gap-2.5 pt-2">
                                <button
                                  @click="closeDeleteModal"
                                  :disabled="deleteDeleting"
                                  class="px-4 py-2.5 rounded-xl border border-white/[0.08] text-[13px] font-semibold text-white/60 hover:text-white hover:border-white/[0.15] disabled:opacity-40 transition-colors"
                                >
                                  Cancel
                                </button>
                                <button
                                  @click="deleteAccount"
                                  :disabled="deleteConfirmEmail !== user?.email || deleteDeleting"
                                  class="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[13px] font-semibold transition-all shadow-lg shadow-red-600/15"
                                >
                                  <svg v-if="deleteDeleting" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                  </svg>
                                  {{ deleteDeleting ? 'Deleting Account…' : 'Delete Account' }}
                                </button>
                              </div>
                            </div>
                          </div>
                        </Transition>
                      </div>
                    </Transition>
                  </Teleport>
                </div>
              </div>
            </div>
          </div>
          </div>
          </div>
          </div>
        </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

import type { PaymentTransaction } from '~/composables/useBilling'

const config = useRuntimeConfig()
const router = useRouter()
const { user, fetchMe, refreshMe, getToken, resendVerification } = useAuth()
const { success, error: toastError } = useToast()
const { open: openLogoutModal } = useLogoutModal()
const { listPublicPlans, createCheckout, cancelSubscription, listMyPayments, toPlanDisplayName } = useBilling()

const SITE_URL = 'https://pichost.io'
useSeoMeta({
  title: 'Account Settings — PicHost.io',
  description: 'Manage your profile, password security, active storage plan, and payments.',
  ogTitle: 'Account Settings — PicHost.io',
  ogDescription: 'Manage your profile, password security, active storage plan, and payments.',
  ogImage: `${SITE_URL}/og-image.png`,
  twitterCard: 'summary_large_image',
})

useHead({
  link: [{ rel: 'canonical', href: `${SITE_URL}/settings/account` }],
})

const resendingVerification = ref(false)

async function handleResendVerification() {
  resendingVerification.value = true
  try {
    const msg = await resendVerification()
    success(msg || 'Verification email sent!')
  } catch (err: any) {
    toastError(err?.data?.message || err?.message || 'Failed to resend verification email')
  } finally {
    resendingVerification.value = false
  }
}

const myPayments = ref<PaymentTransaction[]>([])
const paymentsLoading = ref(false)
const currentPage = ref(1)
const itemsPerPage = 5
const totalPages = computed(() => Math.ceil(myPayments.value.length / itemsPerPage))

const paginatedPayments = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return myPayments.value.slice(start, end)
})

async function fetchMyPayments() {
  paymentsLoading.value = true
  try {
    myPayments.value = await listMyPayments()
    currentPage.value = 1
  } catch {
    // ignore
  } finally {
    paymentsLoading.value = false
  }
}

function getHistoryBadgeClass(status: string) {
  if (status === 'paid') return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
  if (status === 'pending') return 'border-blue-500/20 bg-blue-500/10 text-blue-400'
  return 'border-red-500/20 bg-red-500/10 text-red-400'
}

const pageLoading = ref(true)
const activeTab = ref<'profile' | 'security' | 'plan' | 'danger'>('profile')

const tabs = [
  { id: 'profile' as const, label: 'Profile', icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>' },
  { id: 'security' as const, label: 'Security', icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>' },
  { id: 'plan' as const, label: 'Plan', icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>' },
  { id: 'danger' as const, label: 'Danger zone', icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>' },
]

onMounted(async () => {
  const me = await fetchMe()
  const queryTab = String(router.currentRoute.value.query.tab ?? '').trim().toLowerCase()
  if (queryTab === 'profile' || queryTab === 'security' || queryTab === 'plan' || queryTab === 'danger') {
    activeTab.value = queryTab as typeof activeTab.value
  }
  if (me) {
    profileForm.username = me.username ?? ''
    profileForm.email = me.email ?? ''
  }
  pageLoading.value = false

  if (activeTab.value === 'plan') {
    void fetchQuota()
    void fetchPublicPlans()
    void fetchMyPayments()
  }
})

const avatarInitial = computed(() => {
  const u = user.value
  return (u?.username ?? u?.email ?? '?').charAt(0).toUpperCase()
})

const planBadge = computed((): { class: string; dot: string } => {
  const map: Record<string, { class: string; dot: string }> = {
    Free:       { class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-400' },
    Basic:      { class: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',    dot: 'bg-yellow-400' },
    Pro:        { class: 'bg-orange-500/10 text-orange-400 border-orange-500/20',    dot: 'bg-orange-400' },
    Enterprise: { class: 'bg-red-500/10 text-red-400 border-red-500/20',             dot: 'bg-red-400' },
  }
  return map[user.value?.plan ?? 'Free'] ?? map['Free']!
})

const profileForm = reactive({ username: '', email: '' })
const profileSaving = ref(false)
const profileSaved = ref(false)
const profileError = ref('')

const profileDirty = computed(() =>
  profileForm.username !== (user.value?.username ?? '') ||
  profileForm.email !== (user.value?.email ?? ''),
)

async function saveProfile() {
  if (!user.value || !profileDirty.value) return
  profileSaving.value = true
  profileSaved.value = false
  profileError.value = ''
  try {
    const token = getToken()
    await $fetch(`${config.public.apiBase}/auth/me`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: { username: profileForm.username || undefined, email: profileForm.email || undefined },
    })
    await refreshMe()
    profileSaved.value = true
    success('Profile updated')
    setTimeout(() => { profileSaved.value = false }, 3000)
  } catch (err: unknown) {
    const msg = (err as { data?: { message?: string } })?.data?.message
    profileError.value = msg ?? 'Failed to save. Please try again.'
    toastError(profileError.value)
  } finally {
    profileSaving.value = false
  }
}

const pwForm = reactive({ current: '', newPwd: '', confirm: '' })
const pwSaving = ref(false)
const pwSaved = ref(false)
const pwError = ref('')
const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)

const pwStrength = computed(() => {
  const p = pwForm.newPwd
  if (!p) return 0
  let s = 0
  if (p.length >= 8) s++
  if (p.length >= 12) s++
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++
  if (/[0-9]/.test(p) && /[^A-Za-z0-9]/.test(p)) s++
  return Math.min(s, 4)
})
const pwStrengthColor = computed(() => ['bg-red-500','bg-orange-500','bg-yellow-500','bg-emerald-500'][Math.max(pwStrength.value - 1, 0)])
const pwStrengthTextColor = computed(() => ['text-red-400','text-orange-400','text-yellow-400','text-emerald-400'][Math.max(pwStrength.value - 1, 0)])
const pwStrengthLabel = computed(() => ['Weak','Fair','Good','Strong'][Math.max(pwStrength.value - 1, 0)])

async function changePassword() {
  if (pwForm.newPwd !== pwForm.confirm) return
  pwSaving.value = true
  pwSaved.value = false
  pwError.value = ''
  try {
    const token = getToken()
    await $fetch(`${config.public.apiBase}/auth/change-password`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: { current_password: pwForm.current, new_password: pwForm.newPwd },
    })
    pwSaved.value = true
    pwForm.current = ''
    pwForm.newPwd = ''
    pwForm.confirm = ''
    success('Password updated')
    setTimeout(() => { pwSaved.value = false }, 3000)
  } catch (err: unknown) {
    const body = (err as { data?: { message?: string; data?: { error?: string } } })?.data
    const msg = body?.data?.error === 'current_password_incorrect'
      ? 'Current password is incorrect.'
      : (body?.message ?? 'Failed to change password.')
    pwError.value = msg
    toastError(msg)
  } finally {
    pwSaving.value = false
  }
}

const deleteModalOpen = ref(false)
const deleteConfirmEmail = ref('')
const deleteDeleting = ref(false)

function openDeleteModal() {
  deleteModalOpen.value = true
  deleteConfirmEmail.value = ''
}

function closeDeleteModal() {
  if (deleteDeleting.value) return
  deleteModalOpen.value = false
  deleteConfirmEmail.value = ''
}

async function deleteAccount() {
  if (!user.value || deleteConfirmEmail.value !== user.value.email) return
  deleteDeleting.value = true
  try {
    const token = getToken()
    await $fetch(`${config.public.apiBase}/auth/me`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    closeDeleteModal()
    router.replace('/auth/login')
  } catch (err: unknown) {
    const msg = (err as { data?: { message?: string } })?.data?.message ?? 'Failed to delete account.'
    toastError(msg)
    deleteDeleting.value = false
  }
}

// ── Quota ────────────────────────────────────────────────────────────────────
interface QuotaData {
  plan: string
  used_storage_bytes: number
  storage_limit_bytes: number
  image_count: number
  max_images: number
  file_size_limit_bytes: number
  allow_private: boolean
}

const quota = ref<QuotaData | null>(null)
const plansLoading = ref(false)
const plansLoaded = ref(false)

interface PublicPlanSetting {
  plan_key: string
  display_name: string
  monthly_price_thb: number
  storage_limit_bytes: number
  image_limit: number
  max_upload_mb: number
  is_enabled: boolean
  allow_private: boolean
  custom_domain: boolean
  api_access: boolean
  priority_support: boolean
  no_ads: boolean
  watermark_removal: boolean
}

const publicPlans = ref<PublicPlanSetting[]>([])

async function fetchQuota() {
  try {
    const token = getToken()
    const res = await $fetch<{ data: QuotaData }>(`${config.public.apiBase}/auth/quota`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    quota.value = res.data
  } catch {
    // silently fail — quota section will stay in skeleton
  }
}

async function fetchPublicPlans() {
  if (plansLoading.value) return
  plansLoading.value = true
  try {
    publicPlans.value = (await listPublicPlans())
      .filter((plan) => plan.is_enabled)
      .sort((a, b) => a.monthly_price_thb - b.monthly_price_thb)
    plansLoaded.value = true
  } catch {
    toastError('Failed to load plan options.')
  } finally {
    plansLoading.value = false
  }
}

watch(activeTab, (tab) => {
  if (tab !== 'plan') return
  if (!quota.value) fetchQuota()
  if (!plansLoaded.value) fetchPublicPlans()
  fetchMyPayments()
})

const storagePercent = computed(() => {
  if (!quota.value || quota.value.storage_limit_bytes <= 0) return 0
  return Math.min(Math.round((quota.value.used_storage_bytes / quota.value.storage_limit_bytes) * 100), 100)
})

const imagePercent = computed(() => {
  if (!quota.value || quota.value.max_images <= 0) return 0
  return Math.min(Math.round((quota.value.image_count / quota.value.max_images) * 100), 100)
})

function formatStorage(bytes: number) {
  if (bytes <= 0) return 'Unlimited storage'
  const gb = bytes / 1024 / 1024 / 1024
  if (gb >= 1) return `${Number.isInteger(gb) ? gb : gb.toFixed(1)} GB storage`
  const mb = bytes / 1024 / 1024
  return `${Number.isInteger(mb) ? mb : mb.toFixed(1)} MB storage`
}

const planTiers = computed(() => {
  return publicPlans.value.map((plan) => {
    const features = [
      formatStorage(plan.storage_limit_bytes),
      `Max ${plan.max_upload_mb} MB per file`,
      plan.image_limit > 0 ? `Up to ${plan.image_limit.toLocaleString()} images` : 'Unlimited images',
    ]
    if (plan.api_access) features.push('API access')

    return {
      key: plan.plan_key,
      name: plan.display_name,
      desc: plan.monthly_price_thb > 0 ? 'Subscription plan with auto-upgrade after payment confirmation.' : 'Starter plan for getting started.',
      monthlyPrice: plan.monthly_price_thb,
      priceLabel: plan.monthly_price_thb > 0 ? `฿${plan.monthly_price_thb.toLocaleString()}` : 'Free',
      features,
    }
  })
})

function startCheckout(planKey: string) {
  router.push(`/billing/checkout/${planKey}`)
}

// ── Subscription cancellation ─────────────────────────────────────────────
const cancelLoading = ref(false)
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const cancelMonth = ref('')
const cancelYear = ref('')

const nowForCancel = new Date()
const currentCancelYear = nowForCancel.getFullYear()
const currentCancelMonth = nowForCancel.getMonth() + 1

const cancelMonthOptions = computed(() => {
  const selectedYear = Number(cancelYear.value)
  const startMonth = selectedYear === currentCancelYear ? currentCancelMonth : 1
  return monthNames
    .map((label, idx) => ({
      label,
      month: idx + 1,
      value: String(idx + 1).padStart(2, '0'),
    }))
    .filter((m) => m.month >= startMonth)
    .map(({ label, value }) => ({ label, value }))
})

const cancelYearOptions = computed(() => {
  const start = currentCancelYear
  const years: number[] = []
  for (let y = start; y <= start + 5; y += 1) years.push(y)
  return years
})

const cancelMonthLabel = computed(() => {
  const idx = Number(cancelMonth.value) - 1
  return monthNames[idx] ?? ''
})

watch(
  () => user.value?.plan_expires_at,
  (expiresAt) => {
    const fallback = nowForCancel
    const d = expiresAt ? new Date(expiresAt) : fallback
    const targetYear = Math.max(d.getFullYear(), currentCancelYear)
    const targetMonth = targetYear === currentCancelYear ? Math.max(d.getMonth() + 1, currentCancelMonth) : d.getMonth() + 1
    cancelYear.value = String(targetYear)
    cancelMonth.value = String(targetMonth).padStart(2, '0')
  },
  { immediate: true },
)

watch(
  [cancelYear, cancelMonthOptions],
  () => {
    const hasSelected = cancelMonthOptions.value.some((m) => m.value === cancelMonth.value)
    if (!hasSelected) {
      cancelMonth.value = cancelMonthOptions.value[0]?.value ?? ''
    }
  },
  { immediate: true },
)

function formatPlanExpiryDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

async function handleCancelSubscription() {
  const now = new Date()
  const selectedYear = Number(cancelYear.value)
  const selectedMonth = Number(cancelMonth.value)
  if (!Number.isFinite(selectedYear) || !Number.isFinite(selectedMonth) || selectedMonth < 1 || selectedMonth > 12) {
    toastError('Please select both month and year.')
    return
  }
  const selectedMonthStart = new Date(selectedYear, selectedMonth - 1, 1, 0, 0, 0)
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0)
  if (selectedMonthStart < currentMonthStart) {
    toastError('Selected month cannot be in the past.')
    return
  }

  cancelLoading.value = true
  try {
    await cancelSubscription(`${cancelYear.value}-${cancelMonth.value}`)
    await refreshMe()
    success('Your subscription has been cancelled.')
  } catch (err: any) {
    const msg = err?.data?.message || 'Failed to cancel subscription. Please try again.'
    toastError(msg)
  } finally {
    cancelLoading.value = false
  }
}</script>
