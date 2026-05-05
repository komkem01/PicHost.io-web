<template>
  <Transition
    enter-active-class="transition-opacity duration-150 ease-out"
    enter-from-class="opacity-0"
    leave-active-class="transition-opacity duration-200 ease-in"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      class="fixed inset-0 z-[200] bg-[#09090b] flex flex-col items-center justify-center"
    >
      <!-- Background glow -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-600/[0.06] rounded-full blur-[140px]"></div>
      </div>

      <!-- Logo -->
      <div class="relative flex items-center gap-2 mb-10">
        <span class="text-blue-500 text-3xl font-bold tracking-tight">PicHost</span>
        <span class="text-white text-3xl font-light">.io</span>
      </div>

      <!-- Skeleton card -->
      <div class="relative w-full max-w-[360px] mx-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 space-y-3">
        <!-- Top shimmer line -->
        <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-t-2xl"></div>

        <!-- Google button skeleton -->
        <div class="h-10 rounded-xl bg-white/[0.05] animate-pulse"></div>

        <!-- Divider skeleton -->
        <div class="flex items-center gap-3 py-0.5">
          <div class="flex-1 h-px bg-white/[0.07]"></div>
          <div class="w-5 h-1.5 rounded-full bg-white/[0.06] animate-pulse"></div>
          <div class="flex-1 h-px bg-white/[0.07]"></div>
        </div>

        <!-- Field skeletons -->
        <div class="space-y-1.5">
          <div class="h-2.5 w-28 rounded-full bg-white/[0.06] animate-pulse"></div>
          <div class="h-10 rounded-xl bg-white/[0.05] animate-pulse"></div>
        </div>
        <div class="space-y-1.5">
          <div class="h-2.5 w-20 rounded-full bg-white/[0.06] animate-pulse"></div>
          <div class="h-10 rounded-xl bg-white/[0.05] animate-pulse"></div>
        </div>

        <!-- Submit button skeleton -->
        <div class="h-10 rounded-xl bg-blue-600/[0.15] animate-pulse !mt-5"></div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{ show: boolean }>()
</script>
