<template>
  <div class="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
          <svg class="w-5 h-5 text-zinc-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.959 11.959 0 0 1 12 2.714Z" />
          </svg>
          <span>{{ $t('admin.images.title') }}</span>
        </h1>
        <p class="text-xs text-zinc-500 mt-1">{{ $t('admin.images.subtitle') }}</p>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="toggleSelectAll"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-700 transition shadow-xs cursor-pointer"
        >
          <span class="w-3.5 h-3.5 rounded border border-zinc-300 flex items-center justify-center bg-white" :class="{ 'bg-zinc-900 border-zinc-900': isAllSelected }">
            <svg v-if="isAllSelected" class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </span>
          <span>{{ isAllSelected ? $t('admin.images.deselectAll') : $t('admin.images.selectAll') }}</span>
        </button>

        <button
          @click="exportImagesCsv"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-700 transition shadow-xs cursor-pointer"
        >
          <svg class="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          <span>{{ $t('common.exportCsv') }}</span>
        </button>

        <button
          @click="fetchImages"
          class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-700 transition shadow-xs cursor-pointer"
        >
          <svg class="w-3.5 h-3.5 text-zinc-500" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          <span>{{ $t('common.refresh') }}</span>
        </button>
      </div>
    </div>

    <!-- Images Grid -->
    <div v-if="loading" class="text-center py-20 text-zinc-400 text-xs flex flex-col items-center gap-2">
      <svg class="w-6 h-6 animate-spin text-zinc-400" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
      <span>{{ $t('admin.images.loading') }}</span>
    </div>
    <div v-else-if="images.length === 0" class="text-center py-20 text-zinc-400 text-xs">
      {{ $t('admin.images.empty') }}
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div
        v-for="img in images"
        :key="img.id"
        class="group relative rounded-2xl bg-white border shadow-card overflow-hidden flex flex-col justify-between transition hover:border-zinc-300 hover:shadow-md"
        :class="isSelected(img.id) ? 'border-zinc-900 ring-2 ring-zinc-900/10' : 'border-zinc-200'"
      >
        <!-- Thumbnail / Preview container -->
        <div class="relative aspect-video bg-zinc-100 overflow-hidden flex items-center justify-center">
          <img
            :src="getImageUrl(img)"
            :alt="img.id"
            class="w-full h-full object-cover transition duration-300 group-hover:scale-105"
            @error="onImageError"
          />

          <!-- Checkbox overlay -->
          <div class="absolute top-2.5 left-2.5 z-10">
            <button
              @click.stop="toggleSelect(img.id)"
              class="w-6 h-6 rounded-lg flex items-center justify-center transition shadow-xs cursor-pointer"
              :class="isSelected(img.id) ? 'bg-zinc-900 text-white' : 'bg-white/80 hover:bg-white text-transparent backdrop-blur-xs border border-zinc-200'"
            >
              <svg class="w-3.5 h-3.5" :class="{ 'text-white': isSelected(img.id) }" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </button>
          </div>

          <div class="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent opacity-0 group-hover:opacity-100 transition flex items-end justify-between p-3">
            <span class="inline-flex items-center gap-1 text-[10px] font-mono text-white px-2 py-0.5 rounded bg-zinc-900/70 backdrop-blur-xs">
              <svg v-if="img.is_private" class="w-3 h-3 text-amber-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
              <svg v-else class="w-3 h-3 text-emerald-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.949 8.949 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              {{ img.is_private ? $t('admin.images.private') : $t('admin.images.public') }}
            </span>
            <button
              @click="previewImage(img)"
              class="px-2.5 py-1 rounded-lg bg-white/90 hover:bg-white text-zinc-900 text-[10.5px] font-semibold backdrop-blur-xs transition shadow-xs cursor-pointer"
            >
              {{ $t('admin.images.viewFull') }}
            </button>
          </div>
        </div>

        <!-- Meta info -->
        <div class="p-3 space-y-2 text-xs">
          <div class="flex items-center justify-between">
            <span class="text-[10px] text-zinc-400 font-mono">ID: {{ img.id.slice(0, 8) }}...</span>
            <span class="text-[10.5px] text-zinc-500 tabular-nums">{{ formatDate(img.created_at) }}</span>
          </div>

          <!-- Storage Details (File Size & Mime) -->
          <div v-if="img.storage" class="flex items-center justify-between text-[10.5px] text-zinc-500 bg-zinc-50 px-2 py-1 rounded-lg border border-zinc-100">
            <span class="font-medium text-zinc-700">{{ formatBytes(img.storage.file_size) }}</span>
            <span v-if="img.storage.mime_type" class="uppercase text-[9.5px] font-mono text-zinc-400">{{ img.storage.mime_type.split('/')[1] || img.storage.mime_type }}</span>
            <span v-if="img.view_count !== undefined" class="text-[10px] text-zinc-400 font-mono">👁 {{ img.view_count }}</span>
          </div>

          <!-- User Details -->
          <div v-if="img.user" class="flex items-center justify-between text-[11px]">
            <div class="flex items-center gap-1 min-w-0">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
              <span class="text-zinc-700 font-medium truncate">{{ img.user.email || img.user.username || img.user.id.slice(0, 8) }}</span>
            </div>
            <button
              v-if="img.user.is_active !== false"
              @click="openBanModal(img.user.id)"
              class="text-red-600 hover:text-red-700 text-[10px] underline font-medium cursor-pointer shrink-0 ml-1"
            >
              {{ $t('admin.images.banUser') }}
            </button>
            <span v-else class="text-red-500 text-[10px] font-semibold">Banned</span>
          </div>
          <div v-else-if="img.user_id" class="flex items-center justify-between text-[11px]">
            <span class="text-zinc-600 truncate">User: {{ img.user_id.slice(0, 8) }}...</span>
            <button
              @click="openBanModal(img.user_id)"
              class="text-red-600 hover:text-red-700 text-[10px] underline font-medium cursor-pointer"
            >
              {{ $t('admin.images.banUser') }}
            </button>
          </div>
          <div v-else class="text-[11px] text-amber-700 font-medium inline-flex items-center gap-1">
            <svg class="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            <span>{{ $t('admin.images.guestUpload') }}</span>
          </div>
        </div>

        <!-- Actions Footer -->
        <div class="p-3 pt-0 border-t border-zinc-100 flex items-center justify-end">
          <button
            @click="openDeleteModal(img)"
            class="w-full py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-[11px] font-medium transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
            <span>{{ $t('admin.images.deleteImage') }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="rounded-2xl bg-white border border-zinc-200 shadow-card overflow-hidden">
      <AppPagination
        v-model:page="page"
        :total="total"
        :limit="limit"
        @change="fetchImages"
      />
    </div>

    <!-- Full Image Preview Modal -->
    <Teleport to="body">
      <div v-if="selectedImg" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/70 backdrop-blur-xs" @click.self="selectedImg = null">
        <div class="relative max-w-4xl max-h-[90vh] flex flex-col items-center p-5 rounded-2xl bg-white border border-zinc-200 shadow-2xl">
          <img :src="getImageUrl(selectedImg)" class="max-w-full max-h-[70vh] rounded-xl border border-zinc-200 object-contain" />
          
          <div class="w-full mt-4 flex items-center justify-between text-xs border-t border-zinc-100 pt-3">
            <div class="flex items-center gap-3 text-zinc-500">
              <span class="font-mono">ID: {{ selectedImg.id }}</span>
              <span v-if="selectedImg.storage?.file_size">{{ formatBytes(selectedImg.storage.file_size) }}</span>
            </div>

            <div class="flex items-center gap-2">
              <button @click="selectedImg = null" class="px-4 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-700 cursor-pointer">
                {{ $t('admin.images.close') }}
              </button>
              <button @click="openDeleteModal(selectedImg); selectedImg = null" class="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold cursor-pointer">
                {{ $t('admin.images.deleteNow') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport    <!-- Delete Image Modal Popup -->
    <Teleport to="body">
      <div v-if="showDeleteModal && imgToDelete" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs" @click.self="showDeleteModal = false">
        <div class="relative w-full max-w-[440px] rounded-2xl border border-zinc-200 bg-white shadow-2xl p-6 text-center space-y-4 text-xs">
          <div class="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </div>

          <div class="space-y-1">
            <h3 class="text-base font-bold text-zinc-900">{{ $t('admin.images.deleteModalTitle') || 'ลบรูปภาพ' }}</h3>
            <p class="text-xs text-zinc-500 leading-relaxed">
              {{ $t('admin.images.deleteModalDesc') || 'คุณแน่ใจหรือไม่ว่าต้องการลบรูปภาพนี้ออกจากระบบ? ระบบจะส่งแจ้งเตือนไปยังผู้ใช้พร้อมเหตุผล' }}
            </p>
          </div>

          <!-- Reason for Deletion Input -->
          <div class="space-y-2 text-left bg-zinc-50/80 p-3.5 rounded-xl border border-zinc-200">
            <label class="block text-[11.5px] font-bold text-zinc-700">
              {{ $t('admin.images.reasonLabel') || 'ระบุเหตุผลในการลบ (ส่งแจ้งเตือนไปยังผู้ใช้):' }}
            </label>
            <AppSelect
              v-model="deleteReasonPreset"
              :options="reasonOptions"
            />

            <input
              v-if="deleteReasonPreset === 'Other'"
              v-model="deleteCustomReason"
              type="text"
              :placeholder="$t('admin.images.customReasonPlaceholder')"
              class="w-full h-9 px-3 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400"
            />
          </div>

          <div class="flex items-center gap-2 pt-2">
            <button
              @click="showDeleteModal = false"
              class="flex-1 py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-semibold cursor-pointer"
            >
              {{ $t('common.cancel') }}
            </button>
            <button
              @click="executeDeleteImage"
              :disabled="deleting"
              class="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold cursor-pointer disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
            >
              <svg v-if="deleting" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>{{ $t('admin.images.deleteNow') }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Ban User Modal Popup -->
    <Teleport to="body">
      <div v-if="showBanModal && userToBan" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs" @click.self="showBanModal = false">
        <div class="relative w-full max-w-[400px] rounded-2xl border border-zinc-200 bg-white shadow-2xl p-6 text-center space-y-4">
          <div class="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.008v.008H12v-.008Z" />
            </svg>
          </div>

          <div class="space-y-1">
            <h3 class="text-base font-bold text-zinc-900">Suspend User Account?</h3>
            <p class="text-xs text-zinc-500 leading-relaxed">
              Are you sure you want to suspend user <span class="font-semibold font-mono text-zinc-900">{{ userToBan.slice(0, 8) }}...</span>? They will be blocked from accessing PicHost.io.
            </p>
          </div>

          <div class="flex items-center gap-3 pt-2">
            <button
              @click="showBanModal = false"
              class="flex-1 py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              @click="executeBanUser"
              :disabled="banning"
              class="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold cursor-pointer disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
            >
              <svg v-if="banning" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>Suspend Account</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Floating Bulk Actions Toolbar -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-6"
        leave-active-class="transition duration-150 ease-in"
        leave-to-class="opacity-0 translate-y-6"
      >
        <div
          v-if="selectedIds.length > 0"
          class="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-5 py-3 rounded-2xl bg-zinc-900 text-white shadow-2xl border border-zinc-700 backdrop-blur-md"
        >
          <div class="flex items-center gap-2 text-xs font-semibold">
            <span class="w-5 h-5 rounded-full bg-emerald-500 text-zinc-900 flex items-center justify-center text-[10.5px] font-bold">
              {{ selectedIds.length }}
            </span>
            <span>{{ $t('admin.images.selectedCount', { count: selectedIds.length }) }}</span>
          </div>

          <div class="h-4 w-px bg-zinc-700"></div>

          <button
            @click="selectedIds = []"
            class="text-xs text-zinc-400 hover:text-white transition font-medium cursor-pointer"
          >
            {{ $t('admin.images.deselectAll') }}
          </button>

          <button
            @click="showBulkDeleteModal = true"
            class="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
            <span>{{ $t('admin.images.bulkDelete') }} ({{ selectedIds.length }})</span>
          </button>
        </div>
      </Transition>
    </Teleport>

    <!-- Bulk Delete Confirmation Modal -->
    <Teleport to="body">
      <div v-if="showBulkDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs" @click.self="showBulkDeleteModal = false">
        <div class="relative w-full max-w-[440px] rounded-2xl border border-zinc-200 bg-white shadow-2xl p-6 text-center space-y-4 text-xs">
          <div class="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </div>

          <div class="space-y-1">
            <h3 class="text-base font-bold text-zinc-900">{{ $t('admin.images.bulkDelete') }}</h3>
            <p class="text-xs text-zinc-500 leading-relaxed">
              {{ $t('admin.images.bulkDeleteConfirm', { count: selectedIds.length }) }}
            </p>
          </div>

          <!-- Reason for Bulk Deletion -->
          <div class="space-y-2 text-left bg-zinc-50/80 p-3.5 rounded-xl border border-zinc-200">
            <label class="block text-[11.5px] font-bold text-zinc-700">
              {{ $t('admin.images.reasonLabel') || 'ระบุเหตุผลในการลบ (ส่งแจ้งเตือนไปยังผู้ใช้แต่ละคน):' }}
            </label>
            <AppSelect
              v-model="bulkDeleteReasonPreset"
              :options="reasonOptions"
            />

            <input
              v-if="bulkDeleteReasonPreset === 'Other'"
              v-model="bulkDeleteCustomReason"
              type="text"
              :placeholder="$t('admin.images.customReasonPlaceholder')"
              class="w-full h-9 px-3 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400"
            />
          </div>

          <div class="flex items-center gap-2 pt-2">
            <button
              @click="showBulkDeleteModal = false"
              class="flex-1 py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-medium cursor-pointer"
            >
              {{ $t('common.cancel') }}
            </button>
            <button
              @click="executeBulkDelete"
              :disabled="bulkDeleting"
              class="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold cursor-pointer disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
            >
              <svg v-if="bulkDeleting" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>{{ $t('admin.images.deleteNow') }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

interface StorageItem {
  id: string
  short_code: string
  provider?: string
  file_size: number
  mime_type?: string
  created_at?: string
}

interface UserItem {
  id: string
  username?: string
  email?: string
  plan: string
}

interface ImageItem {
  id: string
  user_id?: string
  storage_id: string
  is_private: boolean
  view_count?: number
  created_at: string
  storage?: StorageItem
  user?: UserItem
}

const images = ref<ImageItem[]>([])
const loading = ref(false)
const deleting = ref(false)
const bulkDeleting = ref(false)
const banning = ref(false)
const page = ref(1)
const limit = ref(12)
const total = ref(0)

const selectedImg = ref<ImageItem | null>(null)
const selectedIds = ref<string[]>([])

const showDeleteModal = ref(false)
const imgToDelete = ref<ImageItem | null>(null)
const deleteReasonPreset = ref('Violates Terms of Service')
const deleteCustomReason = ref('')

const showBulkDeleteModal = ref(false)
const bulkDeleteReasonPreset = ref('Violates Terms of Service')
const bulkDeleteCustomReason = ref('')

const reasonOptions = computed(() => [
  { value: 'Violates Terms of Service', label: t('admin.images.reasons.terms') },
  { value: 'Inappropriate / NSFW Content', label: t('admin.images.reasons.nsfw') },
  { value: 'Copyright Infringement', label: t('admin.images.reasons.copyright') },
  { value: 'Spam or Malicious File', label: t('admin.images.reasons.spam') },
  { value: 'Other', label: t('admin.images.reasons.other') }
])

const showBanModal = ref(false)
const userToBan = ref<string | null>(null)

const isAllSelected = computed(() => {
  return images.value.length > 0 && images.value.every(img => selectedIds.value.includes(img.id))
})

function isSelected(id: string) {
  return selectedIds.value.includes(id)
}

function toggleSelect(id: string) {
  const idx = selectedIds.value.indexOf(id)
  if (idx > -1) {
    selectedIds.value.splice(idx, 1)
  } else {
    selectedIds.value.push(id)
  }
}

function toggleSelectAll() {
  if (isAllSelected.value) {
    selectedIds.value = []
  } else {
    selectedIds.value = images.value.map(i => i.id)
  }
}

const { t } = useI18n()
const { success: toastSuccess, error: toastError } = useToast()
const config = useRuntimeConfig()

async function fetchImages() {
  loading.value = true
  try {
    const res = await apiFetch<any>('/admin/images', {
      params: { page: page.value, limit: limit.value }
    })
    if (res.data) {
      images.value = res.data.items || []
      total.value = res.data.total || 0
    }
  } catch (e) {
    console.error('Failed to load images:', e)
  } finally {
    loading.value = false
  }
}

function getImageUrl(img: ImageItem) {
  if (!img) return ''
  const apiBase = (config.public.apiBase || 'http://localhost:8080/api/v1').replace(/\/api\/v1\/?$/, '')
  if (img.storage?.short_code) {
    return `${apiBase}/p/${img.storage.short_code}`
  }
  return `${apiBase}/i/${img.id}`
}

function onImageError(e: Event) {
  const target = e.target as HTMLImageElement
  if (!target.src.includes('data:image/svg+xml')) {
    target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200" fill="%23f4f4f5"><rect width="300" height="200" fill="%23f4f4f5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="12" fill="%23a1a1aa">Image Unavailable</text></svg>'
  }
}

function previewImage(img: ImageItem) {
  selectedImg.value = img
}

function formatDate(iso: string) {
  if (!iso) return '-'
  return new Date(iso).toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatBytes(bytes?: number): string {
  if (!bytes || bytes <= 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}

function openDeleteModal(img: ImageItem) {
  imgToDelete.value = img
  deleteReasonPreset.value = 'Violates Terms of Service'
  deleteCustomReason.value = ''
  showDeleteModal.value = true
}

async function executeDeleteImage() {
  if (!imgToDelete.value) return
  deleting.value = true
  const reason = deleteReasonPreset.value === 'Other' ? (deleteCustomReason.value.trim() || 'ละเมิดข้อกำหนดการใช้งาน') : deleteReasonPreset.value

  try {
    await apiFetch(`/admin/images/${imgToDelete.value.id}`, {
      method: 'DELETE',
      body: { reason }
    })
    showDeleteModal.value = false
    imgToDelete.value = null
    toastSuccess(t('toast.imageDeleteSuccess'))
    fetchImages()
  } catch (e) {
    toastError(t('toast.deleteError'))
  } finally {
    deleting.value = false
  }
}

async function executeBulkDelete() {
  if (selectedIds.value.length === 0) return
  bulkDeleting.value = true
  const reason = bulkDeleteReasonPreset.value === 'Other' ? (bulkDeleteCustomReason.value.trim() || 'ละเมิดข้อกำหนดการใช้งาน') : bulkDeleteReasonPreset.value

  try {
    const res = await apiFetch<any>('/admin/images/bulk-delete', {
      method: 'POST',
      body: {
        image_ids: selectedIds.value,
        reason
      }
    })
    const count = res?.data?.deleted_count || selectedIds.value.length
    toastSuccess(t('toast.bulkDeleteSuccess', { count }))
    selectedIds.value = []
    showBulkDeleteModal.value = false
    await fetchImages()
  } catch (e) {
    toastError(t('toast.deleteError'))
  } finally {
    bulkDeleting.value = false
  }
}

function openBanModal(userId: string) {
  userToBan.value = userId
  showBanModal.value = true
}

async function executeBanUser() {
  if (!userToBan.value) return
  banning.value = true
  try {
    await apiFetch(`/admin/users/${userToBan.value}/active`, {
      method: 'PATCH',
      body: { is_active: false }
    })
    showBanModal.value = false
    userToBan.value = null
    toastSuccess(t('toast.userBanSuccess'))
    fetchImages()
  } catch (e) {
    toastError(t('toast.saveError'))
  } finally {
    banning.value = false
  }
}

function exportImagesCsv() {
  const headers = [
    { label: 'รหัสรูปภาพ (Image ID)', key: 'id' },
    { label: 'เจ้าของรูปภาพ (Owner)', key: 'owner_display' },
    { label: 'รหัสพื้นที่จัดเก็บ (Storage ID)', key: 'storage_id' },
    { label: 'ความเป็นส่วนตัว (Privacy)', key: 'privacy_display' },
    { label: 'จำนวนเข้าชม (Views)', key: 'view_count_formatted' },
    { label: 'ขนาดไฟล์ (File Size)', key: 'file_size_formatted' },
    { label: 'ประเภทไฟล์ (MIME Type)', key: 'mime_type' },
    { label: 'วันที่อัปโหลด (Uploaded At)', key: 'created_at_formatted' }
  ]
  const data = images.value.map(i => ({
    id: i.id,
    owner_display: i.user_id ? `User (${i.user_id})` : 'ผู้ใช้ทั่วไป (Guest)',
    storage_id: i.storage_id,
    privacy_display: i.is_private ? 'ส่วนตัว (Private)' : 'สาธารณะ (Public)',
    view_count_formatted: (i.view_count || 0).toLocaleString(),
    file_size_formatted: formatBytes(i.storage?.file_size || 0),
    mime_type: i.storage?.mime_type || '-',
    created_at_formatted: formatDate(i.created_at)
  }))
  exportToCsv('pichost_images', headers, data)
}

onMounted(() => {
  fetchImages()
})
</script>


