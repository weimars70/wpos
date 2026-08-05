<template>
  <q-btn-dropdown
    flat
    round
    dense
    icon="palette"
    :color="$q.dark.isActive ? 'white' : 'primary'"
    title="Seleccionar Tema WPOS"
    class="q-mr-sm"
  >
    <div style="width: 360px; max-width: 90vw; max-height: 520px" class="q-pa-md column no-wrap">
      <!-- Header -->
      <div class="row items-center justify-between q-mb-sm">
        <div class="row items-center">
          <q-icon name="palette" size="20px" class="q-mr-xs text-primary" />
          <span class="text-subtitle1 text-weight-bold">Temas WPOS</span>
        </div>
        <q-badge outline color="primary" class="text-weight-bold">
          {{ currentTheme.name }}
        </q-badge>
      </div>

      <!-- Search Box -->
      <q-input
        v-model="search"
        dense
        outlined
        placeholder="Buscar tema..."
        class="q-mb-sm"
        clearable
      >
        <template #prepend>
          <q-icon name="search" size="18px" />
        </template>
      </q-input>

      <!-- Category Filter Tabs -->
      <q-tabs
        v-model="selectedCategory"
        dense
        no-caps
        active-color="primary"
        indicator-color="primary"
        class="q-mb-sm text-grey-7"
      >
        <q-tab name="all" label="Todos" />
        <q-tab name="business" label="Business" />
        <q-tab name="vibrant" label="Vibrantes" />
        <q-tab name="fashion" label="Fashion" />
        <q-tab name="dark" label="Oscuros" />
      </q-tabs>

      <!-- Grid of Theme Cards -->
      <div class="col overflow-auto q-pr-xs">
        <div class="row q-col-gutter-xs">
          <div
            v-for="theme in filteredThemes"
            :key="theme.id"
            class="col-6"
          >
            <ThemeCard
              :theme="theme"
              :active="currentTheme.id === theme.id"
              @select="selectTheme"
            />
          </div>
        </div>

        <div v-if="filteredThemes.length === 0" class="text-center text-grey-6 q-pa-lg">
          No se encontraron temas con ese nombre.
        </div>
      </div>
    </div>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useTheme } from '../themes/useTheme';
import ThemeCard from './ThemeCard.vue';

const $q = useQuasar();
const { currentTheme, themesList, setTheme } = useTheme();

const search = ref('');
const selectedCategory = ref('all');

const filteredThemes = computed(() => {
  return themesList.value.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(search.value.toLowerCase());
    const matchesCategory = selectedCategory.value === 'all' || t.category === selectedCategory.value;
    return matchesSearch && matchesCategory;
  });
});

function selectTheme(themeId: string) {
  setTheme(themeId);
}
</script>
