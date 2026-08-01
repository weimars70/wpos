import json
import os

def update_frontend_package():
    filepath = 'd:/huellas/frontend/package.json'
    print(f"Leyendo {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    script_dev = data.get('scripts', {}).get('dev', '')
    if script_dev and 'kill-port' not in script_dev:
        data['scripts']['dev'] = f"npx kill-port 9000 && {script_dev}"
        print("Actualizando frontend: script dev")
    else:
        print("Frontend: script dev ya tiene kill-port configurado o no existe")

    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

def update_backend_package():
    filepath = 'd:/huellas/backend/package.json'
    print(f"Leyendo {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    script_start = data.get('scripts', {}).get('start', '')
    if script_start and 'kill-port' not in script_start:
        data['scripts']['start'] = f"npx kill-port 3000 && {script_start}"
        print("Actualizando backend: script start")
    else:
        print("Backend: script start ya tiene kill-port configurado o no existe")

    script_start_dev = data.get('scripts', {}).get('start:dev', '')
    if script_start_dev and 'kill-port' not in script_start_dev:
        data['scripts']['start:dev'] = f"npx kill-port 3000 && {script_start_dev}"
        print("Actualizando backend: script start:dev")
    else:
        print("Backend: script start:dev ya tiene kill-port configurado o no existe")

    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

if __name__ == '__main__':
    update_frontend_package()
    update_backend_package()
    print("Modificaci\u00f3n de comandos en package.json completada correctamente.")
