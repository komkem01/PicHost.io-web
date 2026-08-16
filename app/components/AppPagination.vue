<template>
  <div v-if="totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-zinc-200 text-xs text-zinc-500">
    <!-- Item Range Info -->
    <div class="text-[12.5px]">
      แสดง <span class="font-semibold text-zinc-900 tabular-nums">{{ fromItem }}</span> – <span class="font-semibold text-zinc-900 tabular-nums">{{ toItem }}</span> จากทั้งหมด <span class="font-semibold text-zinc-900 tabular-nums">{{ total.toLocaleString() }}</span> รายการ
    </div>

    <!-- Navigation Controls -->
    <div class="flex items-center gap-1.5">
      <!-- Previous Button -->
      <button
        type="button"
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage <= 1"
        class="h-8.5 px-3 inline-flex items-center gap-1 rounded-xl border border-zinc-200 bg-white text-[12px] font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
        aria-label="Previous Page"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
        <span class="hidden sm:inline">ย้อนกลับ</span>
      </button>

      <!-- Page Numbers -->
      <div class="flex items-center gap-1">
        <template v-for="(p, idx) in pageRange" :key="idx">
          <span v-if="p === '...'" class="w-8 h-8 flex items-center justify-center text-zinc-400 font-medium text-[12px]">…</span>
          <button
            v-else
            type="button"
            @click="goToPage(p as number)"
            class="h-8.5 min-w-[34px] px-2.5 inline-flex items-center justify-center rounded-xl text-[12.5px] font-semibold transition-all cursor-pointer"
            :class="currentPage === p
              ? 'bg-zinc-900 text-white shadow-xs'
              : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900'"
          >
            {{ p }}
          </button>
        </template>
      </div>

      <!-- Next Button -->
      <button
        type="button"
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage >= totalPages"
        class="h-8.5 px-3 inline-flex items-center gap-1 rounded-xl border border-zinc-200 bg-white text-[12px] font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
        aria-label="Next Page"
      >
        <span class="hidden sm:inline">ถัดไป</span>
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    page: number
    total: number
    limit: number
  }>(),
  {
    page: 1,
    total: 0,
    limit: 20,
  }
)

const emit = defineEmits<{
  (e: 'update:page', value: number): void
  (e: 'change', value: number): void
}>()

const currentPage = computed(() => Math.max(1, props.page))

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.limit)))

const fromItem = computed(() => {
  if (props.total === 0) return 0
  return (currentPage.value - 1) * props.limit + 1
})

const toItem = computed(() => {
  return Math.min(currentPage.value * props.limit, props.total)
})

function goToPage(targetPage: number) {
  if (targetPage < 1 || targetPage > totalPages.value || targetPage === currentPage.value) return
  emit('update:page', targetPage)
  emit('change', targetPage)
}

const pageRange = computed(() => {
  const current = currentPage.value
  const totalP = totalPages.value

  if (totalP <= 7) {
    return Array.from({ length: totalP }, (_, i) => i + 1)
  }

  if (current <= 4) {
    return [1, 2, 3, 4, 5, '...', totalP]
  }

  if (current >= totalP - 3) {
    return [1, '...', totalP - 4, totalP - 3, totalP - 2, totalP - 1, totalP]
  }

  return [1, '...', current - 1, current, current + 1, '...', totalP]
})
</script>
