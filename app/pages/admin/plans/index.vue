<template>
  <div class="p-8 w-full min-w-0 max-w-full space-y-6">
    <div class="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 class="text-[24px] font-bold tracking-tight text-zinc-900">Plan Management</h2>
        <p class="text-[12.5px] text-zinc-500 mt-1">Manage all plan conditions, limits, pricing, and feature rules</p>
      </div>
      <div v-if="!loading && !error" class="flex items-center gap-2">
        <button
          @click="showCreateModal = true"
          class="px-3.5 py-2 rounded-xl bg-zinc-900 text-[12px] font-semibold text-white hover:bg-zinc-800 transition-colors shadow-xs"
        >
          Add Plan
        </button>
        <span class="tabular-nums text-[12.5px] font-semibold text-zinc-700 bg-zinc-100 border border-zinc-200 rounded-xl px-3 py-1.5">
          {{ planRows.length.toLocaleString() }} plans
        </span>
        <button
          @click="openResetConfirm"
          class="px-3 py-1.5 rounded-xl border border-zinc-200 bg-white text-[12px] text-zinc-600 hover:bg-zinc-50 transition-colors"
        >
          Reset Defaults
        </button>
      </div>
    </div>

    <template v-if="loading">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <div v-for="i in 3" :key="i" class="h-[110px] rounded-2xl border border-zinc-200 bg-zinc-100 animate-pulse" />
      </div>
      <div class="h-[300px] rounded-2xl border border-zinc-200 bg-zinc-100 animate-pulse" />
    </template>

    <div v-else-if="error" class="rounded-2xl border border-red-200 bg-red-50 p-5 text-[13px] text-red-700">
      {{ error }}
    </div>

    <template v-else>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <div class="rounded-2xl border border-zinc-200 bg-white shadow-card px-4 py-4">
          <p class="text-[10.5px] uppercase tracking-widest text-zinc-400 font-semibold mb-1">Total Users</p>
          <p class="text-[28px] font-bold tabular-nums text-zinc-900 leading-none">{{ totalUsers.toLocaleString() }}</p>
        </div>
        <div class="rounded-2xl border border-emerald-200 bg-emerald-50/60 shadow-card px-4 py-4">
          <p class="text-[10.5px] uppercase tracking-widest text-emerald-800/70 font-semibold mb-1">Overall Active Rate</p>
          <p class="text-[28px] font-bold tabular-nums text-emerald-700 leading-none">{{ activeRate }}%</p>
        </div>
        <div class="rounded-2xl border border-blue-200 bg-blue-50/60 shadow-card px-4 py-4">
          <p class="text-[10.5px] uppercase tracking-widest text-blue-800/70 font-semibold mb-1">Total Storage</p>
          <p class="text-[28px] font-bold tabular-nums text-blue-700 leading-none">{{ formatBytes(totalStorage) }}</p>
        </div>
      </div>

      <div class="rounded-2xl border border-zinc-200 bg-white shadow-card overflow-hidden min-w-0 max-w-full">
        <div class="px-5 py-4 border-b border-zinc-200 flex items-center justify-between">
          <p class="text-[13px] font-semibold text-zinc-900">Plan Overview</p>
          <p class="text-[11.5px] text-zinc-500">Click a row to manage plan conditions</p>
        </div>

        <div class="overflow-x-auto min-w-0 max-w-full">
          <table class="w-full text-[12.5px] min-w-[840px]">
            <thead class="bg-zinc-50">
              <tr class="border-b border-zinc-200">
                <th class="text-left px-4 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">Plan</th>
                <th class="text-left px-3 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">Price / mo</th>
                <th class="text-left px-3 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">Storage Limit</th>
                <th class="text-left px-3 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">Image Limit</th>
                <th class="text-left px-3 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">Status</th>
                <th class="text-left px-3 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">Users</th>
                <th class="text-left px-3 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">Active</th>
                <th class="text-left px-3 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">Guests</th>
                <th class="text-left px-3 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">Storage</th>
                <th class="text-left px-3 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">Share</th>
                <th class="text-right px-4 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in planRows"
                :key="row.key"
                class="group border-b border-zinc-200 last:border-0 hover:bg-zinc-50/80 transition-colors cursor-pointer"
                @click="goPlan(row.key)"
              >
                <td class="px-4 py-3">
                  <span class="inline-flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full shrink-0" :class="row.dotClass" />
                    <span class="font-semibold text-zinc-900">{{ row.name }}</span>
                  </span>
                </td>
                <td class="px-3 py-3 tabular-nums text-zinc-900 font-semibold">{{ formatPrice(row.price) }}</td>
                <td class="px-3 py-3 tabular-nums text-zinc-600">{{ formatBytes(row.storageLimitBytes) }}</td>
                <td class="px-3 py-3 tabular-nums text-zinc-600">{{ row.imageLimit.toLocaleString() }}</td>
                <td class="px-3 py-3">
                  <div class="flex items-center gap-1.5">
                    <button
                      @click.stop="togglePlan(row.key, row.isEnabled, row.users)"
                      class="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors"
                      :class="row.isEnabled ? 'bg-emerald-600' : 'bg-zinc-300'"
                      :disabled="!!savingPlanKeys[row.key]"
                      :aria-disabled="!!savingPlanKeys[row.key]"
                      :aria-busy="!!savingPlanKeys[row.key]"
                      :title="row.isEnabled && row.users > 0 ? 'ไม่สามารถปิดแพ็กเกจที่มีผู้ใช้งานอยู่ได้' : (row.isEnabled ? 'ปิดการสมัครแพ็กเกจ' : 'เปิดการสมัครแพ็กเกจ')"
                    >
                      <span class="inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform" :class="row.isEnabled ? 'translate-x-4' : 'translate-x-1'" />
                    </button>
                    <span class="text-[11px] font-semibold" :class="row.isEnabled ? 'text-emerald-700' : 'text-zinc-400'">
                      {{ row.isEnabled ? 'Open' : 'Closed' }}
                    </span>
                  </div>
                </td>
                <td class="px-3 py-3 tabular-nums text-zinc-900 font-medium">{{ row.users.toLocaleString() }}</td>
                <td class="px-3 py-3 tabular-nums text-emerald-700 font-medium">{{ row.active.toLocaleString() }}</td>
                <td class="px-3 py-3 tabular-nums text-amber-700 font-medium">{{ row.guests.toLocaleString() }}</td>
                <td class="px-3 py-3 tabular-nums text-zinc-700 font-medium">{{ formatBytes(row.storage) }}</td>
                <td class="px-3 py-3">
                  <div class="w-[100px]">
                    <div class="h-1.5 rounded-full bg-zinc-200 overflow-hidden">
                      <div class="h-full rounded-full" :class="row.barClass" :style="{ width: row.share + '%' }" />
                    </div>
                    <p class="text-[11px] text-zinc-500 mt-0.5 tabular-nums">{{ row.share }}%</p>
                  </div>
                </td>
                <td class="px-4 py-3 text-right whitespace-nowrap">
                  <div class="inline-flex items-center justify-end gap-1.5" @click.stop>
                    <button
                      type="button"
                      @click.stop="openPlanModal(row, 'view')"
                      class="h-8 px-2.5 inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-[12px] font-medium text-zinc-700 transition-colors shadow-2xs"
                      :title="$t('common.viewDetails')"
                    >
                      <svg class="w-3.5 h-3.5 text-zinc-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.573 16.49 16.638 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                      <span class="hidden xl:inline">{{ $t('common.viewDetails') }}</span>
                    </button>
                    <button
                      type="button"
                      @click.stop="openPlanModal(row, 'edit')"
                      class="h-8 px-2.5 inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/60 text-[12px] font-medium text-blue-700 transition-colors shadow-2xs"
                      :title="$t('common.edit')"
                    >
                      <svg class="w-3.5 h-3.5 text-blue-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                      <span class="hidden xl:inline">{{ $t('common.edit') }}</span>
                    </button>
                    <button
                      @click.stop="openDeleteConfirm(row)"
                      :disabled="!!savingPlanKeys[row.key]"
                      class="h-8 px-2.5 inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/50 hover:bg-red-100/60 text-[12px] font-medium text-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs"
                      :title="$t('common.delete')"
                    >
                      <svg class="w-3.5 h-3.5 text-red-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                      </svg>
                      <span class="hidden xl:inline">{{ $t('common.delete') }}</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <Teleport to="body">
        <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-zinc-900/40 backdrop-blur-xs" @click="showCreateModal = false" />
          <div class="relative w-full max-w-[420px] rounded-2xl border border-zinc-200 bg-white shadow-modal p-6">
            <h3 class="text-[16px] font-semibold text-zinc-900 mb-3">Create Plan</h3>
            <div class="space-y-3">
              <div>
                <label class="block text-[11.5px] text-zinc-700 font-medium mb-1.5">Plan Key</label>
                <input v-model="createForm.key" type="text" placeholder="example: starter" class="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-[13px] text-zinc-900 outline-none focus:border-zinc-400" />
              </div>
              <div>
                <label class="block text-[11.5px] text-zinc-700 font-medium mb-1.5">Display Name</label>
                <input v-model="createForm.name" type="text" placeholder="Starter" class="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-[13px] text-zinc-900 outline-none focus:border-zinc-400" />
              </div>
            </div>
            <div class="mt-5 flex items-center justify-end gap-2">
              <button @click="showCreateModal = false" class="px-3.5 py-2 rounded-xl border border-zinc-200 bg-white text-[12.5px] text-zinc-600 hover:bg-zinc-50 transition-colors font-medium">Cancel</button>
              <button @click="createPlan" :disabled="creating" class="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-[12.5px] text-white font-semibold transition-colors">
                {{ creating ? 'Creating...' : 'Create' }}
              </button>
            </div>
          </div>
        </div>
      </Teleport>

      <Teleport to="body">
        <Transition
          enter-from-class="opacity-0"
          enter-active-class="transition duration-150"
          leave-to-class="opacity-0"
          leave-active-class="transition duration-100"
        >
          <div
            v-if="showDeleteModal && planToDelete"
            class="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs"
            @click.self="showDeleteModal = false"
          >
            <Transition
              enter-from-class="opacity-0 scale-95 -translate-y-1"
              enter-active-class="transition duration-150"
              leave-to-class="opacity-0 scale-95"
              leave-active-class="transition duration-100"
              appear
            >
              <div
                v-if="showDeleteModal && planToDelete"
                class="relative w-full max-w-[380px] rounded-2xl border border-zinc-200 bg-white shadow-modal p-6"
              >
                <!-- If has users -->
                <template v-if="planToDelete.users > 0">
                  <!-- Warning/Block Icon -->
                  <div class="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-4">
                    <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                  </div>

                  <h3 class="text-zinc-900 font-semibold text-[15px] mb-2">Cannot Delete Plan</h3>
                  <p class="text-zinc-600 text-[13px] leading-relaxed mb-6">
                    The plan <span class="text-zinc-900 font-semibold">"{{ planToDelete.name }}"</span> cannot be deleted because it is currently active with <span class="text-amber-700 font-semibold tabular-nums">{{ planToDelete.users }}</span> user(s).
                    <br /><span class="text-zinc-400 text-[12px] mt-1 block">Please reassign all users to another plan first.</span>
                  </p>

                  <div class="flex">
                    <button
                      @click="showDeleteModal = false"
                      class="flex-1 py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-[13px] font-medium transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </template>

                <!-- If has no users (can delete) -->
                <template v-else>
                  <!-- Danger/Trash Icon -->
                  <div class="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center mb-4">
                    <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                    </svg>
                  </div>

                  <h3 class="text-zinc-900 font-semibold text-[15px] mb-2">Delete Plan?</h3>
                  <p class="text-zinc-600 text-[13px] leading-relaxed mb-6">
                    Are you sure you want to delete the plan <span class="text-zinc-900 font-semibold">"{{ planToDelete.name }}"</span>? This action is permanent and cannot be undone.
                  </p>

                  <div class="flex gap-3">
                    <button
                      @click="showDeleteModal = false"
                      class="flex-1 py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-[13px] font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      @click="deletePlan(planToDelete.key)"
                      :disabled="savingPlanKeys[planToDelete.key]"
                      class="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-[13px] font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <svg v-if="savingPlanKeys[planToDelete.key]" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                      </svg>
                      Delete
                    </button>
                  </div>
                </template>
              </div>
            </Transition>
          </div>
        </Transition>
      </Teleport>

      <!-- Reset Defaults Confirmation Modal -->
      <Teleport to="body">
        <Transition
          enter-from-class="opacity-0"
          enter-active-class="transition duration-150"
          leave-to-class="opacity-0"
          leave-active-class="transition duration-100"
        >
          <div
            v-if="showResetModal"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs"
            @click.self="showResetModal = false"
          >
            <Transition
              enter-from-class="opacity-0 scale-95 -translate-y-1"
              enter-active-class="transition duration-150"
              leave-to-class="opacity-0 scale-95"
              leave-active-class="transition duration-100"
              appear
            >
              <div
                v-if="showResetModal"
                class="relative w-full max-w-[400px] rounded-2xl border border-zinc-200 bg-white shadow-modal p-6 space-y-4"
              >
                <div class="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                  <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                </div>

                <div>
                  <h3 class="text-zinc-900 font-bold text-base">รีเซ็ตการตั้งค่าแพ็กเกจเป็นค่าเริ่มต้น?</h3>
                  <p class="text-zinc-600 text-xs mt-1.5 leading-relaxed">
                    คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตการตั้งค่าแพ็กเกจทั้งหมดกลับเป็นค่าเริ่มต้นจากระบบ? การตั้งค่าราคา ความจุ และข้อจำกัดที่ปรับแต่งไว้ทั้งหมดจะถูกกู้คืนเป็นค่าเริ่มต้น
                  </p>
                </div>

                <div class="flex items-center justify-end gap-2.5 pt-2 border-t border-zinc-200">
                  <button
                    @click="showResetModal = false"
                    type="button"
                    class="h-9 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-medium transition-colors"
                  >
                    {{ $t('common.cancel') }}
                  </button>
                  <button
                    @click="confirmResetDefaults"
                    :disabled="resetting"
                    type="button"
                    class="h-9 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold disabled:opacity-40 transition-colors shadow-xs flex items-center gap-2"
                  >
                    <svg v-if="resetting" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    <span>{{ resetting ? $t('common.loading') : 'ยืนยันการรีเซ็ต' }}</span>
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </Transition>
      </Teleport>

      <!-- Plan Detail & Edit Modal -->
      <Teleport to="body">
        <div v-if="editingPlan" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs" @click.self="closePlanModal">
          <div class="relative w-full max-w-lg rounded-2xl border border-zinc-200 bg-white shadow-modal p-6 space-y-4">
            <!-- Header -->
            <div class="flex items-center justify-between border-b border-zinc-200 pb-3">
              <div>
                <h3 class="text-base font-bold text-zinc-900 flex items-center gap-2">
                  <svg v-if="planModalTab === 'view'" class="w-4.5 h-4.5 text-zinc-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.573 16.49 16.638 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  <svg v-else class="w-4.5 h-4.5 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                  <span>{{ planModalTab === 'view' ? 'รายละเอียดแพ็กเกจ' : 'แก้ไขแพ็กเกจ' }}: {{ editingPlan.name }}</span>
                </h3>
                <p class="text-xs text-zinc-500 font-mono mt-0.5">Key: {{ editingPlan.key }}</p>
              </div>

              <!-- Top Right Mode Toggle Button -->
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click="planModalTab = planModalTab === 'view' ? 'edit' : 'view'"
                  class="h-8 px-3 rounded-xl border text-[12px] font-semibold inline-flex items-center gap-1.5 transition-all shadow-2xs"
                  :class="planModalTab === 'view'
                    ? 'border-blue-200 bg-blue-50/70 text-blue-700 hover:bg-blue-100'
                    : 'border-zinc-200 bg-zinc-100 text-zinc-700 hover:bg-zinc-200'"
                >
                  <template v-if="planModalTab === 'view'">
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
                <button @click="closePlanModal" class="text-zinc-400 hover:text-zinc-700 text-lg leading-none p-1">&times;</button>
              </div>
            </div>

            <!-- Body View Mode -->
            <div v-if="planModalTab === 'view'" class="space-y-3.5 text-xs">
              <div class="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                <div>
                  <p class="font-bold text-zinc-900 text-sm leading-tight">{{ editingPlan.name }}</p>
                  <p class="text-zinc-500 text-xs font-semibold tabular-nums mt-0.5">{{ formatPrice(editingPlan.price) }} / เดือน</p>
                </div>
                <span class="px-2.5 py-1 rounded-full text-xs font-semibold" :class="editingPlan.isEnabled ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-zinc-100 text-zinc-500 border border-zinc-200'">
                  {{ editingPlan.isEnabled ? 'เปิดใช้งาน' : 'ปิดใช้งาน' }}
                </span>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="p-3.5 rounded-xl border border-zinc-200 bg-white shadow-2xs space-y-1">
                  <p class="text-zinc-400 font-semibold text-[10.5px] uppercase tracking-wider">ความจุสูงสุด</p>
                  <p class="font-bold text-zinc-900 tabular-nums text-xs">{{ formatBytes(editingPlan.storageLimitBytes) }}</p>
                </div>
                <div class="p-3.5 rounded-xl border border-zinc-200 bg-white shadow-2xs space-y-1">
                  <p class="text-zinc-400 font-semibold text-[10.5px] uppercase tracking-wider">จำนวนรูปสูงสุด</p>
                  <p class="font-bold text-zinc-900 tabular-nums text-xs">{{ (editingPlan.imageLimit || 0).toLocaleString() }} รูป</p>
                </div>
              </div>

              <div class="grid grid-cols-3 gap-3">
                <div class="p-3 rounded-xl border border-zinc-200 bg-white shadow-2xs space-y-1">
                  <p class="text-zinc-400 font-semibold text-[10px] uppercase tracking-wider">ผู้ใช้ทั้งหมด</p>
                  <p class="font-bold text-zinc-900 tabular-nums text-xs">{{ (editingPlan.users || 0).toLocaleString() }} คน</p>
                </div>
                <div class="p-3 rounded-xl border border-zinc-200 bg-white shadow-2xs space-y-1">
                  <p class="text-zinc-400 font-semibold text-[10px] uppercase tracking-wider">ผู้ใช้ Active</p>
                  <p class="font-bold text-emerald-700 tabular-nums text-xs">{{ (editingPlan.active || 0).toLocaleString() }} คน</p>
                </div>
                <div class="p-3 rounded-xl border border-zinc-200 bg-white shadow-2xs space-y-1">
                  <p class="text-zinc-400 font-semibold text-[10px] uppercase tracking-wider">พื้นที่ที่ใช้อยู่</p>
                  <p class="font-bold text-blue-700 tabular-nums text-xs">{{ formatBytes(editingPlan.storage || 0) }}</p>
                </div>
              </div>
            </div>

            <!-- Body Edit Mode -->
            <div v-else class="space-y-3.5 text-xs">
              <div>
                <label class="block font-medium text-zinc-700 mb-1">ชื่อแพ็กเกจ (Display Name)</label>
                <input v-model="editPlanForm.name" type="text" class="w-full h-10 px-3.5 rounded-xl border border-zinc-200 text-zinc-900 outline-none focus:border-zinc-400 shadow-xs" />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-medium text-zinc-700 mb-1">ราคาต่อเดือน (บาท)</label>
                  <input v-model.number="editPlanForm.price" type="number" min="0" class="w-full h-10 px-3.5 rounded-xl border border-zinc-200 text-zinc-900 outline-none focus:border-zinc-400 shadow-xs" />
                </div>
                <div>
                  <label class="block font-medium text-zinc-700 mb-1">ความจุสูงสุด (MB)</label>
                  <input v-model.number="editPlanForm.storageLimitMb" type="number" min="0" class="w-full h-10 px-3.5 rounded-xl border border-zinc-200 text-zinc-900 outline-none focus:border-zinc-400 shadow-xs" />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-medium text-zinc-700 mb-1">จำนวนรูปสูงสุด</label>
                  <input v-model.number="editPlanForm.imageLimit" type="number" min="0" class="w-full h-10 px-3.5 rounded-xl border border-zinc-200 text-zinc-900 outline-none focus:border-zinc-400 shadow-xs" />
                </div>
                <div>
                  <label class="block font-medium text-zinc-700 mb-1">ขนาดอัปโหลดสูงสุด/ไฟล์ (MB)</label>
                  <input v-model.number="editPlanForm.maxUploadMb" type="number" min="0" class="w-full h-10 px-3.5 rounded-xl border border-zinc-200 text-zinc-900 outline-none focus:border-zinc-400 shadow-xs" />
                </div>
              </div>

              <div class="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/50 flex items-center justify-between">
                <div>
                  <p class="font-semibold text-zinc-900">เปิดให้สมัครแพ็กเกจนี้ (Enabled)</p>
                  <p class="text-[11px] text-zinc-500">Allow users to subscribe to this plan</p>
                </div>
                <button
                  type="button"
                  @click="editPlanForm.isEnabled = !editPlanForm.isEnabled"
                  class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                  :class="editPlanForm.isEnabled ? 'bg-emerald-600' : 'bg-zinc-300'"
                >
                  <span class="inline-block h-4 w-4 rounded-full bg-white shadow transition-transform" :class="editPlanForm.isEnabled ? 'translate-x-6' : 'translate-x-1'" />
                </button>
              </div>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-end gap-2.5 pt-2 border-t border-zinc-200">
              <button @click="closePlanModal" type="button" class="h-9 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-medium transition-colors">
                {{ $t('common.close') || 'ปิด' }}
              </button>
              <button
                v-if="planModalTab === 'edit'"
                @click="saveEditPlan"
                :disabled="editPlanSaving"
                type="button"
                class="h-9 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold disabled:opacity-40 transition-colors shadow-xs flex items-center gap-2"
              >
                <svg v-if="editPlanSaving" class="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                <span>{{ editPlanSaving ? $t('common.loading') : $t('common.save') }}</span>
              </button>
            </div>
          </div>
        </div>
      </Teleport>

    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

import type { AdminUser } from '~/composables/useAdmin'

const router = useRouter()
const { listUsers } = useAdmin()
const { list: listPlanSettings, get, load, upsert, resetAll, remove } = usePlanSettings()
const toast = useToast()

const users = ref<AdminUser[]>([])
const loading = ref(true)
const error = ref('')
const savingPlanKeys = ref<Record<string, boolean>>({})
const showCreateModal = ref(false)
const creating = ref(false)
const createForm = reactive({
  key: '',
  name: '',
})

const showDeleteModal = ref(false)
const planToDelete = ref<{ key: string; name: string; users: number } | null>(null)

const showResetModal = ref(false)
const resetting = ref(false)

function openResetConfirm() {
  showResetModal.value = true
}

async function confirmResetDefaults() {
  resetting.value = true
  try {
    await resetAll()
    await load()
    toast.success('รีเซ็ตการตั้งค่าแพ็กเกจเป็นค่าเริ่มต้นเรียบร้อยแล้ว')
    showResetModal.value = false
  } catch (e: any) {
    toast.error(e?.message || 'เกิดข้อผิดพลาดในการรีเซ็ตค่าเริ่มต้น')
  } finally {
    resetting.value = false
  }
}

const editingPlan = ref<any | null>(null)
const planModalTab = ref<'view' | 'edit'>('view')
const editPlanSaving = ref(false)
const editPlanForm = reactive({
  name: '',
  price: 0,
  storageLimitMb: 0,
  imageLimit: 0,
  maxUploadMb: 0,
  isEnabled: true,
})

function openPlanModal(row: any, mode: 'view' | 'edit' = 'view') {
  editingPlan.value = row
  planModalTab.value = mode
  editPlanForm.name = row.name
  editPlanForm.price = row.price
  editPlanForm.storageLimitMb = Math.round((row.storageLimitBytes || 0) / (1024 * 1024))
  editPlanForm.imageLimit = row.imageLimit || 0
  editPlanForm.maxUploadMb = 10
  editPlanForm.isEnabled = row.isEnabled
}

function closePlanModal() {
  if (editPlanSaving.value) return
  editingPlan.value = null
}

async function saveEditPlan() {
  if (!editingPlan.value) return
  if (!editPlanForm.isEnabled && (editingPlan.value.users || 0) > 0) {
    toast.error(`ไม่สามารถปิดแพ็กเกจนี้ได้ เนื่องจากมีผู้ใช้งานอยู่ ${(editingPlan.value.users || 0).toLocaleString()} คน`)
    return
  }
  editPlanSaving.value = true
  try {
    const key = editingPlan.value.key
    await upsert(key, {
      name: editPlanForm.name,
      monthlyPrice: editPlanForm.price,
      storageLimitBytes: editPlanForm.storageLimitMb * 1024 * 1024,
      imageLimit: editPlanForm.imageLimit,
      maxUploadMb: editPlanForm.maxUploadMb,
      isEnabled: editPlanForm.isEnabled,
    })

    await load()
    toast.success('แก้ไขข้อมูลแพ็กเกจเรียบร้อยแล้ว')
    editingPlan.value = null
  } catch (e: any) {
    toast.error(e?.message || 'เกิดข้อผิดพลาดในการบันทึกแพ็กเกจ')
  } finally {
    editPlanSaving.value = false
  }
}

onMounted(async () => {
  try {
    const [userRows] = await Promise.all([
      listUsers(),
      load(),
    ])
    users.value = userRows
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Failed to load plans'
  } finally {
    loading.value = false
  }
})

function normalizePlan(plan: string | null | undefined) {
  const key = (plan ?? 'Unknown').trim().toLowerCase()
  return key || 'unknown'
}

function prettyPlan(key: string) {
  if (key === 'free') return 'Free'
  if (key === 'basic') return 'Basic'
  if (key === 'pro') return 'Pro'
  if (key === 'enterprise') return 'Enterprise'
  return key.charAt(0).toUpperCase() + key.slice(1)
}

function planStyles(key: string) {
  if (key === 'free') return { dotClass: 'bg-zinc-400', barClass: 'bg-zinc-400' }
  if (key === 'basic') return { dotClass: 'bg-blue-500', barClass: 'bg-blue-500' }
  if (key === 'pro') return { dotClass: 'bg-purple-500', barClass: 'bg-purple-500' }
  if (key === 'enterprise') return { dotClass: 'bg-emerald-500', barClass: 'bg-emerald-500' }
  return { dotClass: 'bg-amber-500', barClass: 'bg-amber-500' }
}

const totalUsers = computed(() => users.value.length)

const totalStorage = computed(() => users.value.reduce((acc, u) => acc + (u.used_storage_bytes ?? 0), 0))

const activeRate = computed(() => {
  if (!users.value.length) return 0
  const active = users.value.filter((u) => u.is_active && !u.is_guest).length
  return Math.round((active / users.value.length) * 100)
})

const planRows = computed(() => {
  const grouped: Record<string, AdminUser[]> = {}
  for (const user of users.value) {
    const key = normalizePlan(user.plan)
    grouped[key] = grouped[key] ?? []
    grouped[key].push(user)
  }

  const settingsRows = listPlanSettings()
  const settingsByKey = Object.fromEntries(settingsRows.map((item) => [item.key, item]))
  const orderedKeys = settingsRows.map((item) => item.key)

  return orderedKeys
    .map((key) => {
      const list = grouped[key] ?? []
      const setting = settingsByKey[key] ?? get(key)
      const usersCount = list.length
      const active = list.filter((u) => u.is_active && !u.is_guest).length
      const guests = list.filter((u) => u.is_guest).length
      const storage = list.reduce((acc, u) => acc + (u.used_storage_bytes ?? 0), 0)
      const share = totalUsers.value ? Math.round((usersCount / totalUsers.value) * 100) : 0
      return {
        key,
        name: setting?.name ?? prettyPlan(key),
        price: setting?.monthlyPrice ?? 0,
        storageLimitBytes: setting?.storageLimitBytes ?? 0,
        imageLimit: setting?.imageLimit ?? 0,
        isEnabled: setting?.isEnabled ?? true,
        users: usersCount,
        active,
        guests,
        storage,
        share,
        ...planStyles(key),
      }
    })
    .sort((a, b) => {
      if (a.price !== b.price) return a.price - b.price
      return a.name.localeCompare(b.name)
    })
})

function formatPrice(price: number) {
  if (!price) return 'Free'
  return `${price.toLocaleString()} THB`
}

async function resetPlanSettings() {
  await resetAll()
  toast.success('Plan conditions reset to defaults')
}

async function togglePlan(planKey: string, current: boolean, userCount: number = 0) {
  if (savingPlanKeys.value[planKey]) return
  if (current && userCount > 0) {
    toast.error(`ไม่สามารถปิดแพ็กเกจนี้ได้ เนื่องจากมีผู้ใช้งานอยู่ ${userCount.toLocaleString()} คน`)
    return
  }
  savingPlanKeys.value = {
    ...savingPlanKeys.value,
    [planKey]: true,
  }
  try {
    await upsert(planKey, { isEnabled: !current })
    toast.success(!current ? 'เปิดการสมัครแพ็กเกจเรียบร้อยแล้ว' : 'ปิดการสมัครแพ็กเกจเรียบร้อยแล้ว')
  } catch (e: any) {
    toast.error(e?.data?.message ?? 'ไม่สามารถอัปเดตสถานะแพ็กเกจได้')
  } finally {
    savingPlanKeys.value = {
      ...savingPlanKeys.value,
      [planKey]: false,
    }
  }
}

function normalizePlanKey(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, '-')
}

async function createPlan() {
  if (creating.value) return

  const key = normalizePlanKey(createForm.key)
  const name = createForm.name.trim()

  if (!/^[a-z0-9-]+$/.test(key)) {
    toast.error('Plan key must use only a-z, 0-9, and hyphen (-)')
    return
  }
  if (!name) {
    toast.error('Display name is required')
    return
  }

  creating.value = true
  try {
    await upsert(key, {
      name,
      isEnabled: true,
    })
    createForm.key = ''
    createForm.name = ''
    showCreateModal.value = false
    toast.success('Plan created')
  } catch (e: any) {
    toast.error(e?.data?.message ?? 'Failed to create plan')
  } finally {
    creating.value = false
  }
}

function openDeleteConfirm(row: any) {
  planToDelete.value = {
    key: row.key,
    name: row.name,
    users: row.users,
  }
  showDeleteModal.value = true
}

async function deletePlan(planKey: string) {
  if (savingPlanKeys.value[planKey]) return

  savingPlanKeys.value = {
    ...savingPlanKeys.value,
    [planKey]: true,
  }
  try {
    await remove(planKey)
    toast.success('Plan deleted')
    showDeleteModal.value = false
    planToDelete.value = null
  } catch (e: any) {
    toast.error(e?.data?.message ?? 'Failed to delete plan')
  } finally {
    savingPlanKeys.value = {
      ...savingPlanKeys.value,
      [planKey]: false,
    }
  }
}

function goPlan(planKey: string) {
  router.push(`/admin/plans/${encodeURIComponent(planKey)}`)
}
</script>
