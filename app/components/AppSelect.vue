<template>
  <div ref="containerRef" class="relative block text-left w-full">
    <button
      type="button"
      @click="isOpen = !isOpen"
      class="w-full h-10 inline-flex items-center justify-between gap-2 px-3.5 rounded-xl bg-white border border-zinc-200 text-[13px] text-zinc-900 hover:bg-zinc-50 focus:outline-none focus:border-zinc-400 transition-colors shadow-xs"
      :class="[isOpen ? 'border-zinc-400 ring-2 ring-zinc-900/5' : '', customClass]"
    >
      <span class="truncate font-medium">{{ selectedLabel }}</span>
      <svg
        class="w-4 h-4 text-zinc-400 transition-transform duration-200 shrink-0"
        :class="{ 'rotate-180 text-zinc-700': isOpen }"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
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
        class="absolute left-0 z-30 mt-1.5 min-w-[180px] w-full rounded-2xl bg-white border border-zinc-200 p-1.5 shadow-modal focus:outline-none max-h-60 overflow-y-auto"
      >
        <button
          v-for="opt in options"
          :key="opt.value"
          type="button"
          @click="selectOption(opt.value)"
          class="w-full flex items-center justify-between px-3 py-2 text-[12.5px] rounded-xl transition-colors text-left"
          :class="modelValue === opt.value ? 'bg-zinc-900 text-white font-semibold' : 'text-zinc-700 hover:bg-zinc-100 font-medium'"
        >
          <span class="truncate">{{ opt.label }}</span>
          <svg
            v-if="modelValue === opt.value"
            class="w-3.5 h-3.5 text-white shrink-0 ml-2"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Option {
  label: string
  value: string
}

const props = defineProps<{
  modelValue: string
  options: Option[]
  placeholder?: string
  customClass?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const isOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)

const selectedLabel = computed(() => {
  const match = props.options.find(o => o.value === props.modelValue)
  return match ? match.label : props.placeholder || 'Select option'
})

function selectOption(val: string) {
  emit('update:modelValue', val)
  isOpen.value = false
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
