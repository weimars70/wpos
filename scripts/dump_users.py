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
        
        conn = psycopg2.connect(
            host=host, port=port, user=user, password=pw, database=dbname
        )
        cur = conn.cursor()
        
        cur.execute("SELECT * FROM usuarios LIMIT 5")
        colnames = [desc[0] for desc in cur.description]
        rows = cur.fetchall()
        
        print(f"COLUMNS: {colnames}")
        for row in rows:
            print(f"ROW: {dict(zip(colnames, row))}")
            
        cur.close()
        conn.close()
    except Exception as e:
        print(f"DB_ERROR: {e}")

if __name__ == "__main__":
    test_data()
