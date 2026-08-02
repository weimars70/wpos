<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-2">
    <q-header class="bg-white q-py-sm text-primary" style="border-bottom: 1px solid rgba(0,0,0,0.05)">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="drawer = !drawer" class="q-mr-sm" />
        <q-toolbar-title class="text-weight-bold text-primary">WOPOS</q-toolbar-title>
        
        <q-space />

        <div class="flex items-center q-gutter-sm">
          <q-chip outline color="primary" icon="business" class="gt-xs text-primary">
            {{ empresaNombre }}
          </q-chip>
          
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
      <hr>
    </q-header>
    
    <q-drawer
      v-model="drawer"
      show-if-above
      :width="260"
      class="page-background"
      >
      <div class="q-pa-md text-center q-mt-md">
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
          class="q-mx-sm rounded-borders text-white q-expansion-item-height"
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
        <div class="text-caption text-grey-4">© 2026 Huellas Tech</div>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition appear enter-active-class="animated fadeIn" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from '../stores/auth';

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();
const drawer = ref(false);

const empresaNombre = computed(() => {
  return 'Sucursal Principal';
});

function handleLogout() {
  $q.dialog({
    title: 'Cerrar sesión',
    message: '¿Estás seguro que deseas salir del sistema?',
    cancel: { flat: true, color: 'grey' },
    ok: { flat: true, color: 'red', label: 'Sí, Salir' },
    class: 'glass-card text-white bg-dark'
  }).onOk(() => {
    authStore.logout();
    router.push('/login');
  });
}
</script>

<style lang="scss">
.q-drawer {
  border-right: 1px solid rgba(0,0,0,0.05);
}
.rounded-borders {
  border-radius: 12px;
}

.page-background {
    background:#4682B4;    
}

.text-color{
  color: white;  
}

hr{
  border: 1px #2a5298 solid;  
}

.q-expansion-item-height{
  height: 70vh;
}

</style>
