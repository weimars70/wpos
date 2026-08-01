import psycopg2
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path='d:/huellas/backend/.env')

def test_data():
    try:
        user = os.getenv('POSTGRES_USER').strip("'")
        pw = os.getenv('POSTGRES_PASSWORD').strip("'")
        host = os.getenv('POSTGRES_HOST')
        port = os.getenv('POSTGRES_PORT', 5432)
        dbname = os.getenv('POSTGRES_DB')
        
        print(f"Connecting to {host}:{port} ({dbname}) as {user}...")
        
        conn = psycopg2.connect(
            host=host,
            port=port,
            user=user,
            password=pw,
            database=dbname
        )
        cur = conn.cursor()
        
        # Get users
        cur.execute("SELECT usuario, empresa_id FROM usuarios LIMIT 10")
        users = cur.fetchall()
        print("\n=== USUARIOS ===")
        for u in users:
            print(f"User: {u[0]}, EmpresaID: {u[1]}")
            
        # Get companies
        cur.execute("SELECT id, nombre FROM empresas LIMIT 10")
        companies = cur.fetchall()
        print("\n=== EMPRESAS ===")
        for c in companies:
            print(f"ID: {c[0]}, Nombre: {c[1]}")

        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_data()
