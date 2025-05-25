import mysql.connector
from mysql.connector import Error
from typing import List, Dict, Optional, Tuple
from datetime import datetime
import json
from contextlib import contextmanager

class DatabaseManager:
    """Database manager for handling MySQL connections and queries"""
    
    def __init__(self, host: str, database: str, user: str, password: str, port: int = 3306):
        self.config = {
            'host': host,
            'database': database,
            'user': user,
            'password': password,
            'port': port,
            'autocommit': True
        }
    
    @contextmanager
    def get_connection(self):
        """Context manager for database connections"""
        conn = None
        try:
            conn = mysql.connector.connect(**self.config)
            yield conn
        except Error as e:
            if conn:
                conn.rollback()
            raise e
        finally:
            if conn and conn.is_connected():
                conn.close()
    
    def register_user(self, user_id: str, email: str, name: str, profile_pic_url: Optional[str] = None) -> bool:
        """Register a new user"""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                query = """
                    INSERT INTO users (user_id, email, name, profile_pic_url, created_at) 
                    VALUES (%s, %s, %s, %s, %s)
                """
                cursor.execute(query, (user_id, email, name, profile_pic_url, datetime.now()))
                return cursor.rowcount > 0
        except Error as e:
            print(f"Error registering user: {e}")
            return False
    
    def set_user_preferences(self, user_id: str, preferred_authors: List[int]) -> bool:
        """Set user preferences for authors"""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                
                # First, delete existing preferences
                cursor.execute("DELETE FROM user_preferences WHERE user_id = %s", (user_id,))
                
                # Insert new preferences
                for author_id in preferred_authors:
                    cursor.execute(
                        "INSERT INTO user_preferences (user_id, author_id) VALUES (%s, %s)",
                        (user_id, author_id)
                    )
                return True
        except Error as e:
            print(f"Error setting user preferences: {e}")
            return False
    
    def get_user_preferences(self, user_id: str) -> List[int]:
        """Get user's preferred author IDs"""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT author_id FROM user_preferences WHERE user_id = %s", (user_id,))
                return [row[0] for row in cursor.fetchall()]
        except Error as e:
            print(f"Error getting user preferences: {e}")
            return []
    
    def create_story(self, user_id: str, genre: str, title: str) -> Optional[int]:
        """Create a new story and return story_id"""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                query = "INSERT INTO stories (user_id, genre, title, created_at) VALUES (%s, %s, %s, %s)"
                cursor.execute(query, (user_id, genre, title, datetime.now()))
                return cursor.lastrowid
        except Error as e:
            print(f"Error creating story: {e}")
            return None
    
    def add_chapter(self, story_id: int, chapter_num: int, content: str, choices: List[str]) -> Optional[int]:
        """Add a chapter to a story"""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                query = """
                    INSERT INTO chapters (story_id, chapter_num, content, choices_json) 
                    VALUES (%s, %s, %s, %s)
                """
                choices_json = json.dumps(choices) if choices else None
                cursor.execute(query, (story_id, chapter_num, content, choices_json))
                return cursor.lastrowid
        except Error as e:
            print(f"Error adding chapter: {e}")
            return None
    
    def get_story_progress(self, user_id: str, story_id: int) -> Optional[Dict]:
        """Get current progress for a user's story"""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor(dictionary=True)
                query = """
                    SELECT sp.*, s.genre, s.title 
                    FROM story_progress sp
                    JOIN stories s ON sp.story_id = s.story_id
                    WHERE sp.user_id = %s AND sp.story_id = %s
                    ORDER BY sp.chapter_num DESC
                    LIMIT 1
                """
                cursor.execute(query, (user_id, story_id))
                return cursor.fetchone()
        except Error as e:
            print(f"Error getting story progress: {e}")
            return None
    
    def update_story_progress(self, user_id: str, story_id: int, chapter_num: int, choice: int) -> bool:
        """Update story progress"""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                query = """
                    INSERT INTO story_progress (user_id, story_id, chapter_num, choice, timestamp) 
                    VALUES (%s, %s, %s, %s, %s)
                """
                cursor.execute(query, (user_id, story_id, chapter_num, choice, datetime.now()))
                return cursor.rowcount > 0
        except Error as e:
            print(f"Error updating story progress: {e}")
            return False
    
    def get_user_stories(self, user_id: str) -> List[Dict]:
        """Get all stories for a user with their progress"""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor(dictionary=True)
                query = """
                    SELECT s.story_id, s.title, s.genre, s.created_at,
                           COALESCE(MAX(sp.chapter_num), 0) as current_chapter
                    FROM stories s
                    LEFT JOIN story_progress sp ON s.story_id = sp.story_id
                    WHERE s.user_id = %s
                    GROUP BY s.story_id, s.title, s.genre, s.created_at
                    ORDER BY s.created_at DESC
                """
                cursor.execute(query, (user_id,))
                return cursor.fetchall()
        except Error as e:
            print(f"Error getting user stories: {e}")
            return []
    
    def get_story_details(self, user_id: str, story_id: int, chapter_num: Optional[int] = None) -> Optional[Dict]:
        """Get story details including chapters up to specified chapter"""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor(dictionary=True)
                
                # Get story info
                story_query = "SELECT * FROM stories WHERE user_id = %s AND story_id = %s"
                cursor.execute(story_query, (user_id, story_id))
                story = cursor.fetchone()
                
                if not story:
                    return None
                
                # Get chapters
                if chapter_num:
                    chapters_query = """
                        SELECT * FROM chapters 
                        WHERE story_id = %s AND chapter_num <= %s 
                        ORDER BY chapter_num
                    """
                    cursor.execute(chapters_query, (story_id, chapter_num))
                else:
                    chapters_query = "SELECT * FROM chapters WHERE story_id = %s ORDER BY chapter_num"
                    cursor.execute(chapters_query, (story_id,))
                
                chapters = cursor.fetchall()
                
                # Parse choices JSON
                for chapter in chapters:
                    if chapter['choices_json']:
                        chapter['choices'] = json.loads(chapter['choices_json'])
                    else:
                        chapter['choices'] = []
                
                story['chapters'] = chapters
                return story
                
        except Error as e:
            print(f"Error getting story details: {e}")
            return None
    
    def get_genres(self) -> List[Dict]:
        """Get all available genres"""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor(dictionary=True)
                cursor.execute("SELECT * FROM genres")
                return cursor.fetchall()
        except Error as e:
            print(f"Error getting genres: {e}")
            return []
    
    def get_authors_by_genre(self, genre_id: int) -> List[Dict]:
        """Get authors for a specific genre"""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor(dictionary=True)
                cursor.execute("SELECT * FROM authors WHERE genre_id = %s", (genre_id,))
                return cursor.fetchall()
        except Error as e:
            print(f"Error getting authors by genre: {e}")
            return []
    
    def get_all_authors(self) -> List[Dict]:
        """Get all authors"""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor(dictionary=True)
                cursor.execute("SELECT * FROM authors")
                return cursor.fetchall()
        except Error as e:
            print(f"Error getting all authors: {e}")
            return []
