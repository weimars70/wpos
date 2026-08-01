import psycopg2
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path='d:/huellas/backend/.env')

def check_pass():
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
        cur.execute("SELECT password_hash FROM usuarios WHERE email = 'weimars70@gmail.com' OR usuario = 'weimars70@gmail.com' LIMIT 1")
        row = cur.fetchone()
        if row:
            p_hash = row[0]
            print(f"STORED_HASH: '{p_hash}'")
            if p_hash.startswith('$2b$'):
                print("TYPE: bcrypt")
            else:
                print("TYPE: unknown/plaintext/md5")
        else:
            print("USER_NOT_FOUND")
            
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_pass()
