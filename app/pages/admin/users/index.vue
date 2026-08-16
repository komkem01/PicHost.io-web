<template>
  <div class="p-8 w-full">

    <div class="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 class="text-[24px] font-bold tracking-tight text-zinc-900">{{ $t('admin.users.title') }}</h2>
        <p class="text-[12.5px] text-zinc-500 mt-1">{{ $t('admin.users.subtitle') }}</p>
      </div>
      <div v-if="!loading && !error" class="flex items-center gap-2 text-[12.5px]">
        <span class="tabular-nums font-semibold text-zinc-700 bg-white border border-zinc-200 shadow-xs rounded-xl px-3 py-1.5">
          {{ filtered.length.toLocaleString() }} visible
        </span>
        <span class="tabular-nums font-semibold text-zinc-500 bg-zinc-100 border border-zinc-200 rounded-xl px-3 py-1.5">
          {{ users.length.toLocaleString() }} total
        </span>
      </div>
    </div>

    <div v-if="!loading && !error" class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
      <div class="rounded-2xl border border-emerald-200 bg-emerald-50/60 px-4 py-3.5">
        <p class="text-[10.5px] uppercase tracking-widest text-emerald-800/70 font-semibold mb-1">Active</p>
        <p class="text-[24px] leading-none font-bold tabular-nums text-emerald-700">{{ activeCount.toLocaleString() }}</p>
      </div>
      <div class="rounded-2xl border border-red-200 bg-red-50/60 px-4 py-3.5">
        <p class="text-[10.5px] uppercase tracking-widest text-red-800/70 font-semibold mb-1">Inactive</p>
        <p class="text-[24px] leading-none font-bold tabular-nums text-red-700">{{ inactiveCount.toLocaleString() }}</p>
      </div>
      <div class="rounded-2xl border border-amber-200 bg-amber-50/60 px-4 py-3.5">
        <p class="text-[10.5px] uppercase tracking-widest text-amber-800/70 font-semibold mb-1">Guests</p>
        <p class="text-[24px] leading-none font-bold tabular-nums text-amber-700">{{ guestCount.toLocaleString() }}</p>
      </div>
    </div>

    <div class="rounded-2xl border border-zinc-200 bg-white shadow-card p-3.5 mb-4">
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div class="relative flex-1 min-w-[200px]">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0Z"/>
          </svg>
          <input
            v-model="search"
            type="search"
            :placeholder="$t('admin.users.searchPlaceholder')"
            class="w-full bg-white border border-zinc-200 rounded-xl pl-9 pr-4 py-2 text-[13px] text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-400 transition-colors h-10 shadow-xs"
          />
        </div>
        <div class="w-full sm:w-48">
          <AppSelect
            v-model="filterPlan"
            :options="planOptions"
          />
        </div>
        <div class="w-full sm:w-48">
          <AppSelect
            v-model="filterStatus"
            :options="statusOptions"
          />
        </div>
        <button
          v-if="search || filterPlan || filterStatus"
          @click="clearFilters"
          class="h-10 px-3.5 rounded-xl border border-zinc-200 bg-white text-[12.5px] text-zinc-600 hover:bg-zinc-50 transition-colors shadow-xs"
        >
          {{ $t('admin.users.clearFilters') }}
        </button>
      </div>
    </div>

    <div class="rounded-2xl border border-zinc-200 bg-white shadow-card overflow-hidden">

      <!-- Loading skeleton -->
      <template v-if="loading">
        <div class="border-b border-zinc-200 px-5 py-3 grid grid-cols-[2fr_1fr_1fr_1fr_1fr_40px] gap-4 bg-zinc-50">
          <div v-for="i in 6" :key="i" class="h-3.5 rounded-full bg-zinc-200 animate-pulse" />
        </div>
        <div
          v-for="i in 8"
          :key="i"
          class="border-b border-zinc-200 last:border-0 px-5 py-4 grid grid-cols-[2fr_1fr_1fr_1fr_1fr_40px] gap-4 items-center"
        >
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-xl bg-zinc-200 animate-pulse shrink-0" />
            <div class="space-y-1.5 flex-1">
              <div class="h-3 rounded-full bg-zinc-200 animate-pulse w-3/4" />
              <div class="h-2.5 rounded-full bg-zinc-100 animate-pulse w-1/2" />
            </div>
          </div>
          <div v-for="j in 5" :key="j" class="h-3 rounded-full bg-zinc-200 animate-pulse" />
        </div>
      </template>

      <!-- Error -->
      <div v-else-if="error" class="p-8 text-center text-red-700 text-[13px] bg-red-50">{{ error }}</div>

      <!-- Empty -->
      <div v-else-if="filtered.length === 0" class="p-12 text-center">
        <p class="text-[13px] text-zinc-400">No users match your filters</p>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
      <table class="w-full text-[13px] min-w-[900px]">
        <thead class="bg-zinc-50">
          <tr class="border-b border-zinc-200">
            <th class="text-left px-5 py-3.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">User</th>
            <th class="text-left px-4 py-3.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">Plan</th>
            <th class="text-left px-4 py-3.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">Storage</th>
            <th class="text-left px-4 py-3.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">Status</th>
            <th class="text-left px-4 py-3.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">Joined</th>
            <th class="text-right px-5 py-3.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="u in paginated"
            :key="u.id"
            @click="navigateTo(`/admin/users/${u.id}`)"
            class="border-b border-zinc-200/60 last:border-0 hover:bg-zinc-50/80 cursor-pointer transition-colors group"
          >
            <!-- User -->
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-zinc-900 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                  {{ (u.username || u.email || 'U').slice(0, 2).toUpperCase() }}
                </div>
                <div class="min-w-0">
                  <p class="font-semibold text-zinc-900 truncate leading-tight">{{ u.username || '—' }}</p>
                  <p class="text-[11.5px] text-zinc-400 truncate">{{ u.email }}</p>
                </div>
              </div>
            </td>
            <!-- Plan -->
            <td class="px-4 py-3.5">
              <span
                class="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border capitalize"
                :class="planClass(u.plan)"
              >
                {{ u.plan || 'Free' }}
              </span>
            </td>
            <!-- Storage -->
            <td class="px-4 py-3.5 text-zinc-600 tabular-nums text-[12.5px]">{{ formatBytes(u.used_storage_bytes) }}</td>
            <!-- Status -->
            <td class="px-4 py-3.5">
              <span v-if="u.is_guest" class="inline-flex items-center gap-1.5 text-[12px] text-amber-700 font-medium">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-500" />Guest
              </span>
              <span v-else-if="u.is_active" class="inline-flex items-center gap-1.5 text-[12px] text-emerald-700 font-medium">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500" />Active
              </span>
              <span v-else class="inline-flex items-center gap-1.5 text-[12px] text-red-700 font-medium">
                <span class="w-1.5 h-1.5 rounded-full bg-red-500" />Inactive
              </span>
            </td>
            <!-- Joined -->
            <td class="px-4 py-3.5 text-zinc-500 text-[12px] tabular-nums">{{ formatDate(u.created_at) }}</td>
            <!-- Actions -->
            <td class="px-5 py-3.5 text-right whitespace-nowrap">
              <div class="inline-flex items-center justify-end gap-1.5" @click.stop>
                <button
                  type="button"
                  @click.stop="openUserModal(u, 'view')"
                  class="h-8 px-2.5 inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-[12px] font-medium text-zinc-700 transition-colors shadow-2xs"
                  :title="$t('common.viewDetails')"
                >
                  <svg class="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.573 16.49 16.638 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  <span>{{ $t('common.viewDetails') }}</span>
                </button>
                <button
                  type="button"
                  @click.stop="openUserModal(u, 'edit')"
                  class="h-8 px-2.5 inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/60 text-[12px] font-medium text-blue-700 transition-colors shadow-2xs"
                  :title="$t('common.edit')"
                >
                  <svg class="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                  <span>{{ $t('common.edit') }}</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      </div>

      <!-- Pagination -->
      <AppPagination
        v-model:page="currentPage"
        :total="filtered.length"
        :limit="pageSize"
      />
    </div>

    <!-- User Detail & Edit Modal -->
    <Teleport to="body">
      <div
        v-if="editingUser"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs"
        @click.self="closeUserModal"
      >
        <div class="w-full max-w-lg rounded-2xl bg-white border border-zinc-200 p-6 shadow-modal space-y-5">
          <!-- Header -->
          <div class="flex items-center justify-between border-b border-zinc-200 pb-3.5">
            <div>
              <h3 class="text-base font-bold text-zinc-900 flex items-center gap-2">
                <svg v-if="userModalTab === 'view'" class="w-4.5 h-4.5 text-zinc-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.573 16.49 16.638 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                <svg v-else class="w-4.5 h-4.5 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
                <span>{{ userModalTab === 'view' ? 'รายละเอียดผู้ใช้งาน' : 'แก้ไขข้อมูลผู้ใช้งาน' }}</span>
              </h3>
              <p class="text-xs text-zinc-500 mt-0.5 font-mono">ID: {{ editingUser.id }}</p>
            </div>

            <!-- Top Right Action Controls: Toggle Mode + Close -->
            <div class="flex items-center gap-2">
              <button
                type="button"
                @click="userModalTab = userModalTab === 'view' ? 'edit' : 'view'"
                class="h-8 px-3 rounded-xl border text-[12px] font-semibold inline-flex items-center gap-1.5 transition-all shadow-2xs"
                :class="userModalTab === 'view'
                  ? 'border-blue-200 bg-blue-50/70 text-blue-700 hover:bg-blue-100'
                  : 'border-zinc-200 bg-zinc-100 text-zinc-700 hover:bg-zinc-200'"
              >
                <template v-if="userModalTab === 'view'">
                  <svg class="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                  <span>{{ $t('common.edit') }}</span>
                </template>
                <template v-else>
                  <svg class="w-3.5 h-3.5 text-zinc-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.573 16.49 16.638 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  <span>{{ $t('common.viewDetails') }}</span>
                </template>
              </button>
              <button @click="closeUserModal" class="text-zinc-400 hover:text-zinc-700 text-lg leading-none p-1">&times;</button>
            </div>
          </div>

          <!-- Body View Mode -->
          <div v-if="userModalTab === 'view'" class="space-y-4 text-xs">
            <div class="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-zinc-900 text-white font-bold text-sm flex items-center justify-center shrink-0">
                  {{ (editingUser.username || editingUser.email || 'U').slice(0, 2).toUpperCase() }}
                </div>
                <div>
                  <p class="font-bold text-zinc-900 text-sm leading-tight">{{ editingUser.username || '—' }}</p>
                  <p class="text-zinc-500 text-xs">{{ editingUser.email }}</p>
                </div>
              </div>
              <span class="px-2.5 py-1 rounded-full text-xs font-semibold border capitalize" :class="planClass(editingUser.plan)">
                {{ editingUser.plan || 'Free' }}
              </span>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="p-3.5 rounded-xl border border-zinc-200 bg-white shadow-2xs space-y-1">
                <p class="text-zinc-400 font-semibold text-[10.5px] uppercase tracking-wider">สถานะบัญชี</p>
                <p class="font-semibold text-xs flex items-center gap-1.5" :class="editingUser.is_active ? 'text-emerald-700' : 'text-red-700'">
                  <span class="w-1.5 h-1.5 rounded-full" :class="editingUser.is_active ? 'bg-emerald-500' : 'bg-red-500'" />
                  {{ editingUser.is_active ? 'Active' : 'Inactive' }}
                </p>
              </div>
              <div class="p-3.5 rounded-xl border border-zinc-200 bg-white shadow-2xs space-y-1">
                <p class="text-zinc-400 font-semibold text-[10.5px] uppercase tracking-wider">สิทธิ์การใช้งาน</p>
                <p class="font-semibold text-xs text-zinc-800">
                  {{ editingUser.is_admin ? 'Administrator' : 'Standard User' }}
                </p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="p-3.5 rounded-xl border border-zinc-200 bg-white shadow-2xs space-y-1">
                <p class="text-zinc-400 font-semibold text-[10.5px] uppercase tracking-wider">พื้นที่ใช้งาน</p>
                <p class="font-bold text-zinc-900 tabular-nums text-xs">{{ formatBytes(editingUser.used_storage_bytes ?? 0) }}</p>
              </div>
              <div class="p-3.5 rounded-xl border border-zinc-200 bg-white shadow-2xs space-y-1">
                <p class="text-zinc-400 font-semibold text-[10.5px] uppercase tracking-wider">วันที่สมัครสมาชิก</p>
                <p class="font-medium text-zinc-700 tabular-nums text-xs">{{ formatDate(editingUser.created_at) }}</p>
              </div>
            </div>
          </div>

          <!-- Body Edit Mode -->
          <div v-else class="space-y-4 text-xs">
            <div>
              <label class="block font-medium text-zinc-700 mb-1">ชื่อผู้ใช้ (Username)</label>
              <input
                v-model="editForm.username"
                type="text"
                class="w-full h-10 px-3.5 rounded-xl border border-zinc-200 text-zinc-900 outline-none focus:border-zinc-400 shadow-xs"
                placeholder="username"
              />
            </div>

            <div>
              <label class="block font-medium text-zinc-700 mb-1">อีเมล (Email)</label>
              <input
                v-model="editForm.email"
                type="email"
                class="w-full h-10 px-3.5 rounded-xl border border-zinc-200 text-zinc-900 outline-none focus:border-zinc-400 shadow-xs"
                placeholder="user@example.com"
              />
            </div>

            <div>
              <label class="block font-medium text-zinc-700 mb-1">แพ็กเกจ (Plan)</label>
              <AppSelect
                v-model="editForm.plan"
                :options="editPlanSelectOptions"
              />
            </div>

            <div class="grid grid-cols-2 gap-3 pt-1">
              <div class="p-3 rounded-xl border border-zinc-200 bg-zinc-50/50 flex items-center justify-between">
                <div>
                  <p class="font-semibold text-zinc-900">สถานะใช้งาน</p>
                  <p class="text-[11px] text-zinc-500">Active / Suspended</p>
                </div>
                <button
                  type="button"
                  @click="editForm.isActive = !editForm.isActive"
                  class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                  :class="editForm.isActive ? 'bg-emerald-600' : 'bg-zinc-300'"
                >
                  <span class="inline-block h-4 w-4 rounded-full bg-white shadow transition-transform" :class="editForm.isActive ? 'translate-x-6' : 'translate-x-1'" />
                </button>
              </div>

              <div class="p-3 rounded-xl border border-zinc-200 bg-zinc-50/50 flex items-center justify-between">
                <div>
                  <p class="font-semibold text-zinc-900">สิทธิ์ Admin</p>
                  <p class="text-[11px] text-zinc-500">Administrator</p>
                </div>
                <button
                  type="button"
                  @click="editForm.isAdmin = !editForm.isAdmin"
                  class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                  :class="editForm.isAdmin ? 'bg-purple-600' : 'bg-zinc-300'"
                >
                  <span class="inline-block h-4 w-4 rounded-full bg-white shadow transition-transform" :class="editForm.isAdmin ? 'translate-x-6' : 'translate-x-1'" />
                </button>
              </div>
            </div>

            <div v-if="editError" class="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              {{ editError }}
            </div>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-end gap-2.5 pt-2 border-t border-zinc-200">
            <button
              @click="closeUserModal"
              type="button"
              class="h-9 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-medium transition-colors"
            >
              {{ $t('common.close') || 'ปิด' }}
            </button>
            <button
              v-if="userModalTab === 'edit'"
              @click="saveEditUser"
              :disabled="editSaving"
              type="button"
              class="h-9 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold disabled:opacity-40 transition-colors shadow-xs flex items-center gap-2"
            >
              <svg v-if="editSaving" class="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              <span>{{ editSaving ? $t('common.loading') : $t('common.save') }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

import type { AdminUser } from '~/composables/useAdmin'

const { listUsers, getStats, setUserPlan, setUserActive, setUserAdmin, updateUserProfile } = useAdmin()
const toast = useToast()

const users = ref<AdminUser[]>([])
const guestCountValue = ref(0)
const loading = ref(true)
const error = ref('')
const search = ref('')
const filterPlan = ref('')
const filterStatus = ref('')

const { t } = useI18n()

const plans = ['Free', 'Basic', 'Pro']

const planOptions = computed(() => [
  { label: t('admin.users.allPlans'), value: '' },
  ...plans.map(p => ({ label: p, value: p }))
])

const statusOptions = computed(() => [
  { label: t('admin.users.allStatuses'), value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Guest', value: 'guest' },
])

onMounted(async () => {
  try {
    const [usersRes, statsRes] = await Promise.all([listUsers(), getStats()])
    users.value = usersRes
    guestCountValue.value = statsRes.guest_users
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Failed to load users'
  } finally {
    loading.value = false
  }
})

const currentPage = ref(1)
const pageSize = 8

watch([search, filterPlan, filterStatus], () => { currentPage.value = 1 })

const filtered = computed(() => {
  let list = users.value
  const q = search.value.toLowerCase()
  if (q) {
    list = list.filter(u =>
      u.email?.toLowerCase().includes(q) || u.username?.toLowerCase().includes(q)
    )
  }
  if (filterPlan.value) list = list.filter(u => u.plan === filterPlan.value)
  if (filterStatus.value === 'active') list = list.filter(u => u.is_active && !u.is_guest)
  else if (filterStatus.value === 'inactive') list = list.filter(u => !u.is_active && !u.is_guest)
  else if (filterStatus.value === 'guest') list = list.filter(u => u.is_guest)
  return list
})

const totalPages = computed(() => Math.ceil(filtered.value.length / pageSize))

const paginated = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filtered.value.slice(start, start + pageSize)
})

const activeCount = computed(() => users.value.filter((u) => u.is_active && !u.is_guest).length)
const guestCount = computed(() => guestCountValue.value)
const inactiveCount = computed(() => users.value.filter((u) => !u.is_active && !u.is_guest).length)

const pageRange = computed(() => {
  const total = totalPages.value
  const cur = currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | string)[] = [1]
  if (cur > 3) pages.push('...')
  for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) pages.push(i)
  if (cur < total - 2) pages.push('...')
  pages.push(total)
  return pages
})

function clearFilters() {
  search.value = ''
  filterPlan.value = ''
  filterStatus.value = ''
}

function planClass(plan: string) {
  return {
    Free:  'bg-zinc-100 text-zinc-700 border border-zinc-200',
    Basic: 'bg-blue-50 text-blue-700 border border-blue-200',
    Pro:   'bg-purple-50 text-purple-700 border border-purple-200',
  }[plan] ?? 'bg-zinc-100 text-zinc-700 border border-zinc-200'
}

function avatarInitials(u: AdminUser) {
  const name = u.username ?? u.email
  if (!name) return '?'
  return name.slice(0, 2).toUpperCase()
}

const editingUser = ref<AdminUser | null>(null)
const userModalTab = ref<'view' | 'edit'>('view')
const editSaving = ref(false)
const editError = ref('')
const editForm = reactive({
  username: '',
  email: '',
  plan: 'Free',
  isActive: true,
  isAdmin: false,
})

const editPlanSelectOptions = [
  { label: 'Free', value: 'Free' },
  { label: 'Basic', value: 'Basic' },
  { label: 'Pro', value: 'Pro' },
  { label: 'Enterprise', value: 'Enterprise' },
]

function openUserModal(user: AdminUser, mode: 'view' | 'edit' = 'view') {
  editingUser.value = user
  userModalTab.value = mode
  editForm.username = user.username ?? ''
  editForm.email = user.email ?? ''
  editForm.plan = user.plan || 'Free'
  editForm.isActive = user.is_active
  editForm.isAdmin = user.is_admin
  editError.value = ''
}

function closeUserModal() {
  if (editSaving.value) return
  editingUser.value = null
}

async function saveEditUser() {
  if (!editingUser.value) return
  editSaving.value = true
  editError.value = ''

  try {
    const user = editingUser.value
    await Promise.all([
      setUserPlan(user.id, editForm.plan),
      setUserActive(user.id, editForm.isActive),
      setUserAdmin(user.id, editForm.isAdmin),
      updateUserProfile(user.id, { username: editForm.username, email: editForm.email }),
    ])

    user.username = editForm.username
    user.email = editForm.email
    user.plan = editForm.plan
    user.is_active = editForm.isActive
    user.is_admin = editForm.isAdmin

    toast.success('บันทึกการแก้ไขผู้ใช้สำเร็จ')
    editingUser.value = null
  } catch (e: any) {
    editError.value = e?.data?.message || e?.message || 'ไม่สามารถบันทึกข้อมูลได้'
  } finally {
    editSaving.value = false
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>
