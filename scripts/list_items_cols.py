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
        cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'items'")
        cols = [c[0] for c in cur.fetchall()]
        print(f"COLUMNS: {cols}")
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_items()
