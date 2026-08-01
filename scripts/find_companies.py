import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def find_company_table():
    try:
        conn = psycopg2.connect(
            host=os.getenv('POSTGRES_HOST'),
            port=os.getenv('POSTGRES_PORT'),
            user=os.getenv('POSTGRES_USER').strip("'"),
            password=os.getenv('POSTGRES_PASSWORD').strip("'"),
            database=os.getenv('POSTGRES_DB')
        )
        cur = conn.cursor()
        
        # Find tables
        cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
        tables = [t[0] for t in cur.fetchall()]
        
        matches = [t for t in tables if 'sucur' in t.lower() or 'empresa' in t.lower()]
        print(f"Matches: {matches}")
        
        for table in matches:
            cur.execute(f"SELECT column_name FROM information_schema.columns WHERE table_name = '{table}'")
            cols = [c[0] for c in cur.fetchall()]
            print(f"Table: {table} | Columns: {cols}")
            
            cur.execute(f"SELECT * FROM {table} LIMIT 1")
            print(f"Sample: {cur.fetchone()}")

        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    find_company_table()
