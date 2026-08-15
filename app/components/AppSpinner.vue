<template>
  <svg
    :class="[sizeClass, customClass]"
    fill="none"
    viewBox="0 0 24 24"
    class="animate-spin shrink-0"
    role="status"
    aria-label="Loading"
  >
    <circle
      class="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      stroke-width="4"
    />
    <path
      class="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v8H4z"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    size?: 'xs' | 'sm' | 'md' | 'lg'
    class?: string
  }>(),
  {
    size: 'sm',
    class: '',
  }
)

const sizeClass = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'w-3 h-3'
    case 'sm':
      return 'w-3.5 h-3.5'
    case 'md':
      return 'w-4 h-4'
    case 'lg':
      return 'w-6 h-6'
    default:
      return 'w-3.5 h-3.5'
  }
})

const customClass = computed(() => props.class)
</script>
