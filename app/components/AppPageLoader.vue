<template>
  <Transition
    enter-active-class="transition-opacity duration-150 ease-out"
    enter-from-class="opacity-0"
    leave-active-class="transition-opacity duration-200 ease-in"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      class="fixed inset-0 z-[200] bg-[#09090b] flex flex-col items-center justify-center pointer-events-none"
    >
      <!-- Background glow -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-600/[0.08] rounded-full blur-[140px]"></div>
      </div>

      <!-- Logo & Pulse -->
      <div class="relative flex flex-col items-center gap-6">
        <div class="flex items-center gap-1">
          <span class="text-blue-500 text-3xl sm:text-4xl font-bold tracking-tight">PicHost</span>
          <span class="text-white text-3xl sm:text-4xl font-light">.io</span>
        </div>

        <!-- Sleek Loader Indicator -->
        <div class="relative w-36 h-1 rounded-full bg-white/[0.08] overflow-hidden">
          <div class="absolute inset-y-0 w-1/2 bg-gradient-to-r from-blue-600 via-blue-400 to-indigo-500 rounded-full animate-[shimmer_1.2s_infinite]"></div>
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
