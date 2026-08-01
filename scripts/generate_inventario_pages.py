import os

pages = [
    ("AjusteInventarioPage.vue", "Ajuste de Inventario"),
    ("InventarioGeneralPage.vue", "Inventario General"),
    ("ListadoAjustesPage.vue", "Listado de Ajustes"),
    ("ListadoInventarioPage.vue", "Listado de Inventario"),
    ("ListadoTrasladosPage.vue", "Listado de Traslados"),
    ("MovimientoItemsPage.vue", "Movimiento de Items"),
    ("MovimientoItemsFiltrarPage.vue", "Movimiento de Items Filtrar"),
    ("RecibirTrasladoPage.vue", "Recibir Traslado de Inventario"),
    ("ValorInventarioPage.vue", "Valor de Inventario"),
    ("TrasladoInventarioPage.vue", "Traslado de Inventario")
]

base_path = r"d:\huellas\frontend\src\pages\inventario"

if not os.path.exists(base_path):
    os.makedirs(base_path)

template = """<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card class="glass-card shadow-1 rounded-borders">
          <q-card-section>
            <div class="text-h5 text-weight-bold text-primary">{title}</div>
            <div class="text-subtitle2 text-grey-6">Módulo de Inventario</div>
          </q-card-section>
          
          <q-separator />
          
          <q-card-section class="q-pa-xl text-center">
            <q-icon name="inventory_2" size="100px" color="grey-3" />
            <div class="text-h6 text-grey-5 q-mt-md">Esta página está en desarrollo</div>
            <div class="text-body2 text-grey-4">Próximamente verás aquí el contenido de {title}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
// Lógica de la página {title}
</script>

<style scoped>
.glass-card {{
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.05);
}}
</style>
"""

for filename, title in pages:
    file_path = os.path.join(base_path, filename)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(template.format(title=title))
    print(f"Created: {file_path}")
