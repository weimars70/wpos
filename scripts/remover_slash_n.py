import os

LAYOUT_FILE = "d:/huellas/frontend/src/layouts/MainLayout.vue"

def clean_layout():
    with open(LAYOUT_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    # Reemplazamos el literal \n que se coló en el HTML
    content = content.replace("\\n          <q-item", "\n          <q-item")

    with open(LAYOUT_FILE, "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == '__main__':
    clean_layout()
    print("Limpieza de \\n literales en MainLayout.vue completada.")
