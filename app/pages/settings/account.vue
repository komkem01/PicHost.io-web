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
          <NuxtLink to="/dashboard" class="text-[13px] text-white/60 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors">Dashboard</NuxtLink>
          <NuxtLink to="/upload" class="text-[13px] text-white/60 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors">Upload</NuxtLink>
          <NuxtLink to="/settings/account" class="text-[13px] text-white px-3 py-1.5 rounded-lg bg-white/[0.06] font-medium">Settings</NuxtLink>
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
      <div class="max-w-3xl mx-auto px-6 py-12">

        <div class="mb-8">
          <h1 class="text-[22px] font-bold text-white">Settings</h1>
          <p class="text-white/35 text-sm mt-1">Manage your account preferences.</p>
        </div>

        <div v-if="pageLoading" class="space-y-4">
          <div class="h-10 rounded-xl bg-white/[0.04] animate-pulse" />
          <div class="h-48 rounded-2xl bg-white/[0.03] animate-pulse" />
        </div>

        <template v-else-if="user">

          <!-- Tab bar -->
          <div class="flex items-center gap-1 mb-6 border-b border-white/[0.07]">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'flex items-center gap-1.5 px-3.5 py-2.5 text-[13px] font-medium transition-colors relative',
                activeTab === tab.id ? 'text-white' : 'text-white/40 hover:text-white/70',
              ]"
            >
              <span v-html="tab.icon" class="w-4 h-4 shrink-0" />
              {{ tab.label }}
              <span v-if="activeTab === tab.id" class="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500 rounded-full" />
            </button>
          </div>

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
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium border" :class="planBadge.class">
                  <span class="w-1.5 h-1.5 rounded-full" :class="planBadge.dot" />Active
                </span>
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
                    <p class="text-[11px] text-white/30 mb-1">Private images</p>
                    <p class="text-[14px] font-semibold">{{ quota.allow_private ? 'Yes' : 'No' }}</p>
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
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div v-for="tier in planTiers" :key="tier.name" class="rounded-xl border p-4 transition-all"
                :class="tier.name === user.plan ? 'border-blue-500/40 bg-blue-600/[0.05]' : 'border-white/[0.07] bg-white/[0.02] opacity-50'">
                <div class="flex items-center justify-between mb-2">
                  <p class="font-semibold text-[14px]">{{ tier.name }}</p>
                  <span v-if="tier.name === user.plan" class="text-[10px] font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">Current</span>
                </div>
                <p class="text-[12px] text-white/40 mb-3">{{ tier.desc }}</p>
                <ul class="space-y-1.5">
                  <li v-for="feat in tier.features" :key="feat" class="flex items-center gap-2 text-[12px] text-white/55">
                    <svg class="w-3.5 h-3.5 text-blue-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                    {{ feat }}
                  </li>
                </ul>
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
                    <button @click="deleteConfirm = !deleteConfirm"
                      class="shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-lg border border-red-500/30 bg-red-500/[0.06] hover:bg-red-500/[0.12] text-red-400 hover:text-red-300 text-[13px] font-medium transition-all">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      Delete account
                    </button>
                  </div>

                  <Transition
                    enter-active-class="transition duration-200"
                    enter-from-class="opacity-0 -translate-y-1"
                    leave-active-class="transition duration-150"
                    leave-to-class="opacity-0 -translate-y-1"
                  >
                    <div v-if="deleteConfirm" class="mt-4 p-4 rounded-xl border border-red-500/25 bg-red-500/[0.05] space-y-3">
                      <p class="text-[12.5px] text-red-300/80">Type your email <span class="font-semibold text-red-300">{{ user.email }}</span> to confirm deletion.</p>
                      <input
                        v-model="deleteConfirmEmail"
                        type="email"
                        placeholder="Enter your email"
                        class="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-red-500/20 focus:border-red-500/50 focus:outline-none text-[13px] text-white placeholder-white/20 transition-colors"
                      />
                      <div class="flex justify-end gap-2">
                        <button @click="deleteConfirm = false; deleteConfirmEmail = ''"
                          class="px-3.5 py-2 rounded-lg text-[13px] font-medium text-white/40 hover:text-white/70 transition-colors">
                          Cancel
                        </button>
                        <button
                          @click="deleteAccount"
                          :disabled="deleteConfirmEmail !== user.email || deleteDeleting"
                          class="flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-medium bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all">
                          <svg v-if="deleteDeleting" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                          {{ deleteDeleting ? 'Deleting…' : 'Permanently delete' }}
                        </button>
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>
            </div>
          </div>

        </template>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const router = useRouter()
const { user, fetchMe, refreshMe, getToken } = useAuth()
const { success, error: toastError } = useToast()
const { open: openLogoutModal } = useLogoutModal()

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
  if (!me) { router.replace('/auth/login'); return }
  profileForm.username = me.username ?? ''
  profileForm.email = me.email ?? ''
  pageLoading.value = false
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

const deleteConfirm = ref(false)
const deleteConfirmEmail = ref('')
const deleteDeleting = ref(false)

async function deleteAccount() {
  if (!user.value || deleteConfirmEmail.value !== user.value.email) return
  deleteDeleting.value = true
  try {
    const token = getToken()
    await $fetch(`${config.public.apiBase}/auth/me`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
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

watch(activeTab, (tab) => {
  if (tab === 'plan' && !quota.value) fetchQuota()
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

const planTiers = [
  { name: 'Free', desc: 'Great for personal projects', features: ['500 MB storage', '200 images', '10 MB per file', 'JPEG, PNG, WebP'] },
  { name: 'Basic', desc: 'For hobbyists and small teams', features: ['10 GB storage', 'Unlimited images', '20 MB per file', 'Private images'] },
  { name: 'Pro', desc: 'For professionals', features: ['100 GB storage', 'Unlimited images', '50 MB per file', 'All formats'] },
  { name: 'Enterprise', desc: 'Custom usage at scale', features: ['Unlimited storage', 'Unlimited images', 'No file size limit', 'Priority support'] },
]
</script>
