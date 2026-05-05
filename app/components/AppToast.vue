<template>
  <Teleport to="body">
    <div class="fixed top-5 right-5 z-[300] flex flex-col gap-2.5 items-end pointer-events-none">
      <TransitionGroup
        move-class="transition-all duration-300"
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 translate-x-4 scale-95"
        leave-active-class="transition-all duration-200 ease-in absolute"
        leave-to-class="opacity-0 translate-x-4 scale-95"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto flex items-start gap-3 min-w-[280px] max-w-[360px] rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-xl"
          :class="styles[toast.type].wrapper"
        >
          <!-- Icon -->
          <div class="mt-0.5 shrink-0 w-4 h-4" :class="styles[toast.type].icon">
            <!-- success -->
            <svg v-if="toast.type === 'success'" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/>
            </svg>
            <!-- error -->
            <svg v-else-if="toast.type === 'error'" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>
            </svg>
            <!-- warning -->
            <svg v-else-if="toast.type === 'warning'" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>
            </svg>
            <!-- info -->
            <svg v-else viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a.75.75 0 01-.75-.75v-4.5a.75.75 0 011.5 0v4.5A.75.75 0 0110 15z" clip-rule="evenodd"/>
            </svg>
          </div>

          <!-- Message -->
          <p class="flex-1 text-[13px] leading-relaxed font-medium" :class="styles[toast.type].text">
            {{ toast.message }}
          </p>

          <!-- Close -->
          <button
            @click="remove(toast.id)"
            class="shrink-0 mt-0.5 opacity-40 hover:opacity-70 transition-opacity"
            :class="styles[toast.type].text"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/>
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { toasts, remove } = useToast()

const styles = {
  success: {
    wrapper: 'bg-[#0d1f14]/90 border-green-500/20',
    icon: 'text-green-400',
    text: 'text-green-300',
  },
  error: {
    wrapper: 'bg-[#1f0d0d]/90 border-red-500/20',
    icon: 'text-red-400',
    text: 'text-red-300',
  },
  warning: {
    wrapper: 'bg-[#1f180d]/90 border-yellow-500/20',
    icon: 'text-yellow-400',
    text: 'text-yellow-300',
  },
  info: {
    wrapper: 'bg-[#0d1220]/90 border-blue-500/20',
    icon: 'text-blue-400',
    text: 'text-blue-300',
  },
}
</script>
