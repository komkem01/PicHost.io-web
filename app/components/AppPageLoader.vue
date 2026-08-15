<template>
  <Transition
    enter-active-class="transition-opacity duration-150 ease-out"
    enter-from-class="opacity-0"
    leave-active-class="transition-opacity duration-200 ease-in"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      class="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center pointer-events-none"
    >
      <!-- Logo & Loader -->
      <div class="relative flex flex-col items-center gap-6">
        <div class="flex items-center gap-1">
          <span class="text-zinc-900 text-3xl sm:text-4xl font-bold tracking-tight">PicHost</span>
          <span class="text-zinc-400 text-3xl sm:text-4xl font-light">.io</span>
        </div>

        <!-- Sleek Loader Indicator -->
        <div class="relative w-36 h-1.5 rounded-full bg-zinc-100 border border-zinc-200 overflow-hidden">
          <div class="absolute inset-y-0 w-1/2 bg-zinc-900 rounded-full animate-[shimmer_1.2s_infinite]"></div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{ show: boolean }>()
</script>

<style scoped>
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
}
</style>
