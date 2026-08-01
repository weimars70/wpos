import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def get_cols():
    try:
        conn = psycopg2.connect(
            host=os.getenv('POSTGRES_HOST'),
            port=os.getenv('POSTGRES_PORT'),
            user=os.getenv('POSTGRES_USER').strip("'"),
            password=os.getenv('POSTGRES_PASSWORD').strip("'"),
            database=os.getenv('POSTGRES_DB')
        )
        cur = conn.cursor()
        
        cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'sucursales'")
        cols = [c[0] for c in cur.fetchall()]
        print("COLUMNS IN sucursales:")
        for c in cols:
            print(f"- {c}")

        cur.execute("SELECT * FROM sucursales LIMIT 1")
        row = cur.fetchone()
        print(f"SAMPLE ROW: {row}")

        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    get_cols()
