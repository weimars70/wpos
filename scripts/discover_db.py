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
        
        # List tables that might contain company/branch info
        cur.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND (table_name ILIKE '%empresa%' OR table_name ILIKE '%sucursal%' OR table_name ILIKE '%local%')
        """)
        tables = cur.fetchall()
        print(f"Candidate tables: {tables}")
        
        for table in tables:
            t_name = table[0]
            print(f"\n--- Columns in {t_name} ---")
            cur.execute(f"SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '{t_name}'")
            cols = cur.fetchall()
            for col in cols:
                print(f"  {col[0]} ({col[1]})")
            
            # Sample data
            print(f"--- Sample data in {t_name} ---")
            cur.execute(f"SELECT * FROM {t_name} LIMIT 5")
            rows = cur.fetchall()
            for row in rows:
                print(f"  {row}")

        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    get_db_info()
