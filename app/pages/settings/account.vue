<template>
  <div class="max-w-7xl mx-auto px-6 py-10">

        <div class="mb-8">
          <h1 class="text-[26px] font-bold tracking-tight leading-tight text-zinc-900">{{ $t('settings.title') }}</h1>
          <p class="text-zinc-500 text-sm mt-1.5">{{ $t('settings.subtitle') }}</p>
        </div>

        <div v-if="pageLoading" class="space-y-4">
          <div class="h-10 rounded-xl bg-zinc-200 animate-pulse" />
          <div class="h-48 rounded-2xl bg-zinc-200 animate-pulse" />
        </div>

        <template v-else-if="user">
          <div class="flex flex-col lg:flex-row gap-8 items-start">
            <!-- Left Sidebar Menu (lg:w-[220px] shrink-0, sticky on scroll) -->
            <div class="hidden lg:flex flex-col gap-1 w-[220px] shrink-0 sticky top-[84px] self-start">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                class="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[13.5px] font-medium transition-all text-left border cursor-pointer"
                :class="activeTab === tab.id ? 'bg-zinc-900 border-zinc-900 text-white font-semibold shadow-xs' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 border-transparent'"
              >
                <span v-html="tab.icon" class="w-4 h-4 shrink-0" />
                {{ tab.label }}
              </button>
            </div>

            <!-- Mobile Horizontal Tab Switcher (lg:hidden, sticky on scroll) -->
            <div class="lg:hidden w-full flex items-center gap-1 mb-2 border-b border-zinc-200 overflow-x-auto scrollbar-none sticky top-[64px] bg-[#FAFAFA] z-20 py-1">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'flex items-center gap-1.5 px-3.5 py-2.5 text-[13px] font-medium transition-colors relative shrink-0 cursor-pointer',
                  activeTab === tab.id ? 'text-zinc-900 font-semibold' : 'text-zinc-500 hover:text-zinc-900',
                ]"
              >
                <span v-html="tab.icon" class="w-4 h-4 shrink-0" />
                {{ tab.label }}
                <span v-if="activeTab === tab.id" class="absolute bottom-0 left-0 right-0 h-[2px] bg-zinc-900 rounded-full" />
              </button>
            </div>

            <!-- Main Content Area -->
            <div class="flex-1 min-w-0 w-full space-y-6">

          <!-- PROFILE TAB -->
          <div v-if="activeTab === 'profile'" class="space-y-5">
            <div class="rounded-2xl border border-zinc-200 bg-white p-5 shadow-card flex items-center gap-4">
              <div class="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center text-2xl font-bold text-white shadow-xs shrink-0">
                {{ avatarInitial }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-[15px] text-zinc-900 truncate">{{ user.username ?? user.email ?? "—" }}</p>
                <p class="text-zinc-500 text-sm truncate mt-0.5">{{ user.email ?? "—" }}</p>
              </div>
              <span class="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-medium border" :class="planBadge.class">
                <span class="w-1.5 h-1.5 rounded-full" :class="planBadge.dot" />
                {{ user.plan }}
              </span>
            </div>
            <!-- READ ONLY PROFILE CARD -->
            <div class="rounded-2xl border border-zinc-200 bg-white shadow-card">
              <div class="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
                <div>
                  <p class="text-[14px] font-semibold text-zinc-900">
                    {{ locale === 'th' ? 'ข้อมูลส่วนตัว' : 'Profile Information' }}
                  </p>
                  <p class="text-[12px] text-zinc-500 mt-0.5">
                    {{ locale === 'th' ? 'ข้อมูลบัญชีทั่วไปของคุณ' : 'Your account details and preferences' }}
                  </p>
                </div>
                <button
                  type="button"
                  @click="openEditProfileModal"
                  class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-[12.5px] font-semibold transition-all shadow-xs cursor-pointer"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                  {{ locale === 'th' ? 'แก้ไขข้อมูล' : 'Edit Profile' }}
                </button>
              </div>

              <div class="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80">
                  <span class="text-[11.5px] font-medium text-zinc-400 block mb-1">
                    {{ $t('settings.profile.name') }}
                  </span>
                  <span class="text-[14px] font-semibold text-zinc-900 block truncate">
                    {{ user.username || '—' }}
                  </span>
                </div>

                <div class="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80">
                  <span class="text-[11.5px] font-medium text-zinc-400 block mb-1">
                    {{ $t('settings.profile.email') }}
                  </span>
                  <div class="flex items-center justify-between gap-2">
                    <span class="text-[14px] font-semibold text-zinc-900 truncate">
                      {{ user.email || '—' }}
                    </span>
                    <span
                      v-if="user.email_verified_at"
                      class="shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
                    >
                      {{ locale === 'th' ? 'ยืนยันแล้ว' : 'Verified' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- EDIT PROFILE MODAL -->
            <Teleport to="body">
              <Transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="opacity-0"
                leave-active-class="transition duration-150 ease-in"
                leave-to-class="opacity-0"
              >
                <div
                  v-if="editProfileModalOpen"
                  class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs"
                  @click.self="closeEditProfileModal"
                >
                  <div class="relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-modal space-y-5">
                    <div class="flex items-center justify-between pb-3 border-b border-zinc-100">
                      <div>
                        <h3 class="text-[16px] font-bold text-zinc-900">
                          {{ locale === 'th' ? 'แก้ไขข้อมูลส่วนตัว' : 'Edit Profile' }}
                        </h3>
                        <p class="text-[12px] text-zinc-500 mt-0.5">
                          {{ locale === 'th' ? 'อัปเดตชื่อผู้ใช้และอีเมลของคุณ' : 'Update your username and email address.' }}
                        </p>
                      </div>
                      <button
                        @click="closeEditProfileModal"
                        class="w-8 h-8 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <form @submit.prevent="saveProfile" class="space-y-4">
                      <div>
                        <label class="block text-[12px] font-medium text-zinc-700 mb-1.5">
                          {{ $t('settings.profile.name') }}
                        </label>
                        <input
                          v-model="profileForm.username"
                          type="text"
                          autocomplete="username"
                          :placeholder="locale === 'th' ? 'ชื่อผู้ใช้งานของคุณ' : 'Your username'"
                          class="w-full bg-white border border-zinc-200 focus:border-zinc-400 rounded-xl px-3.5 py-2.5 text-[13.5px] text-zinc-900 placeholder:text-zinc-400 outline-none transition-all shadow-xs"
                        />
                      </div>

                      <div>
                        <label class="block text-[12px] font-medium text-zinc-700 mb-1.5">
                          {{ $t('settings.profile.email') }}
                        </label>
                        <input
                          v-model="profileForm.email"
                          type="email"
                          autocomplete="email"
                          placeholder="your@email.com"
                          class="w-full bg-white border border-zinc-200 focus:border-zinc-400 rounded-xl px-3.5 py-2.5 text-[13.5px] text-zinc-900 placeholder:text-zinc-400 outline-none transition-all shadow-xs"
                        />
                      </div>

                      <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-100">
                        <button
                          type="button"
                          @click="closeEditProfileModal"
                          :disabled="profileSaving"
                          class="px-4 py-2.5 rounded-xl border border-zinc-200 text-[13px] font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 transition-colors cursor-pointer"
                        >
                          {{ $t('common.cancel') }}
                        </button>
                        <button
                          type="submit"
                          :disabled="profileSaving || !profileDirty"
                          class="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[13px] font-semibold transition-all shadow-xs cursor-pointer"
                        >
                          <AppSpinner v-if="profileSaving" size="sm" />
                          {{ profileSaving ? (locale === 'th' ? 'กำลังบันทึก…' : 'Saving…') : (locale === 'th' ? 'บันทึกข้อมูล' : 'Save Changes') }}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Transition>
            </Teleport>
          </div>

          <!-- SECURITY TAB -->
          <div v-if="activeTab === 'security'" class="space-y-5">
            <!-- READ ONLY SECURITY CARD -->
            <div class="rounded-2xl border border-zinc-200 bg-white shadow-card">
              <div class="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
                <div>
                  <p class="text-[14px] font-semibold text-zinc-900">
                    {{ locale === 'th' ? 'ความปลอดภัยของบัญชี' : 'Account Security' }}
                  </p>
                  <p class="text-[12px] text-zinc-500 mt-0.5">
                    {{ locale === 'th' ? 'จัดการรหัสผ่านและระดับความปลอดภัยของบัญชี' : 'Manage your password and security settings' }}
                  </p>
                </div>
                <button
                  type="button"
                  @click="openChangePasswordModal"
                  class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-[12.5px] font-semibold transition-all shadow-xs cursor-pointer"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  {{ locale === 'th' ? 'เปลี่ยนรหัสผ่าน' : 'Change Password' }}
                </button>
              </div>

              <div class="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80">
                  <span class="text-[11.5px] font-medium text-zinc-400 block mb-1">
                    {{ locale === 'th' ? 'รหัสผ่านปัจจุบัน' : 'Current Password' }}
                  </span>
                  <div class="flex items-center justify-between gap-2">
                    <span class="text-[14px] font-mono tracking-widest text-zinc-900 block">
                      ••••••••••••
                    </span>
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {{ locale === 'th' ? 'ปลอดภัย' : 'Secured' }}
                    </span>
                  </div>
                </div>

                <div class="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80">
                  <span class="text-[11.5px] font-medium text-zinc-400 block mb-1">
                    {{ locale === 'th' ? 'เงื่อนไขรหัสผ่าน' : 'Password Requirement' }}
                  </span>
                  <span class="text-[13px] font-medium text-zinc-700 block">
                    {{ locale === 'th' ? 'ความยาวอย่างน้อย 8 ตัวอักษร' : 'Minimum 8 characters' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- CHANGE PASSWORD MODAL -->
            <Teleport to="body">
              <Transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="opacity-0"
                leave-active-class="transition duration-150 ease-in"
                leave-to-class="opacity-0"
              >
                <div
                  v-if="changePasswordModalOpen"
                  class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs"
                  @click.self="closeChangePasswordModal"
                >
                  <div class="relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-modal space-y-5">
                    <div class="flex items-center justify-between pb-3 border-b border-zinc-100">
                      <div>
                        <h3 class="text-[16px] font-bold text-zinc-900">
                          {{ $t('settings.security.changePassword') }}
                        </h3>
                        <p class="text-[12px] text-zinc-500 mt-0.5">
                          {{ locale === 'th' ? 'ใช้รหัสผ่านที่มีความปลอดภัยอย่างน้อย 8 ตัวอักษร' : 'Use a strong password with at least 8 characters.' }}
                        </p>
                      </div>
                      <button
                        @click="closeChangePasswordModal"
                        class="w-8 h-8 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <form @submit.prevent="changePassword" class="space-y-4">
                      <div>
                        <label class="block text-[12px] font-medium text-zinc-700 mb-1.5">{{ $t('settings.security.oldPassword') }}</label>
                        <div class="relative">
                          <input v-model="pwForm.current" :type="showCurrent ? 'text' : 'password'" autocomplete="current-password" :placeholder="locale === 'th' ? 'กรอกรหัสผ่านปัจจุบัน' : 'Enter current password'"
                            class="w-full bg-white border border-zinc-200 focus:border-zinc-400 rounded-xl px-3.5 py-2.5 pr-10 text-[13.5px] text-zinc-900 placeholder:text-zinc-400 outline-none transition-all shadow-xs" />
                          <button type="button" @click="showCurrent = !showCurrent" class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer">
                            <svg v-if="!showCurrent" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label class="block text-[12px] font-medium text-zinc-700 mb-1.5">{{ $t('settings.security.newPassword') }}</label>
                        <div class="relative">
                          <input v-model="pwForm.newPwd" :type="showNew ? 'text' : 'password'" autocomplete="new-password" :placeholder="locale === 'th' ? 'อย่างน้อย 8 ตัวอักษร' : 'At least 8 characters'"
                            class="w-full bg-white border border-zinc-200 focus:border-zinc-400 rounded-xl px-3.5 py-2.5 pr-10 text-[13.5px] text-zinc-900 placeholder:text-zinc-400 outline-none transition-all shadow-xs" />
                          <button type="button" @click="showNew = !showNew" class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer">
                            <svg v-if="!showNew" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                          </button>
                        </div>
                        <div v-if="pwForm.newPwd" class="mt-2 flex items-center gap-2">
                          <div class="flex gap-1 flex-1">
                            <div v-for="i in 4" :key="i" class="h-1 flex-1 rounded-full transition-all duration-300" :class="i <= pwStrength ? pwStrengthColor : 'bg-zinc-200'" />
                          </div>
                          <span class="text-[11px] shrink-0 font-medium" :class="pwStrengthTextColor">{{ pwStrengthLabel }}</span>
                        </div>
                      </div>

                      <div>
                        <label class="block text-[12px] font-medium text-zinc-700 mb-1.5">{{ $t('settings.security.confirmPassword') }}</label>
                        <div class="relative">
                          <input v-model="pwForm.confirm" :type="showConfirm ? 'text' : 'password'" autocomplete="new-password" :placeholder="locale === 'th' ? 'กรอกรหัสผ่านใหม่อีกครั้ง' : 'Repeat new password'"
                            class="w-full bg-white border border-zinc-200 focus:border-zinc-400 rounded-xl px-3.5 py-2.5 pr-10 text-[13.5px] text-zinc-900 placeholder:text-zinc-400 outline-none transition-all shadow-xs"
                            :class="pwForm.confirm && pwForm.newPwd !== pwForm.confirm ? 'border-red-300' : ''" />
                          <button type="button" @click="showConfirm = !showConfirm" class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer">
                            <svg v-if="!showConfirm" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                          </button>
                        </div>
                        <p v-if="pwForm.confirm && pwForm.newPwd !== pwForm.confirm" class="text-[11.5px] text-red-600 mt-1.5">
                          {{ locale === 'th' ? 'รหัสผ่านทั้งสองช่องไม่ตรงกัน' : 'Passwords do not match' }}
                        </p>
                      </div>

                      <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-100">
                        <button
                          type="button"
                          @click="closeChangePasswordModal"
                          :disabled="pwSaving"
                          class="px-4 py-2.5 rounded-xl border border-zinc-200 text-[13px] font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 transition-colors cursor-pointer"
                        >
                          {{ $t('common.cancel') }}
                        </button>
                        <button
                          type="submit"
                          :disabled="pwSaving || !pwForm.current || !pwForm.newPwd || !pwForm.confirm || pwForm.newPwd !== pwForm.confirm || pwForm.newPwd.length < 8"
                          class="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[13px] font-semibold transition-all shadow-xs cursor-pointer"
                        >
                          <AppSpinner v-if="pwSaving" size="sm" />
                          {{ pwSaving ? (locale === 'th' ? 'กำลังบันทึก…' : 'Saving…') : $t('settings.security.submitBtn') }}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Transition>
            </Teleport>
          </div>

          <!-- PLAN TAB -->
          <div v-if="activeTab === 'plan'" class="space-y-4">
            <div class="rounded-2xl border border-zinc-200 bg-white shadow-card p-5">
              <div class="flex items-center justify-between gap-4 mb-5">
                <div>
                  <p class="text-[12px] text-zinc-400 mb-1">{{ $t('pricing.currentPlan') }}</p>
                  <p class="text-xl font-bold text-zinc-900">{{ user.plan }}</p>
                </div>
                <span v-if="user.plan_cancelled_at" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium border border-amber-200 bg-amber-50 text-amber-700">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-500" />{{ locale === 'th' ? 'ยกเลิกแล้ว' : 'Cancelled' }}
                </span>
                <span v-else class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium border" :class="planBadge.class">
                  <span class="w-1.5 h-1.5 rounded-full" :class="planBadge.dot" />{{ locale === 'th' ? 'ใช้งานอยู่' : 'Active' }}
                </span>
              </div>

              <!-- Subscription expiry / cancellation notice -->
              <div v-if="user.plan !== 'Free' && user.plan_expires_at" class="mb-4">
                <div v-if="user.plan_cancelled_at" class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] text-amber-800 leading-relaxed">
                  {{ locale === 'th' ? 'แพ็กเกจของคุณถูกยกเลิกแล้ว คุณยังคงใช้สิทธิ์แพ็กเกจ' : 'Your subscription has been cancelled. You will keep' }} <span class="font-semibold">{{ user.plan }}</span> {{ locale === 'th' ? 'ได้จนถึง' : 'access until' }}
                  <span class="font-semibold">{{ formatPlanExpiryDate(user.plan_expires_at) }}</span>{{ locale === 'th' ? ' หลังจากนั้นบัญชีจะถูกปรับเป็นแพ็กเกจ Free' : ', then your account will be downgraded to the Free plan.' }}
                </div>
                <div v-else class="flex items-center gap-2 text-[12px] text-zinc-500">
                  <svg class="w-3.5 h-3.5 text-zinc-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  {{ locale === 'th' ? 'ใช้งานได้ถึง' : 'Active until' }} <span class="text-zinc-800 font-medium">{{ formatPlanExpiryDate(user.plan_expires_at) }}</span>
                </div>
              </div>

              <!-- Usage: Storage -->
              <div v-if="quota" class="space-y-4">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-[12px] text-zinc-500">{{ $t('dashboard.stats.storageUsed') }}</span>
                    <span class="text-[12px] font-medium text-zinc-800">
                      {{ formatBytes(quota.used_storage_bytes) }}
                      <span class="text-zinc-400"> / {{ quota.storage_limit_bytes === -1 ? (locale === 'th' ? 'ไม่จำกัด' : 'Unlimited') : formatBytes(quota.storage_limit_bytes) }}</span>
                    </span>
                  </div>
                  <div class="h-2 rounded-full bg-zinc-100 border border-zinc-200 overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-500"
                      :class="storagePercent >= 90 ? 'bg-red-500' : storagePercent >= 70 ? 'bg-amber-500' : 'bg-zinc-900'"
                      :style="{ width: quota.storage_limit_bytes === -1 ? '0%' : `${storagePercent}%` }"
                    />
                  </div>
                </div>

                <!-- Usage: Images -->
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-[12px] text-zinc-500">{{ locale === 'th' ? 'จำนวนรูปภาพ' : 'Images' }}</span>
                    <span class="text-[12px] font-medium text-zinc-800">
                      {{ quota.image_count.toLocaleString() }}
                      <span class="text-zinc-400"> / {{ quota.max_images === 0 ? (locale === 'th' ? 'ไม่จำกัด' : 'Unlimited') : quota.max_images.toLocaleString() }}</span>
                    </span>
                  </div>
                  <div v-if="quota.max_images > 0" class="h-2 rounded-full bg-zinc-100 border border-zinc-200 overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-500"
                      :class="imagePercent >= 90 ? 'bg-red-500' : imagePercent >= 70 ? 'bg-amber-500' : 'bg-zinc-900'"
                      :style="{ width: `${imagePercent}%` }"
                    />
                  </div>
                  <div v-else class="h-2 rounded-full bg-zinc-100 border border-zinc-200" />
                </div>

                <!-- Info grid -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  <div class="rounded-xl bg-zinc-50 border border-zinc-200 p-3.5">
                    <p class="text-[11px] text-zinc-400 mb-1">{{ locale === 'th' ? 'ยอดเปิดดูรูปภาพรวม' : 'Total Views' }}</p>
                    <p class="text-[14px] font-semibold text-zinc-900">{{ (quota.total_views ?? 0).toLocaleString() }}</p>
                  </div>
                  <div class="rounded-xl bg-zinc-50 border border-zinc-200 p-3.5">
                    <p class="text-[11px] text-zinc-400 mb-1">{{ locale === 'th' ? 'ขนาดไฟล์สูงสุด' : 'Max file size' }}</p>
                    <p class="text-[14px] font-semibold text-zinc-900">{{ quota.file_size_limit_bytes === -1 ? (locale === 'th' ? 'ไม่จำกัด' : 'Unlimited') : formatBytes(quota.file_size_limit_bytes) }}</p>
                  </div>
                  <div class="rounded-xl bg-zinc-50 border border-zinc-200 p-3.5">
                    <p class="text-[11px] text-zinc-400 mb-1">{{ locale === 'th' ? 'สิทธิ์เชื่อมต่อ API' : 'API access' }}</p>
                    <p class="text-[14px] font-semibold text-zinc-900">{{ quota.plan !== 'Free' ? (locale === 'th' ? 'เปิดใช้งาน' : 'Enabled') : (locale === 'th' ? 'ปิดใช้งาน' : 'Disabled') }}</p>
                  </div>
                  <div class="rounded-xl bg-zinc-50 border border-zinc-200 p-3.5">
                    <p class="text-[11px] text-zinc-400 mb-1">{{ locale === 'th' ? 'ระดับแพ็กเกจ' : 'Plan tier' }}</p>
                    <p class="text-[14px] font-semibold text-zinc-900">{{ quota.plan }}</p>
                  </div>
                </div>
              </div>

              <!-- Loading skeleton -->
              <div v-else class="space-y-4">
                <div class="h-8 rounded-lg bg-zinc-200 animate-pulse" />
                <div class="h-8 rounded-lg bg-zinc-200 animate-pulse" />
                <div class="grid grid-cols-3 gap-3">
                  <div class="h-16 rounded-xl bg-zinc-200 animate-pulse" />
                  <div class="h-16 rounded-xl bg-zinc-200 animate-pulse" />
                  <div class="h-16 rounded-xl bg-zinc-200 animate-pulse" />
                </div>
              </div>

            </div>

            <!-- Tier cards -->
            <div class="rounded-xl border border-zinc-200 bg-zinc-100 p-4">
              <p class="text-[13px] font-medium text-zinc-900">{{ locale === 'th' ? 'การอัปเกรดแพ็กเกจ' : 'Upgrade flow' }}</p>
              <p class="text-[12px] text-zinc-500 mt-1">{{ locale === 'th' ? 'เลือกแพ็กเกจที่ต้องการและทำรายการชำระเงิน ระบบจะปรับแพ็กเกจให้อัตโนมัติหลังยืนยันชำระเงิน' : 'Select a plan and continue to checkout. Your account plan upgrades automatically after payment confirmation.' }}</p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div v-for="tier in planTiers" :key="tier.key" class="rounded-2xl border p-5 transition-all shadow-card bg-white"
                :class="tier.name === user.plan ? 'border-zinc-900 shadow-elevated' : 'border-zinc-200'">
                <div class="flex items-center justify-between mb-2">
                  <p class="font-semibold text-[14px] text-zinc-900">{{ tier.name }}</p>
                  <span v-if="tier.name === user.plan" class="text-[10px] font-bold uppercase tracking-widest text-zinc-900 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-full">{{ locale === 'th' ? 'ปัจจุบัน' : 'Current' }}</span>
                </div>
                <p class="text-[18px] font-bold text-zinc-900 mb-1">
                  {{ tier.priceLabel }}
                  <span v-if="tier.monthlyPrice > 0" class="text-[12px] font-medium text-zinc-400">{{ locale === 'th' ? '/ เดือน' : '/ month' }}</span>
                </p>
                <p class="text-[12px] text-zinc-500 mb-3">{{ tier.desc }}</p>
                <ul class="space-y-1.5">
                  <li v-for="feat in tier.features" :key="feat" class="flex items-center gap-2 text-[12px] text-zinc-600">
                    <svg class="w-3.5 h-3.5 text-zinc-900 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                    {{ feat }}
                  </li>
                </ul>
                <button
                  type="button"
                  class="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  :class="tier.name === user.plan
                    ? 'bg-zinc-100 text-zinc-400 border border-zinc-200'
                    : 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-xs'"
                  :disabled="tier.name === user.plan || (tier.name === 'Free' && user.plan !== 'Free')"
                  @click="startCheckout(tier.key)"
                >
                  {{ tier.name === user.plan
                    ? (locale === 'th' ? 'แพ็กเกจปัจจุบัน' : 'Current plan')
                    : (tier.name === 'Free' && user.plan !== 'Free')
                      ? (locale === 'th' ? 'ใช้วิธียกเลิกเพื่อปรับเป็น Free' : 'Use cancellation to downgrade')
                      : (locale === 'th' ? `อัปเกรดเป็น ${tier.name}` : `Upgrade to ${tier.name}`) }}
                </button>

                <div v-if="tier.name === user.plan && user.plan !== 'Free' && !user.plan_cancelled_at" class="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 space-y-2.5">
                  <p class="text-[11px] text-red-700">{{ locale === 'th' ? 'เลือกเดือน/ปีที่ต้องการยกเลิกแพ็กเกจนี้' : 'Choose month/year then cancel this subscription.' }}</p>
                  <div class="grid grid-cols-2 gap-2">
                    <select
                      v-model="cancelMonth"
                      class="px-2.5 py-2 rounded-lg bg-white border border-red-200 focus:border-red-400 focus:outline-none text-[12px] text-zinc-900"
                    >
                      <option v-for="m in cancelMonthOptions" :key="m.value" :value="m.value">{{ m.label }}</option>
                    </select>
                    <select
                      v-model="cancelYear"
                      class="px-2.5 py-2 rounded-lg bg-white border border-red-200 focus:border-red-400 focus:outline-none text-[12px] text-zinc-900"
                    >
                      <option v-for="y in cancelYearOptions" :key="y" :value="String(y)">{{ y }}</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    class="w-full px-3 py-2 rounded-lg text-[12px] font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    :disabled="cancelLoading"
                    @click="handleCancelSubscription"
                  >
                    <AppSpinner v-if="cancelLoading" size="sm" />
                    {{ cancelLoading ? (locale === 'th' ? 'กำลังยกเลิก…' : 'Cancelling…') : (locale === 'th' ? `ยกเลิก ณ ${cancelMonthLabel} ${cancelYear}` : `Cancel at ${cancelMonthLabel} ${cancelYear}`) }}
                  </button>
                </div>

                <div v-if="tier.name === user.plan && user.plan_cancelled_at" class="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-800">
                  {{ locale === 'th' ? 'ยกเลิกแล้ว ใช้งานได้ถึง' : 'Cancelled. Active until' }} {{ formatPlanExpiryDate(user.plan_expires_at) }}.
                </div>
              </div>
            </div>

            <!-- PAYMENT HISTORY CARD -->
            <div v-if="myPayments.length > 0" class="rounded-2xl border border-zinc-200 bg-white shadow-card overflow-hidden">
              <div class="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
                <p class="text-[13.5px] font-semibold text-zinc-900">{{ locale === 'th' ? 'ประวัติการชำระเงิน' : 'Payment History' }}</p>
                <span class="text-[11px] text-zinc-400 font-medium">{{ myPayments.length }} {{ locale === 'th' ? 'รายการ' : 'orders' }}</span>
              </div>
              <div class="divide-y divide-zinc-100">
                <div v-for="pmt in paginatedPayments" :key="pmt.id"
                  @click="router.push(`/billing/payments/${pmt.id}`)"
                  class="flex items-center justify-between gap-4 p-4 hover:bg-zinc-50 transition-colors cursor-pointer group">
                  <div class="min-w-0">
                    <p class="text-[13px] font-semibold text-zinc-900 flex items-center gap-2">
                      {{ toPlanDisplayName(pmt.plan_key) }} Plan
                      <span class="text-[11px] font-mono text-zinc-400" :title="pmt.id">
                        #{{ pmt.id.slice(0, 8).toUpperCase() }}
                      </span>
                    </p>
                    <p class="text-[11px] text-zinc-400 mt-0.5">
                      {{ locale === 'th' ? 'ทำรายการเมื่อ' : 'Ordered on' }} {{ formatPlanExpiryDate(pmt.created_at) }}
                    </p>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="text-right">
                      <p class="text-[13px] font-bold text-zinc-900">฿{{ pmt.amount_thb.toLocaleString() }}</p>
                      <!-- Badge -->
                      <span class="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border mt-1"
                        :class="getHistoryBadgeClass(pmt.status)">
                        {{ pmt.status.toUpperCase() }}
                      </span>
                    </div>
                    <!-- Chevron -->
                    <svg class="w-4 h-4 text-zinc-300 group-hover:text-zinc-700 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Pagination controls -->
              <div v-if="totalPages > 1" class="px-5 py-3.5 border-t border-zinc-100 bg-zinc-50 flex items-center justify-between">
                <span class="text-[11.5px] text-zinc-500 font-medium">
                  {{ locale === 'th' ? `หน้า ${currentPage} จาก ${totalPages}` : `Page ${currentPage} of ${totalPages}` }}
                </span>
                <div class="flex items-center gap-2">
                  <button
                    @click="currentPage--"
                    :disabled="currentPage === 1"
                    class="px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white text-[11.5px] font-medium text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    {{ locale === 'th' ? 'ย้อนกลับ' : 'Previous' }}
                  </button>
                  <button
                    @click="currentPage++"
                    :disabled="currentPage === totalPages"
                    class="px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white text-[11.5px] font-medium text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    {{ locale === 'th' ? 'ถัดไป' : 'Next' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- DANGER TAB -->
          <div v-if="activeTab === 'danger'" class="space-y-4">
            <div class="rounded-2xl border border-red-200 bg-red-50/50 overflow-hidden shadow-card">
              <div class="px-5 py-4 border-b border-red-100">
                <p class="text-[13.5px] font-semibold text-red-700">{{ locale === 'th' ? 'การจัดการบัญชีและความปลอดภัย' : 'Danger zone' }}</p>
                <p class="text-[12px] text-red-600/70 mt-0.5">{{ locale === 'th' ? 'การดำเนินการในส่วนนี้โปรดระมัดระวัง' : 'These actions are irreversible. Please proceed with caution.' }}</p>
              </div>
              <div class="divide-y divide-red-100">
                <div class="flex items-center justify-between gap-4 p-5">
                  <div>
                    <p class="text-[13.5px] font-medium text-zinc-900">{{ locale === 'th' ? 'ออกจากระบบทุกอุปกรณ์' : 'Sign out of all sessions' }}</p>
                    <p class="text-[12px] text-zinc-500 mt-0.5">{{ locale === 'th' ? 'ออกจากระบบบัญชีผู้ใช้นี้ทันที' : 'You will be signed out immediately' }}</p>
                  </div>
                  <button @click="openLogoutModal()"
                    class="shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-red-200/80 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 text-[13px] font-semibold transition-all cursor-pointer shadow-2xs">
                    <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                    <span>{{ locale === 'th' ? 'ออกจากระบบ' : 'Sign out' }}</span>
                  </button>
                </div>

                <div class="p-5">
                  <div class="flex items-center justify-between gap-4">
                    <div>
                      <p class="text-[13.5px] font-medium text-red-700">{{ locale === 'th' ? 'ลบบัญชีผู้ใช้' : 'Delete account' }}</p>
                      <p class="text-[12px] text-red-600/70 mt-0.5">{{ locale === 'th' ? 'ลบบัญชีผู้ใช้และข้อมูลทั้งหมดถาวร ไม่สามารถกู้คืนได้' : 'Permanently delete your account and all data. This cannot be undone.' }}</p>
                    </div>
                    <button @click="openDeleteModal"
                      class="shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl border border-red-200 bg-red-600 hover:bg-red-700 text-white text-[13px] font-semibold transition-all cursor-pointer shadow-xs">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      {{ locale === 'th' ? 'ลบบัญชีผู้ใช้' : 'Delete account' }}
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
                      <div v-if="deleteModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs">
                        <div class="fixed inset-0" @click="closeDeleteModal"></div>

                        <Transition
                          enter-active-class="transition duration-200 ease-out"
                          enter-from-class="opacity-0 scale-95"
                          leave-active-class="transition duration-150 ease-in"
                          leave-to-class="opacity-0 scale-95"
                        >
                          <div v-if="deleteModalOpen" class="relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-modal flex flex-col items-center text-center">
                            <span class="w-12 h-12 rounded-2xl bg-red-50 border border-red-200/80 flex items-center justify-center shrink-0 mb-4">
                              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                              </svg>
                            </span>
                            <h3 class="text-[16px] font-bold text-zinc-900 text-center mb-1">
                              {{ locale === 'th' ? 'ต้องการลบบัญชีผู้ใช้หรือไม่?' : 'Delete Account?' }}
                            </h3>
                            <p class="text-[12.5px] text-zinc-500 text-center mb-4 leading-relaxed">
                              {{ locale === 'th' ? 'การดำเนินการนี้จะลบข้อมูลบัญชี รูปภาพ และประวัติทั้งหมดถาวร' : 'This action is permanent and cannot be undone.' }}
                            </p>

                            <div class="space-y-4 w-full">
                              <div class="rounded-xl bg-red-50 border border-red-200 p-3.5 text-center">
                                <p class="text-[12px] text-red-800">
                                  {{ locale === 'th' ? 'พิมพ์อีเมล' : 'Please type your email' }} <span class="font-bold text-red-900">{{ user?.email }}</span> {{ locale === 'th' ? 'ด้านล่างเพื่อยืนยันการลบ' : 'below to confirm.' }}
                                </p>
                              </div>

                              <input
                                v-model="deleteConfirmEmail"
                                type="email"
                                :placeholder="locale === 'th' ? 'กรอกอีเมลของคุณเพื่อยืนยัน' : 'Enter your email to confirm'"
                                class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-zinc-200 focus:border-red-400 focus:outline-none text-[13px] text-zinc-900 placeholder:text-zinc-400 transition-all text-center shadow-xs"
                              />

                              <div class="flex items-center justify-end gap-2.5 pt-2">
                                <button
                                  @click="closeDeleteModal"
                                  :disabled="deleteDeleting"
                                  class="flex-1 py-2.5 rounded-xl border border-zinc-200 text-[13px] font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 transition-colors cursor-pointer"
                                >
                                  {{ $t('common.cancel') }}
                                </button>
                                <button
                                  @click="deleteAccount"
                                  :disabled="deleteConfirmEmail !== user?.email || deleteDeleting"
                                  class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[13px] font-semibold transition-all shadow-xs cursor-pointer"
                                >
                                  <AppSpinner v-if="deleteDeleting" size="sm" />
                                  {{ deleteDeleting ? (locale === 'th' ? 'กำลังลบบัญชี…' : 'Deleting Account…') : (locale === 'th' ? 'ลบบัญชีผู้ใช้' : 'Delete Account') }}
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
    </template>
  </div>
</template>

<script setup lang="ts">
import { formatBytes, formatCurrency } from '~/utils/format'
import type { PaymentTransaction } from '~/composables/useBilling'

definePageMeta({ middleware: 'auth' })

const config = useRuntimeConfig()
const router = useRouter()
const { user, fetchMe, refreshMe, getToken, clearToken, resendVerification } = useAuth()
const { success, error: toastError } = useToast()
const { open: openLogoutModal } = useLogoutModal()
const { listPublicPlans, createCheckout, cancelSubscription, listMyPayments, toPlanDisplayName } = useBilling()
const { t, locale } = useI18n()

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
  htmlAttrs: {
    lang: computed(() => locale.value)
  },
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
  if (status === 'paid') return 'border-emerald-200 bg-emerald-50 text-emerald-700'
  if (status === 'pending') return 'border-zinc-200 bg-zinc-100 text-zinc-700'
  return 'border-red-200 bg-red-50 text-red-700'
}

const pageLoading = ref(true)
const activeTab = ref<'profile' | 'security' | 'plan' | 'danger'>('profile')

const tabs = computed(() => [
  { id: 'profile' as const, label: t('settings.tabs.profile'), icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>' },
  { id: 'security' as const, label: t('settings.tabs.security'), icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>' },
  { id: 'plan' as const, label: t('settings.tabs.plan'), icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>' },
  { id: 'danger' as const, label: locale.value === 'th' ? 'จัดการบัญชีและลบข้อมูล' : 'Danger zone', icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>' },
])

let quotaPollTimer: ReturnType<typeof setInterval> | null = null

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

  // Load quota, plan tiers, and payment history immediately
  void fetchQuota()
  void fetchPublicPlans()
  void fetchMyPayments()

  // Real-time 3-second quota polling
  quotaPollTimer = setInterval(() => {
    void fetchQuota()
  }, 3000)
})

onUnmounted(() => {
  if (quotaPollTimer) clearInterval(quotaPollTimer)
})

watch(activeTab, (newTab) => {
  if (newTab === 'plan') {
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
    Free:       { class: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
    Basic:      { class: 'bg-amber-50 text-amber-700 border-amber-200',    dot: 'bg-amber-500' },
    Pro:        { class: 'bg-zinc-100 text-zinc-800 border-zinc-300',      dot: 'bg-zinc-800' },
    Enterprise: { class: 'bg-red-50 text-red-700 border-red-200',          dot: 'bg-red-500' },
  }
  return map[user.value?.plan ?? 'Free'] ?? map['Free']!
})

const profileForm = reactive({ username: '', email: '' })
const profileSaving = ref(false)
const profileSaved = ref(false)
const profileError = ref('')
const editProfileModalOpen = ref(false)

const profileDirty = computed(() =>
  profileForm.username !== (user.value?.username ?? '') ||
  profileForm.email !== (user.value?.email ?? ''),
)

function openEditProfileModal() {
  if (user.value) {
    profileForm.username = user.value.username ?? ''
    profileForm.email = user.value.email ?? ''
  }
  editProfileModalOpen.value = true
}

function closeEditProfileModal() {
  if (profileSaving.value) return
  editProfileModalOpen.value = false
}

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
    success(locale.value === 'th' ? 'อัปเดตข้อมูลส่วนตัวเรียบร้อยแล้ว' : 'Profile updated successfully')
    closeEditProfileModal()
  } catch (err: unknown) {
    const msg = (err as { data?: { message?: string } })?.data?.message
    profileError.value = msg ?? (locale.value === 'th' ? 'ไม่สามารถบันทึกข้อมูลได้' : 'Failed to save. Please try again.')
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
const changePasswordModalOpen = ref(false)

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
const pwStrengthColor = computed(() => ['bg-red-500','bg-amber-500','bg-yellow-500','bg-emerald-500'][Math.max(pwStrength.value - 1, 0)])
const pwStrengthTextColor = computed(() => ['text-red-600','text-amber-600','text-yellow-600','text-emerald-600'][Math.max(pwStrength.value - 1, 0)])
const pwStrengthLabel = computed(() => {
  const isTh = locale.value === 'th'
  const labels = isTh ? ['อ่อนมาก', 'พอใช้', 'ดี', 'แข็งแกร่ง'] : ['Weak', 'Fair', 'Good', 'Strong']
  return labels[Math.max(pwStrength.value - 1, 0)]
})

function openChangePasswordModal() {
  pwForm.current = ''
  pwForm.newPwd = ''
  pwForm.confirm = ''
  changePasswordModalOpen.value = true
}

function closeChangePasswordModal() {
  if (pwSaving.value) return
  changePasswordModalOpen.value = false
}

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
    success(locale.value === 'th' ? 'อัปเดตรหัสผ่านเรียบร้อยแล้ว' : 'Password updated successfully')
    closeChangePasswordModal()
  } catch (err: unknown) {
    const body = (err as { data?: { message?: string; data?: { error?: string } } })?.data
    const msg = body?.data?.error === 'current_password_incorrect'
      ? (locale.value === 'th' ? 'รหัสผ่านปัจจุบันไม่ถูกต้อง' : 'Current password is incorrect.')
      : (body?.message ?? (locale.value === 'th' ? 'ไม่สามารถเปลี่ยนรหัสผ่านได้' : 'Failed to change password.'))
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
    clearToken()
    closeDeleteModal()
    success(locale.value === 'th' ? 'ลบบัญชีผู้ใช้งานเรียบร้อยแล้ว' : 'Account deleted successfully')
    router.replace('/auth/login')
  } catch (err: unknown) {
    const msg = (err as { data?: { message?: string } })?.data?.message ?? (locale.value === 'th' ? 'ไม่สามารถลบบัญชีได้' : 'Failed to delete account.')
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
  total_views?: number
}

const quota = ref<QuotaData | null>(null)
const plansLoading = ref(false)
const plansLoaded = ref(false)

const publicPlans = ref<PublicPlanSetting[]>([])

const defaultPlanSettings: PublicPlanSetting[] = [
  { plan_key: 'free', display_name: 'Free', monthly_price_thb: 0, storage_limit_bytes: 1 * 1024 * 1024 * 1024, image_limit: 100, max_upload_mb: 5, watermark_removal: false, api_access: false, is_enabled: true, allow_private: false, custom_domain: false, priority_support: false, no_ads: false },
  { plan_key: 'basic', display_name: 'Basic', monthly_price_thb: 19, storage_limit_bytes: 10 * 1024 * 1024 * 1024, image_limit: 1000, max_upload_mb: 15, watermark_removal: true, api_access: false, is_enabled: true, allow_private: false, custom_domain: false, priority_support: false, no_ads: true },
  { plan_key: 'pro', display_name: 'Pro', monthly_price_thb: 190, storage_limit_bytes: 100 * 1024 * 1024 * 1024, image_limit: 10000, max_upload_mb: 50, watermark_removal: true, api_access: true, is_enabled: true, allow_private: true, custom_domain: true, priority_support: true, no_ads: true },
]

async function fetchQuota() {
  try {
    const res = await apiFetch<{ data: any }>('/auth/quota')
    quota.value = res.data
  } catch {
    // ignore
  }
}

async function fetchPublicPlans() {
  plansLoading.value = true
  try {
    const plans = await listPublicPlans()
    publicPlans.value = plans.length > 0 ? plans : defaultPlanSettings
  } catch {
    publicPlans.value = defaultPlanSettings
  } finally {
    plansLoaded.value = true
    plansLoading.value = false
  }
}

const storagePercent = computed(() => {
  if (!quota.value || quota.value.storage_limit_bytes <= 0) return 0
  return Math.min(Math.round((quota.value.used_storage_bytes / quota.value.storage_limit_bytes) * 100), 100)
})

const imagePercent = computed(() => {
  if (!quota.value || quota.value.max_images <= 0) return 0
  return Math.min(Math.round((quota.value.image_count / quota.value.max_images) * 100), 100)
})

const planTiers = computed(() => {
  const isTh = locale.value === 'th'
  return publicPlans.value
    .filter((p) => p.is_enabled)
    .sort((a, b) => a.monthly_price_thb - b.monthly_price_thb)
    .map((p) => {
      const isFree = p.monthly_price_thb <= 0
      const features = [
        isTh ? `พื้นที่จัดเก็บสูงสุด ${formatBytes(p.storage_limit_bytes)}` : `Up to ${formatBytes(p.storage_limit_bytes)} storage`,
        isTh ? `ขนาดไฟล์สูงสุด ${p.max_upload_mb} MB` : `Max file size ${p.max_upload_mb} MB`,
      ]
      if (p.watermark_removal) features.push(isTh ? 'ไม่มีลายน้ำ' : 'No watermark')
      if (p.api_access) features.push(isTh ? 'สิทธิ์เชื่อมต่อ API' : 'API access')

      let desc = isTh ? 'พื้นที่สำหรับใช้งานทั่วไป' : 'Free storage for general use'
      if (p.plan_key === 'basic') desc = isTh ? 'พื้นที่เพิ่มเติมสำหรับเก็บรูปภาพ' : 'Essential storage with no watermarks'
      if (p.plan_key === 'pro') desc = isTh ? 'สิทธิ์ครบถ้วนสำหรับการทำงานระดับโปร' : 'Full access with high limits and API'

      return {
        key: p.plan_key,
        name: p.display_name,
        monthlyPrice: p.monthly_price_thb,
        priceLabel: isFree ? (isTh ? 'ฟรี' : 'Free') : `฿${p.monthly_price_thb.toLocaleString()}`,
        desc,
        features,
      }
    })
})

function startCheckout(planKey: string) {
  router.push(`/billing/checkout/${planKey}`)
}

const cancelMonth = ref(String(new Date().getMonth() + 1))
const cancelYear = ref(String(new Date().getFullYear()))
const cancelLoading = ref(false)

const cancelMonthOptions = [
  { value: '1', label: '01 - Jan' },
  { value: '2', label: '02 - Feb' },
  { value: '3', label: '03 - Mar' },
  { value: '4', label: '04 - Apr' },
  { value: '5', label: '05 - May' },
  { value: '6', label: '06 - Jun' },
  { value: '7', label: '07 - Jul' },
  { value: '8', label: '08 - Aug' },
  { value: '9', label: '09 - Sep' },
  { value: '10', label: '10 - Oct' },
  { value: '11', label: '11 - Nov' },
  { value: '12', label: '12 - Dec' },
]

const cancelYearOptions = computed(() => {
  const current = new Date().getFullYear()
  return [current, current + 1, current + 2]
})

const cancelMonthLabel = computed(() => {
  const found = cancelMonthOptions.find((m) => m.value === cancelMonth.value)
  return found ? found.label.split(' - ')[1] : cancelMonth.value
})

async function handleCancelSubscription() {
  cancelLoading.value = true
  try {
    const month = parseInt(cancelMonth.value, 10)
    const year = parseInt(cancelYear.value, 10)
    const updatedUser = await cancelSubscription(month, year)
    await refreshMe()
    success(locale.value === 'th' ? `จะยกเลิกการต่ออายุแพ็กเกจในวันที่ ${formatPlanExpiryDate(updatedUser.plan_expires_at)}` : `Subscription will cancel on ${formatPlanExpiryDate(updatedUser.plan_expires_at)}`)
  } catch (err: any) {
    const msg = err?.data?.data?.error || err?.data?.message || (locale.value === 'th' ? 'ไม่สามารถยกเลิกแพ็กเกจได้' : 'Failed to cancel subscription')
    toastError(msg)
  } finally {
    cancelLoading.value = false
  }
}

function formatPlanExpiryDate(isoStr: string | null | undefined): string {
  if (!isoStr) return '-'
  return new Date(isoStr).toLocaleDateString(locale.value === 'th' ? 'th-TH' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>
