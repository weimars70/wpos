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
        
        print("QUERYING USERS...")
        cur.execute("SELECT usuario, name FROM usuarios LIMIT 5")
        for r in cur.fetchall():
            print(f"USER_LOGIN: '{r[0]}', FULLNAME: '{r[1]}'")
            
        cur.close()
        conn.close()
    except Exception as e:
        print(f"DB_ERROR: {e}")

if __name__ == "__main__":
    test_data()
