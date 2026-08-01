import os

LAYOUT_FILE = "d:/huellas/frontend/src/layouts/MainLayout.vue"

original_layout = """<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-2">
    <q-header class="bg-white text-grey-9 q-py-sm" style="border-bottom: 1px solid rgba(0,0,0,0.05)">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="drawer = !drawer" class="q-mr-sm" />
        <q-toolbar-title class="text-weight-bold text-gradient">WOPOS</q-toolbar-title>
        
        <q-space />

        <div class="flex items-center q-gutter-sm">
          <q-chip outline color="primary" icon="business" class="gt-xs">
            {{ empresaNombre }}
          </q-chip>
          <q-btn flat round color="grey-7" icon="notifications">
            <q-badge floating color="red" rounded />
          </q-btn>
          <q-btn-dropdown flat no-caps stretch>
            <template #label>
              <q-avatar size="32px" class="q-mr-sm shadow-1">
                <img src="https://cdn.quasar.dev/img/avatar.png">
              </q-avatar>
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
    </q-header>

    <q-drawer
      v-model="drawer"
      show-if-above
      :width="260"
      class="bg-white"
    >
      <div class="q-pa-md text-center q-mt-md">
        <div class="text-h6 text-weight-bold text-primary">SISTEMA WPOS</div>
        <div class="text-caption text-grey-6">v1.2.0</div>
      </div>

      <q-list padding class="q-mt-md">
        <q-item clickable v-ripple to="/dashboard" active-class="bg-blue-1 text-primary shadow-1" class="q-mx-sm rounded-borders q-mb-xs">
          <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
          <q-item-section class="text-weight-medium">Dashboard</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/users" active-class="bg-blue-1 text-primary shadow-1" class="q-mx-sm rounded-borders q-mb-xs">
          <q-item-section avatar><q-icon name="people" /></q-item-section>
          <q-item-section class="text-weight-medium">Usuarios</q-item-section>
        </q-item>

        <q-expansion-item
          icon="shopping_cart"
          label="Salidas"
          class="q-mx-sm rounded-borders"
          header-class="text-weight-medium text-grey-8"
        >
          <q-item clickable v-ripple to="/salidas/facturas" active-class="bg-blue-1 text-primary" class="rounded-borders q-ml-md q-mr-sm q-mb-xs">
            <q-item-section avatar><q-icon name="receipt_long" size="xs" /></q-item-section>
            <q-item-section>Facturador</q-item-section>
          </q-item>
        </q-expansion-item>
{maestros_menu}
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
  // Aquí podríamos buscar el nombre real en base al ID almacenado
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
</style>
"""

entities = [
    {"name": "Medios de pago", "path": "medios-pago", "component": "MediosPagoPage"},
    {"name": "Colores", "path": "colores", "component": "ColoresPage"},
    {"name": "Documentos", "path": "documentos", "component": "DocumentosPage"},
    {"name": "Empleados", "path": "empleados", "component": "EmpleadosPage"},
    {"name": "Grupos Items", "path": "grupos-items", "component": "GruposItemsPage"},
    {"name": "Tipo Iva", "path": "tipo-iva", "component": "TipoIvaPage"},
    {"name": "Listado Items", "path": "listado-items", "component": "ListadoItemsPage"},
    {"name": "Listado Items Inactivos", "path": "listado-items-inactivos", "component": "ListadoItemsInactivosPage"},
    {"name": "Items", "path": "items", "component": "ItemsPage"},
    {"name": "Proveedores", "path": "proveedores", "component": "ProveedoresPage"},
    {"name": "Clientes", "path": "clientes", "component": "ClientesPage"},
]

def render_menu():
    menu_items = "\\n".join([
        f'''          <q-item clickable v-ripple to="/maestros/{e['path']}" active-class="bg-blue-1 text-primary" class="rounded-borders q-ml-md q-mr-sm q-mb-xs">
            <q-item-section avatar><q-icon name="arrow_right" size="xs" /></q-item-section>
            <q-item-section>{e['name']}</q-item-section>
          </q-item>'''
        for e in entities
    ])
    
    return f"""
        <q-expansion-item
          icon="folder_special"
          label="Maestros"
          class="q-mx-sm rounded-borders"
          header-class="text-weight-medium text-grey-8"
        >
{menu_items}
        </q-expansion-item>
"""

if __name__ == '__main__':
    with open(LAYOUT_FILE, "w", encoding="utf-8") as f:
        f.write(original_layout.replace('{maestros_menu}', render_menu()))
    print("Layout restaurado y reparado!")
