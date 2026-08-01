import psycopg2
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path='d:/huellas/backend/.env')

def check_items():
    try:
        user = os.getenv('POSTGRES_USER').strip("'")
        pw = os.getenv('POSTGRES_PASSWORD').strip("'")
        conn = psycopg2.connect(
            host=os.getenv('POSTGRES_HOST'),
            port=os.getenv('POSTGRES_PORT'),
            user=user,
            password=pw,
            database=os.getenv('POSTGRES_DB')
        )
        cur = conn.cursor()
        
        # Check columns of items table
        cur.execute("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'items'")
        cols = cur.fetchall()
        print(f"COLUMNS IN 'items':")
        for c in cols:
            print(f"  - {c[0]} ({c[1]})")
        
        # Test the query provided by user manually
        q = 'A' # Common letter
        cur.execute("""
            SELECT item, descripcion, por_iva, ult_pcompra, ult_pventa 
            FROM items 
            WHERE (UPPER(item::text) LIKE UPPER(%s) OR UPPER(descripcion) LIKE UPPER(%s))
            LIMIT 5
        """, (f'%{q}%', f'%{q}%'))
        rows = cur.fetchall()
        print(f"\nTEST QUERY FOR '{q}' FOUND: {len(rows)} items.")
        for r in rows:
            print(f"  ITEM: {r[0]} | DESC: {r[1]}")

        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_items()
