<template>
  <div ref="containerRef" class="relative block text-left w-full">
    <button
      type="button"
      @click="toggleCalendar"
      class="w-full h-10 inline-flex items-center justify-between gap-2 px-3.5 rounded-xl bg-white border border-zinc-200 text-[13px] text-zinc-900 hover:bg-zinc-50 focus:outline-none focus:border-zinc-400 transition-colors shadow-xs"
      :class="[isOpen ? 'border-zinc-400 ring-2 ring-zinc-900/5' : '', customClass]"
    >
      <span class="truncate font-medium" :class="displayDate ? 'text-zinc-900' : 'text-zinc-400'">
        {{ displayDate || placeholder || 'เลือกวันที่' }}
      </span>
      <svg class="w-4 h-4 text-zinc-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    </button>

    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isOpen"
        class="absolute left-0 z-30 mt-1.5 w-[280px] rounded-2xl bg-white border border-zinc-200 p-4 shadow-modal text-zinc-900"
      >
        <!-- Calendar Header -->
        <div class="flex items-center justify-between mb-3">
          <button
            type="button"
            @click="prevMonth"
            class="p-1 rounded-lg hover:bg-zinc-100 text-zinc-600 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>

          <span class="text-[13px] font-bold text-zinc-900">
            {{ currentMonthYearLabel }}
          </span>

          <button
            type="button"
            @click="nextMonth"
            class="p-1 rounded-lg hover:bg-zinc-100 text-zinc-600 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        <!-- Weekdays -->
        <div class="grid grid-cols-7 gap-1 text-center text-[10.5px] font-semibold text-zinc-400 uppercase mb-1">
          <span v-for="day in weekdays" :key="day">{{ day }}</span>
        </div>

        <!-- Days Grid -->
        <div class="grid grid-cols-7 gap-1 text-center text-[12px]">
          <span v-for="n in firstDayOffset" :key="'blank-' + n" />
          <button
            v-for="day in daysInMonth"
            :key="day"
            type="button"
            @click="selectDate(day)"
            class="h-8 w-8 rounded-xl flex items-center justify-center font-medium transition-colors mx-auto"
            :class="getDayClass(day)"
          >
            {{ day }}
          </button>
        </div>

        <!-- Action Footer -->
        <div class="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between text-[11.5px]">
          <button
            type="button"
            @click="clearDate"
            class="text-zinc-500 hover:text-zinc-900 font-medium transition-colors"
          >
            ล้างค่า
          </button>
          <button
            type="button"
            @click="selectToday"
            class="text-zinc-900 font-bold hover:underline"
          >
            วันนี้
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  modelValue: string // Format: YYYY-MM-DD
  placeholder?: string
  customClass?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const isOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)

const viewDate = ref(new Date())

const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const displayDate = computed(() => {
  if (!props.modelValue) return ''
  const parts = props.modelValue.split('-')
  if (parts.length !== 3) return props.modelValue
  const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
  return date.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })
})

const currentMonthYearLabel = computed(() => {
  return viewDate.value.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })
})

const daysInMonth = computed(() => {
  const year = viewDate.value.getFullYear()
  const month = viewDate.value.getMonth()
  return new Date(year, month + 1, 0).getDate()
})

const firstDayOffset = computed(() => {
  const year = viewDate.value.getFullYear()
  const month = viewDate.value.getMonth()
  return new Date(year, month, 1).getDay()
})

function toggleCalendar() {
  if (!isOpen.value && props.modelValue) {
    const parts = props.modelValue.split('-')
    if (parts.length === 3) {
      viewDate.value = new Date(Number(parts[0]), Number(parts[1]) - 1, 1)
    }
  }
  isOpen.value = !isOpen.value
}

function prevMonth() {
  viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() - 1, 1)
}

function nextMonth() {
  viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + 1, 1)
}

function selectDate(day: number) {
  const year = viewDate.value.getFullYear()
  const month = String(viewDate.value.getMonth() + 1).padStart(2, '0')
  const formattedDay = String(day).padStart(2, '0')
  emit('update:modelValue', `${year}-${month}-${formattedDay}`)
  isOpen.value = false
}

function selectToday() {
  const today = new Date()
  viewDate.value = new Date(today.getFullYear(), today.getMonth(), 1)
  selectDate(today.getDate())
}

function clearDate() {
  emit('update:modelValue', '')
  isOpen.value = false
}

function getDayClass(day: number) {
  const year = viewDate.value.getFullYear()
  const month = String(viewDate.value.getMonth() + 1).padStart(2, '0')
  const formattedDay = String(day).padStart(2, '0')
  const dateStr = `${year}-${month}-${formattedDay}`

  if (props.modelValue === dateStr) {
    return 'bg-zinc-900 text-white font-semibold shadow-xs'
  }

  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  if (todayStr === dateStr) {
    return 'bg-zinc-100 text-zinc-900 font-bold border border-zinc-300'
  }

  return 'text-zinc-700 hover:bg-zinc-100'
}

function handleClickOutside(event: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
