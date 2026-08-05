<template>
  <q-layout view="lHh Lpr lFf" :class="$q.dark.isActive ? 'bg-dark' : 'bg-grey-2'">
    <q-header :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-primary'" :style="{ borderBottom: $q.dark.isActive ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)' }">
      <q-toolbar class="q-py-xs">
        <q-btn flat dense round icon="menu" @click="drawer = !drawer" class="q-mr-sm" />
        <q-toolbar-title class="text-weight-bold text-primary flex items-center">
          <img src="/logo.png" style="height: 32px; max-width: 32px; object-fit: contain;" class="q-mr-sm" alt="Logo" />
          <span>WPOS</span>
        </q-toolbar-title>
        
        <q-space />

        <div class="flex items-center q-gutter-sm">
          <q-chip outline color="primary" icon="business" class="gt-xs text-primary">
            {{ empresaNombre }}
          </q-chip>

          <q-btn 
            flat 
            round 
            dense
            :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
            @click="$q.dark.toggle()"
            :color="$q.dark.isActive ? 'warning' : 'primary'"
            class="q-mx-sm"
            title="Alternar modo oscuro"
          />

          <!-- Selector de Temas -->
          <ThemePicker />
          
          <q-btn-dropdown flat no-caps stretch>
            <template #label>
              <q-icon name="account_circle" size="32px" class="q-mr-sm" />
              <div class="gt-xs">{{ authStore.user?.name || 'Usuario' }}</div>
            </template>
            <q-list style="min-width: 200px">
              <q-item clickable v-ripple @click="handleLogout" class="text-red">
                <q-item-section avatar><q-icon name="logout" /></q-item-section>
                <q-item-section>Cerrar sesión</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>

      <!-- BARRA DE PESTAÑAS (MULTI-TAB SYSTEM) -->
      <div :class="['row items-center no-wrap shadow-1', $q.dark.isActive ? 'bg-grey-9 text-grey-3' : 'bg-grey-1 text-grey-8']" :style="{ borderTop: $q.dark.isActive ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)', borderBottom: $q.dark.isActive ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)', minHeight: '38px' }">
        <q-tabs
          v-model="activeTabPath"
          dense
          no-caps
          inline-label
          outside-arrows
          mobile-arrows
          :active-color="$q.dark.isActive ? 'white' : 'primary'"
          :active-bg-color="$q.dark.isActive ? 'grey-8' : 'white'"
          indicator-color="primary"
          class="col"
          style="min-height: 38px;"
        >
          <q-tab
            v-for="tab in openTabs"
            :key="tab.path"
            :name="tab.path"
            @click="selectTab(tab.path)"
            class="q-px-sm text-weight-medium tab-item"
            :style="{ minHeight: '38px', borderRight: $q.dark.isActive ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)' }"
          >
            <div class="row items-center no-wrap">
              <q-icon :name="tab.icon" size="18px" :class="['q-mr-xs', $q.dark.isActive ? 'text-white' : 'text-primary']" />
              <span class="q-mr-xs" style="font-size: 13px;">{{ tab.title }}</span>
              <q-btn
                v-if="tab.closable"
                flat
                round
                dense
                icon="close"
                size="xs"
                class="q-ml-xs text-grey-6 hover-close-btn"
                @click.stop="closeTab(tab.path)"
              >
                <q-tooltip>Cerrar pestaña</q-tooltip>
              </q-btn>
            </div>
          </q-tab>
        </q-tabs>

        <q-btn-dropdown flat dense icon="more_vert" class="q-px-xs text-grey-7" auto-close>
          <q-list style="min-width: 170px">
            <q-item clickable @click="closeOtherTabs(activeTabPath)">
              <q-item-section avatar><q-icon name="tab_unselected" size="sm" /></q-item-section>
              <q-item-section>Cerrar otras</q-item-section>
            </q-item>
            <q-item clickable @click="closeAllTabs" class="text-red">
              <q-item-section avatar><q-icon name="close" size="sm" /></q-item-section>
              <q-item-section>Cerrar todas</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </q-header>
    
    <q-drawer
      v-model="drawer"
      show-if-above
      :width="260"
      class="page-background"
    >
      <div class="q-pa-md text-center q-mt-sm">
        <img src="/logo.png" style="max-height: 50px; max-width: 120px; object-fit: contain;" class="q-mb-xs" alt="WPOS Logo" />
        <div class="text-h6 text-weight-bold text-white">SISTEMA WPOS</div>
        <div class="text-caption text-white">v1.2.0</div>
      </div>

      <q-list padding class="q-mt-md">
        <q-item clickable v-ripple to="/dashboard" active-class="bg-blue-1 text-primary shadow-1" class="q-mx-sm rounded-borders q-mb-xs text-white">
          <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
          <q-item-section class="text-weight-medium text-white">Dashboard</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/users" active-class="bg-blue-1 text-primary shadow-1" class="q-mx-sm rounded-borders q-mb-xs text-white">
          <q-item-section avatar><q-icon name="people" /></q-item-section>
          <q-item-section class="text-weight-medium text-white">Usuarios</q-item-section>
        </q-item>

        <q-expansion-item
          icon="menu_book"
          label="Entradas"
          class="q-mx-sm rounded-borders text-white"
          header-class="text-weight-medium text-white"
        >
          <q-item clickable v-ripple to="/entradas/listado-compras" active-class="bg-blue-1 text-primary" class="rounded-borders q-ml-md q-mr-sm q-mb-xs">
            <q-item-section avatar><q-icon name="arrow_right" size="xs" /></q-item-section>
            <q-item-section>Listado Compras</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/entradas/nueva-compra" active-class="bg-blue-1 text-primary" class="rounded-borders q-ml-md q-mr-sm q-mb-xs">
            <q-item-section avatar><q-icon name="arrow_right" size="xs" /></q-item-section>
            <q-item-section>Nueva Compra</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/entradas/listado-cxp" active-class="bg-blue-1 text-primary" class="rounded-borders q-ml-md q-mr-sm q-mb-xs">
            <q-item-section avatar><q-icon name="arrow_right" size="xs" /></q-item-section>
            <q-item-section>Listado CXP</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/entradas/movimiento-facturas" active-class="bg-blue-1 text-primary" class="rounded-borders q-ml-md q-mr-sm q-mb-xs">
            <q-item-section avatar><q-icon name="arrow_right" size="xs" /></q-item-section>
            <q-item-section>Movimiento facturas</q-item-section>
          </q-item>
        </q-expansion-item>

        <q-expansion-item
          icon="shopping_cart"
          label="Salidas"
          class="q-mx-sm rounded-borders text-white"
          header-class="text-weight-medium text-white"
        >
          <q-item clickable v-ripple to="/salidas/facturas" active-class="bg-blue-1 text-primary" class="rounded-borders q-ml-md q-mr-sm q-mb-xs">
            <q-item-section avatar><q-icon name="receipt_long" size="xs" /></q-item-section>
            <q-item-section>Facturador</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/salidas/listado-facturas" active-class="bg-blue-1 text-primary" class="rounded-borders q-ml-md q-mr-sm q-mb-xs">
            <q-item-section avatar><q-icon name="list_alt" size="xs" /></q-item-section>
            <q-item-section>Listado de Facturas</q-item-section>
          </q-item>
        </q-expansion-item>

        <q-expansion-item
          icon="inventory_2"
          label="Inventario"
          class="q-mx-sm rounded-borders text-white"
          header-class="text-weight-medium text-white"
        >
          <q-item clickable v-ripple to="/inventario/ajuste" active-class="bg-blue-1 text-primary" class="rounded-borders q-ml-md q-mr-sm q-mb-xs">
            <q-item-section avatar><q-icon name="arrow_right" size="xs" /></q-item-section>
            <q-item-section>Ajuste Inventario</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/inventario/general" active-class="bg-blue-1 text-primary" class="rounded-borders q-ml-md q-mr-sm q-mb-xs">
            <q-item-section avatar><q-icon name="arrow_right" size="xs" /></q-item-section>
            <q-item-section>Inventario General</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/inventario/listado-ajustes" active-class="bg-blue-1 text-primary" class="rounded-borders q-ml-md q-mr-sm q-mb-xs">
            <q-item-section avatar><q-icon name="arrow_right" size="xs" /></q-item-section>
            <q-item-section>Listado Ajustes</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/inventario/listado-inventario" active-class="bg-blue-1 text-primary" class="rounded-borders q-ml-md q-mr-sm q-mb-xs">
            <q-item-section avatar><q-icon name="arrow_right" size="xs" /></q-item-section>
            <q-item-section>Listado Inventario</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/inventario/items-sin-inventario" active-class="bg-blue-1 text-primary" class="rounded-borders q-ml-md q-mr-sm q-mb-xs">
            <q-item-section avatar><q-icon name="arrow_right" size="xs" /></q-item-section>
            <q-item-section>Items Sin Inventario</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/inventario/listado-traslados" active-class="bg-blue-1 text-primary" class="rounded-borders q-ml-md q-mr-sm q-mb-xs">
            <q-item-section avatar><q-icon name="arrow_right" size="xs" /></q-item-section>
            <q-item-section>Listado Traslados</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/inventario/movimiento-items" active-class="bg-blue-1 text-primary" class="rounded-borders q-ml-md q-mr-sm q-mb-xs">
            <q-item-section avatar><q-icon name="arrow_right" size="xs" /></q-item-section>
            <q-item-section>Movimiento Items</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/inventario/movimiento-items-filtrar" active-class="bg-blue-1 text-primary" class="rounded-borders q-ml-md q-mr-sm q-mb-xs">
            <q-item-section avatar><q-icon name="arrow_right" size="xs" /></q-item-section>
            <q-item-section>Movimiento Items Filtrar</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/inventario/recibir-traslado" active-class="bg-blue-1 text-primary" class="rounded-borders q-ml-md q-mr-sm q-mb-xs">
            <q-item-section avatar><q-icon name="arrow_right" size="xs" /></q-item-section>
            <q-item-section>Recibir Traslado Inventario</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/inventario/valor-inventario" active-class="bg-blue-1 text-primary" class="rounded-borders q-ml-md q-mr-sm q-mb-xs">
            <q-item-section avatar><q-icon name="arrow_right" size="xs" /></q-item-section>
            <q-item-section>Valor Inventario</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/inventario/traslado-inventario" active-class="bg-blue-1 text-primary" class="rounded-borders q-ml-md q-mr-sm q-mb-xs">
            <q-item-section avatar><q-icon name="arrow_right" size="xs" /></q-item-section>
            <q-item-section>Traslado Inventario</q-item-section>
          </q-item>
        </q-expansion-item>

        <q-expansion-item
          icon="folder_special"
          label="Maestros"
          class="q-mx-sm rounded-borders text-white"
          header-class="text-weight-medium text-white"
        >
          <q-item clickable v-ripple to="/maestros/medios-pago" active-class="bg-blue-1 text-primary" class="rounded-borders q-ml-md q-mr-sm q-mb-xs">
            <q-item-section avatar><q-icon name="arrow_right" size="xs" /></q-item-section>
            <q-item-section>Medios de pago</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/maestros/colores" active-class="bg-blue-1 text-primary" class="rounded-borders q-ml-md q-mr-sm q-mb-xs">
            <q-item-section avatar><q-icon name="arrow_right" size="xs" /></q-item-section>
            <q-item-section>Colores</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/maestros/documentos" active-class="bg-blue-1 text-primary" class="rounded-borders q-ml-md q-mr-sm q-mb-xs">
            <q-item-section avatar><q-icon name="arrow_right" size="xs" /></q-item-section>
            <q-item-section>Documentos</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/maestros/empleados" active-class="bg-blue-1 text-primary" class="rounded-borders q-ml-md q-mr-sm q-mb-xs">
            <q-item-section avatar><q-icon name="arrow_right" size="xs" /></q-item-section>
            <q-item-section>Empleados</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/maestros/grupos-items" active-class="bg-blue-1 text-primary" class="rounded-borders q-ml-md q-mr-sm q-mb-xs">
            <q-item-section avatar><q-icon name="arrow_right" size="xs" /></q-item-section>
            <q-item-section>Grupos Items</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/maestros/tipo-iva" active-class="bg-blue-1 text-primary" class="rounded-borders q-ml-md q-mr-sm q-mb-xs">
            <q-item-section avatar><q-icon name="arrow_right" size="xs" /></q-item-section>
            <q-item-section>Tipo Iva</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/maestros/tallas" active-class="bg-blue-1 text-primary" class="rounded-borders q-ml-md q-mr-sm q-mb-xs">
            <q-item-section avatar><q-icon name="arrow_right" size="xs" /></q-item-section>
            <q-item-section>Tallas</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/maestros/items" active-class="bg-blue-1 text-primary" class="rounded-borders q-ml-md q-mr-sm q-mb-xs">
            <q-item-section avatar><q-icon name="arrow_right" size="xs" /></q-item-section>
            <q-item-section>Items</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/maestros/proveedores" active-class="bg-blue-1 text-primary" class="rounded-borders q-ml-md q-mr-sm q-mb-xs">
            <q-item-section avatar><q-icon name="arrow_right" size="xs" /></q-item-section>
            <q-item-section>Proveedores</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/maestros/clientes" active-class="bg-blue-1 text-primary" class="rounded-borders q-ml-md q-mr-sm q-mb-xs">
            <q-item-section avatar><q-icon name="arrow_right" size="xs" /></q-item-section>
            <q-item-section>Clientes</q-item-section>
          </q-item>
        </q-expansion-item>
      </q-list>

      <div class="absolute-bottom q-pa-md flex flex-center">
        <div class="text-caption text-grey-4">© 2026 WPOS Tech</div>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from '../stores/auth';
import { useThemeStore } from '../stores/theme';
import ThemePicker from '../components/ThemePicker.vue';

interface TabItem {
  title: string;
  path: string;
  icon: string;
  closable: boolean;
}

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const themeStore = useThemeStore();
themeStore.initTheme();

const drawer = ref(false);

const empresaNombre = computed(() => {
  return 'Sucursal Principal';
});

// Mapa de rutas a títulos e íconos para las pestañas
const routeMap: Record<string, { title: string; icon: string }> = {
  '/dashboard': { title: 'Dashboard', icon: 'dashboard' },
  '/users': { title: 'Usuarios', icon: 'people' },
  
  // Entradas
  '/entradas/listado-compras': { title: 'Listado Compras', icon: 'receipt' },
  '/entradas/nueva-compra': { title: 'Nueva Compra', icon: 'add_shopping_cart' },
  '/entradas/listado-cxp': { title: 'Listado CXP', icon: 'account_balance_wallet' },
  '/entradas/movimiento-facturas': { title: 'Movimiento Facturas', icon: 'summarize' },

  // Salidas
  '/salidas/facturas': { title: 'Facturador', icon: 'receipt_long' },
  '/salidas/listado-facturas': { title: 'Listado de Facturas', icon: 'list_alt' },

  // Inventario
  '/inventario/ajuste': { title: 'Ajuste Inventario', icon: 'tune' },
  '/inventario/general': { title: 'Inventario General', icon: 'inventory' },
  '/inventario/listado-ajustes': { title: 'Listado Ajustes', icon: 'fact_check' },
  '/inventario/listado-inventario': { title: 'Listado Inventario', icon: 'inventory_2' },
  '/inventario/items-sin-inventario': { title: 'Items Sin Inventario', icon: 'running_with_errors' },
  '/inventario/listado-traslados': { title: 'Listado Traslados', icon: 'local_shipping' },
  '/inventario/movimiento-items': { title: 'Movimiento Items', icon: 'swap_horiz' },
  '/inventario/movimiento-items-filtrar': { title: 'Movimiento Items Filtrar', icon: 'filter_alt' },
  '/inventario/recibir-traslado': { title: 'Recibir Traslado', icon: 'call_received' },
  '/inventario/valor-inventario': { title: 'Valor Inventario', icon: 'attach_money' },
  '/inventario/traslado-inventario': { title: 'Traslado Inventario', icon: 'move_to_inbox' },

  // Maestros
  '/maestros/medios-pago': { title: 'Medios de pago', icon: 'payments' },
  '/maestros/colores': { title: 'Colores', icon: 'palette' },
  '/maestros/documentos': { title: 'Documentos', icon: 'description' },
  '/maestros/empleados': { title: 'Empleados', icon: 'badge' },
  '/maestros/grupos-items': { title: 'Grupos Items', icon: 'category' },
  '/maestros/tipo-iva': { title: 'Tipo IVA', icon: 'percent' },
  '/maestros/tallas': { title: 'Tallas', icon: 'straighten' },
  '/maestros/items': { title: 'Items', icon: 'shopping_bag' },
  '/maestros/proveedores': { title: 'Proveedores', icon: 'store' },
  '/maestros/clientes': { title: 'Clientes', icon: 'person' },
};

// Estado de pestañas abiertas
const openTabs = ref<TabItem[]>([
  { title: 'Dashboard', path: '/dashboard', icon: 'dashboard', closable: false }
]);
const activeTabPath = ref('/dashboard');

function addOrActivateTab(path: string) {
  if (!path || path === '/login' || path === '/') return;

  const info = routeMap[path] || {
    title: path.split('/').pop()?.replace(/-/g, ' ') || 'Pestaña',
    icon: 'folder'
  };

  const existing = openTabs.value.find((t) => t.path === path);
  if (!existing) {
    openTabs.value.push({
      title: info.title,
      path: path,
      icon: info.icon,
      closable: path !== '/dashboard'
    });
  }
  activeTabPath.value = path;
}

watch(
  () => route.path,
  (newPath) => {
    addOrActivateTab(newPath);
  },
  { immediate: true }
);

function selectTab(path: string) {
  activeTabPath.value = path;
  if (route.path !== path) {
    void router.push(path);
  }
}

function closeTab(path: string) {
  const index = openTabs.value.findIndex((t) => t.path === path);
  if (index === -1) return;

  const isCurrent = activeTabPath.value === path;
  openTabs.value.splice(index, 1);

  if (isCurrent) {
    const nextTab = openTabs.value[Math.max(0, index - 1)] || openTabs.value[0];
    if (nextTab) {
      selectTab(nextTab.path);
    } else {
      selectTab('/dashboard');
    }
  }
}

function closeOtherTabs(targetPath: string) {
  openTabs.value = openTabs.value.filter((t) => t.path === targetPath || !t.closable);
  selectTab(targetPath);
}

function closeAllTabs() {
  openTabs.value = openTabs.value.filter((t) => !t.closable);
  if (openTabs.value.length > 0) {
    selectTab(openTabs.value[0].path);
  } else {
    selectTab('/dashboard');
  }
}

function handleLogout() {
  $q.dialog({
    title: 'Cerrar sesión',
    message: '¿Estás seguro que deseas salir del sistema?',
    cancel: { flat: true, color: 'grey' },
    ok: { flat: true, color: 'red', label: 'Sí, Salir' },
    class: 'glass-card text-white bg-dark'
  }).onOk(() => {
    authStore.logout();
    void router.push('/login');
  });
}
</script>

<style lang="scss">
.q-drawer {
  border-right: 1px solid rgba(0,0,0,0.05);
}
.body--dark .q-drawer {
  border-right: 1px solid rgba(255,255,255,0.1);
}

.rounded-borders {
  border-radius: 12px;
}

.page-background {
    background: var(--q-primary, #1976D2);    
}
.body--dark .page-background {
    background: #121212;    
}

.text-color{
  color: white;  
}

.hover-close-btn:hover {
  color: #ef4444 !important;
}

.tab-item {
  transition: background-color 0.2s ease;
}

hr{
  border: 1px #2a5298 solid;  
}
.body--dark hr {
  border-color: #444;
}

.body--dark .q-item.q-router-link--active {
  background: rgba(255, 255, 255, 0.15) !important;
  color: #90caf9 !important;
}
</style>
