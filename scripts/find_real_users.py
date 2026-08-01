import psycopg2
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path='d:/huellas/backend/.env')

def check_users():
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
        cur.execute("SELECT usuario, name FROM usuarios WHERE usuario IS NOT NULL LIMIT 10")
        rows = cur.fetchall()
        print(f"FOUND {len(rows)} USERS WITH LOGIN NAME:")
        for r in rows:
            print(f"  '{r[0]}' ({r[1]})")
        
        if len(rows) == 0:
            print("NO USERS HAVE A 'usuario' SET. Checking 'email' for sample...")
            cur.execute("SELECT email, name FROM usuarios WHERE email IS NOT NULL LIMIT 10")
            for r in cur.fetchall():
                print(f"  EMAIL: '{r[0]}' ({r[1]})")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_users()
