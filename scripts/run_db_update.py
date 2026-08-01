import psycopg2
import os
from dotenv import load_dotenv

load_dotenv('d:/huellas/backend/.env')

def run_sql(sql_file):
    try:
        conn = psycopg2.connect(
            host=os.getenv('POSTGRES_HOST', 'localhost'),
            port=os.getenv('POSTGRES_PORT', '5432'),
            database=os.getenv('POSTGRES_DB', 'wpos'),
            user=os.getenv('POSTGRES_USER', 'postgres'),
            password=os.getenv('POSTGRES_PASSWORD', '')
        )
        cur = conn.cursor()
        with open(sql_file, 'r') as f:
            cur.execute(f.read())
        conn.commit()
        cur.close()
        conn.close()
        print("SQL executed successfully.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    run_sql('d:/huellas/db/view_salidas.sql')
