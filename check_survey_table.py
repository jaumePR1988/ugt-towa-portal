import psycopg2
import sys

try:
    conn = psycopg2.connect(
        host="db.zaxdscclkeytakcowgww.supabase.co",
        database="postgres",
        user="postgres.zaxdscclkeytakcowgww",
        password="tQfqWlmG9Ioq0Pcp",
        port=5432
    )
    
    cur = conn.cursor()
    
    # Consultar estructura de la tabla
    cur.execute("""
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'survey_responses' 
        ORDER BY ordinal_position;
    """)
    
    print("Estructura de la tabla survey_responses:")
    print("-" * 80)
    for row in cur.fetchall():
        print(f"{row[0]:<30} {row[1]:<20} NULL:{row[2]:<5} DEFAULT:{row[3]}")
    
    print("\n" + "=" * 80)
    print("Políticas RLS:")
    print("-" * 80)
    
    cur.execute("""
        SELECT policyname, cmd, permissive, roles
        FROM pg_policies 
        WHERE tablename = 'survey_responses'
        ORDER BY policyname;
    """)
    
    for row in cur.fetchall():
        print(f"Policy: {row[0]}")
        print(f"  Command: {row[1]}")
        print(f"  Permissive: {row[2]}")
        print(f"  Roles: {row[3]}")
        print()
    
    cur.close()
    conn.close()
    
except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    sys.exit(1)
