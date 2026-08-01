import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def get_db_info():
    try:
        conn = psycopg2.connect(
            host=os.getenv('POSTGRES_HOST'),
            port=os.getenv('POSTGRES_PORT'),
            user=os.getenv('POSTGRES_USER').strip("'"),
            password=os.getenv('POSTGRES_PASSWORD').strip("'"),
            database=os.getenv('POSTGRES_DB')
        )
        cur = conn.cursor()
        
        cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
        tables = [t[0] for t in cur.fetchall()]
        print("ALL TABLES:")
        for t in sorted(tables):
            print(f"- {t}")

        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    get_db_info()
