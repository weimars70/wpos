<template>
  <div
    class="theme-card cursor-pointer rounded-borders q-pa-sm"
    :class="{ 'theme-card--active': active }"
    @click="$emit('select', theme.id)"
  >
    <!-- Color Bar Preview (3 blocks) -->
    <div class="row no-wrap rounded-borders overflow-hidden q-mb-xs shadow-1" style="height: 30px">
      <div class="col" :style="{ backgroundColor: theme.primary }" title="Primary"></div>
      <div class="col" :style="{ backgroundColor: theme.secondary }" title="Secondary"></div>
      <div class="col" :style="{ backgroundColor: theme.accent }" title="Accent"></div>
    </div>

    <!-- Theme Name & Active Badge -->
    <div class="row items-center justify-between no-wrap q-mt-xs">
      <div class="text-caption text-weight-bold ellipsis" :title="theme.name">
        {{ theme.name }}
      </div>
      <q-icon v-if="active" name="check_circle" color="primary" size="16px" />
    </div>

    <!-- 4 Color Dots -->
    <div class="row q-gutter-xs q-mt-xs flex-center">
      <span class="color-dot" :style="{ backgroundColor: theme.primary }"></span>
      <span class="color-dot" :style="{ backgroundColor: theme.secondary }"></span>
      <span class="color-dot" :style="{ backgroundColor: theme.accent }"></span>
      <span class="color-dot" :style="{ backgroundColor: theme.positive }"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { WposTheme } from '../themes/themes';

defineProps<{
  theme: WposTheme;
  active?: boolean;
}>();

defineEmits<{
  (e: 'select', id: string): void;
}>();
</script>

<style lang="scss" scoped>
.theme-card {
  border: 2px solid rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.body--dark .theme-card {
  border-color: rgba(255, 255, 255, 0.1);
  background: rgba(30, 30, 30, 0.8);
}

.theme-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
}

.theme-card--active {
  border-color: var(--q-primary, #1976d2) !important;
  box-shadow: 0 0 8px rgba(25, 118, 210, 0.3) !important;
}

.color-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  display: inline-block;
}
</style>
