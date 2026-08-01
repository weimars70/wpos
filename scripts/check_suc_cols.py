import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def info():
    try:
        user = os.getenv('POSTGRES_USER').strip("'") if os.getenv('POSTGRES_USER') else None
        pw = os.getenv('POSTGRES_PASSWORD').strip("'") if os.getenv('POSTGRES_PASSWORD') else None
        conn = psycopg2.connect(
            host=os.getenv('POSTGRES_HOST'),
            port=os.getenv('POSTGRES_PORT', 5432),
            user=user,
            password=pw,
            database=os.getenv('POSTGRES_DB')
        )
        cur = conn.cursor()
        
        # Check sucursales
        cur.execute("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'sucursales'")
        print("COLUMNS sucursales:", cur.fetchall())
        cur.execute("SELECT * FROM sucursales LIMIT 3")
        print("SAMPLE sucursales:", cur.fetchall())

        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    info()
