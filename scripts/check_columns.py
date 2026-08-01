import psycopg2

try:
    conn = psycopg2.connect(
        host="2.58.80.90",
        port=55433,
        user="weymars",
        password="##LosHijos162025?!##",
        database="wpos"
    )

    cur = conn.cursor()
    output_info = []
    
    table_names = ['view_compras', 'salidas_movimientos']
    
    for table_name in table_names:
        cur.execute(f"SELECT column_name FROM information_schema.columns WHERE table_name = '{table_name}' ORDER BY ordinal_position;")
        cols = [c[0] for c in cur.fetchall()]
        output_info.append(f"TABLE: {table_name}")
        output_info.append(", ".join(cols))
        output_info.append("-" * 20)

    cur.close()
    conn.close()
    
    with open("db_info.txt", "w") as f:
        f.write("\n".join(output_info))
    print("Info saved to db_info.txt")
except Exception as e:
    with open("db_info_error.txt", "w") as f:
        f.write(str(e))
    print("Error occurred, check db_info_error.txt")
