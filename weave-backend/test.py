import os
import mysql.connector
from dotenv import load_dotenv

def test_mysql_connection():
    # Load environment variables
    load_dotenv()
    
    try:
        # Connect to MySQL database
        conn = mysql.connector.connect(
            host=os.getenv('DB_HOST'),
            port=os.getenv('DB_PORT', 3306),
            database=os.getenv('DB_NAME'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD')
        )
        
        cursor = conn.cursor()
        cursor.execute("SELECT VERSION()")
        version = cursor.fetchone()
        
        print("✅ MySQL connection successful!")
        print(f"Database version: {version[0]}")

        cursor.execute("show databases")
        print(cursor.fetchall())
        
        cursor.close()
        conn.close()
        
    except mysql.connector.Error as e:
        print(f"❌ Connection failed: {e}")

if __name__ == "__main__":
    test_mysql_connection()
