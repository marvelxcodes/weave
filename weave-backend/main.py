from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import os
from datetime import datetime

from dotenv import load_dotenv
load_dotenv()

# Import our modules
from database import DatabaseManager
from story_generator import StoryGenerator
from data_models import GenreAuthors, CustomPrompts, StoryChapter
from pydantic_models import (
    UserRegistration, StoryGeneration, StoryContinuation,
    GenreResponse, AuthorResponse, SuggestionResponse, ChapterResponse,
    StoryResponse, UserStoryResponse, StoryDetailResponse,
    SuccessResponse, ErrorResponse
)

# Initialize FastAPI app
app = FastAPI(title="Interactive Story Generator API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure as needed for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration - These should be environment variables in production
DATABASE_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'database': 'weave',
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'port': int(os.getenv('DB_PORT', 3306))
}

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'AIzaSyDkC3uecLUthMZ2VI-0oqBUFW4QLy_XtvI')

# Initialize components
db_manager = DatabaseManager(**DATABASE_CONFIG)
story_generator = StoryGenerator(GEMINI_API_KEY)
genre_authors = GenreAuthors()
custom_prompts = CustomPrompts()

# Dependency to get database manager
def get_db():
    return db_manager

# API Routes

@app.post("/register", response_model=SuccessResponse)
async def register_user(user_data: UserRegistration, db: DatabaseManager = Depends(get_db)):
    """Register a new user with their preferences"""
    try:
        # Register user
        user_created = db.register_user(
            user_data.user_id, 
            user_data.email, 
            user_data.name, 
            user_data.profile_pic_url
        )
        
        if not user_created:
            raise HTTPException(status_code=400, detail="Failed to create user")
        
        # Set preferences if provided
        if user_data.preferred_authors:
            prefs_set = db.set_user_preferences(user_data.user_id, user_data.preferred_authors)
            if not prefs_set:
                # User created but preferences failed - still return success
                return SuccessResponse(success=True, message="User registered but preferences could not be set")
        
        return SuccessResponse(success=True, message="User registered successfully")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@app.post("/story/generate", response_model=StoryResponse)
async def generate_story(story_data: StoryGeneration, db: DatabaseManager = Depends(get_db)):
    """Generate a new story for the user"""
    try:
        # For now, we'll use hardcoded author selection
        # In a full implementation, you'd want to get user preferences
        authors = genre_authors.get_authors_for_genre(story_data.genre)
        if not authors:
            raise HTTPException(status_code=400, detail=f"No authors found for genre: {story_data.genre}")
        
        # Select first author for simplicity - you could implement preference logic here
        selected_author = authors[0]
        
        # Generate story title
        story_title = f"{story_data.genre.title()} Adventure"
        
        # Create story in database
        story_id = db.create_story(story_data.user_id, story_data.genre, story_title)
        if not story_id:
            raise HTTPException(status_code=500, detail="Failed to create story in database")
        
        # Generate first chapter
        first_chapter_content = story_generator.generate_first_chapter(
            story_data.genre, 
            selected_author, 
            story_data.custom_prompt
        )
        
        if first_chapter_content.startswith("Error:"):
            raise HTTPException(status_code=500, detail="Failed to generate story content")
        
        # Parse the generated content
        chapter_text, choices = story_generator.parse_chapter_content(first_chapter_content)
        
        # Save chapter to database
        chapter_id = db.add_chapter(story_id, 1, chapter_text, choices)
        if not chapter_id:
            raise HTTPException(status_code=500, detail="Failed to save chapter to database")

        progress_updated = db.update_story_progress(
            story_data.user_id, 
            story_id,
            1, 
            1
        )
        
        if not progress_updated:
            raise HTTPException(status_code=500, detail="Failed to update story progress")

        # Return response
        return StoryResponse(
            story_id=story_id,
            title=story_title,
            genre=story_data.genre,
            chapters=[ChapterResponse(chapter_num=1, content=chapter_text, choices=choices)],
            current_chapter=1
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Story generation failed: {str(e)}")

@app.post("/story/continue", response_model=ChapterResponse)
async def continue_story(continuation_data: StoryContinuation, db: DatabaseManager = Depends(get_db)):
    """Continue an existing story based on user choice"""
    try:
        # Get current story progress
        progress = db.get_story_progress(continuation_data.user_id, continuation_data.story_id)
        if not progress:
            raise HTTPException(status_code=404, detail="Story progress not found")
        
        current_chapter = progress['chapter_num']
        next_chapter = current_chapter + 1
        
        # Get story details to build context
        story_details = db.get_story_details(continuation_data.user_id, continuation_data.story_id, current_chapter)
        if not story_details:
            raise HTTPException(status_code=404, detail="Story not found")
        
        # Build previous chapters for context
        previous_chapters = []
        for chapter_data in story_details['chapters']:
            chapter = StoryChapter(
                chapter=chapter_data['chapter_num'],
                content=chapter_data['content'],
                genre=story_details['genre'],
                custom_prompt=None  # Could be stored if needed
            )
            previous_chapters.append(chapter)
        
        # Determine choice (convert A/B to 0/1 for database)
        choice_index = 0 if continuation_data.choice.upper().startswith('A') else 1
        
        # Update progress with the choice made
        progress_updated = db.update_story_progress(
            continuation_data.user_id, 
            continuation_data.story_id, 
            current_chapter+1, 
            choice_index
        )
        
        if not progress_updated:
            raise HTTPException(status_code=500, detail="Failed to update story progress")
        
        # Use hardcoded author for genre (same logic as generate)
        authors = genre_authors.get_authors_for_genre(story_details['genre'])
        selected_author = authors[0] if authors else "Unknown Author"
        
        # Generate next chapter
        next_chapter_content = story_generator.generate_next_chapter(
            previous_chapters,
            continuation_data.choice,
            story_details['genre'],
            selected_author,
            next_chapter
        )
        
        if next_chapter_content.startswith("Error:"):
            raise HTTPException(status_code=500, detail="Failed to generate next chapter")
        
        # Parse the generated content
        chapter_text, choices = story_generator.parse_chapter_content(next_chapter_content)
        
        # Save new chapter to database
        chapter_id = db.add_chapter(continuation_data.story_id, next_chapter, chapter_text, choices)
        if not chapter_id:
            raise HTTPException(status_code=500, detail="Failed to save chapter to database")
        
        return ChapterResponse(
            chapter_num=next_chapter,
            content=chapter_text,
            choices=choices
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Story continuation failed: {str(e)}")

@app.get("/story", response_model=List[UserStoryResponse])
async def get_user_stories(user_id: str, db: DatabaseManager = Depends(get_db)):
    """Get all stories for a user"""
    try:
        stories = db.get_user_stories(user_id)
        return [
            UserStoryResponse(
                story_id=story['story_id'],
                title=story['title'],
                genre=story['genre'],
                current_chapter=story['current_chapter'],
                created_at=story['created_at']
            )
            for story in stories
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve stories: {str(e)}")

@app.get("/story/{story_id}", response_model=StoryDetailResponse)
async def get_story_details(story_id: int, user_id: str, chapter_num: Optional[int] = None, 
                           db: DatabaseManager = Depends(get_db)):
    """Get detailed story information including chapters"""
    try:
        story_details = db.get_story_details(user_id, story_id, chapter_num)
        if not story_details:
            raise HTTPException(status_code=404, detail="Story not found")
        
        # Format story content as readable text
        story_content = f"**{story_details['title']}**\n"
        story_content += f"*Genre: {story_details['genre']}*\n\n"
        
        current_chapter = 0
        for chapter in story_details['chapters']:
            story_content += f"**Chapter {chapter['chapter_num']}**\n"
            story_content += f"{chapter['content']}\n\n"
            current_chapter = max(current_chapter, chapter['chapter_num'])
            
            if chapter['choices']:
                story_content += "**Choose your path:**\n"
                for i, choice in enumerate(chapter['choices']):
                    letter = chr(65 + i)  # A, B, C, etc.
                    story_content += f"{letter}) {choice}\n"
                story_content += "\n"
        
        return StoryDetailResponse(
            story_id=story_details['story_id'],
            title=story_details['title'],
            genre=story_details['genre'],
            created_at=story_details['created_at'],
            current_chapter=current_chapter,
            story_content=story_content
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve story details: {str(e)}")

@app.get("/suggestions", response_model=List[SuggestionResponse])
async def get_story_suggestions(genre: Optional[str] = None):
    """Get story prompt suggestions by genre"""
    try:
        if genre:
            # Get suggestions for specific genre
            prompts = custom_prompts.get_prompts_for_genre(genre)
            if not prompts:
                raise HTTPException(status_code=404, detail=f"No suggestions found for genre: {genre}")
            return [SuggestionResponse(genre=genre, prompts=prompts)]
        else:
            # Get suggestions for all genres
            all_genres = custom_prompts.get_all_genres()
            suggestions = []
            for g in all_genres:
                prompts = custom_prompts.get_prompts_for_genre(g)
                suggestions.append(SuggestionResponse(genre=g, prompts=prompts))
            return suggestions
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve suggestions: {str(e)}")

@app.get("/genres", response_model=List[GenreResponse])
async def get_genres(db: DatabaseManager = Depends(get_db)):
    """Get all available genres"""
    try:
        # Try to get from database first
        db_genres = db.get_genres()
        if db_genres:
            return [GenreResponse(genre_id=g['genre_id'], genre_name=g['genre_name']) for g in db_genres]
        
        # Fallback to hardcoded genres if database is empty
        hardcoded_genres = genre_authors.get_all_genres()
        return [
            GenreResponse(genre_id=i+1, genre_name=genre.title()) 
            for i, genre in enumerate(hardcoded_genres)
        ]
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve genres: {str(e)}")

@app.get("/authors", response_model=List[AuthorResponse])
async def get_authors(genre_id: Optional[int] = None, db: DatabaseManager = Depends(get_db)):
    """Get authors, optionally filtered by genre"""
    try:
        if genre_id:
            # Get authors for specific genre from database
            db_authors = db.get_authors_by_genre(genre_id)
            if db_authors:
                return [
                    AuthorResponse(author_id=a['author_id'], author_name=a['author_name'], genre_id=a['genre_id'])
                    for a in db_authors
                ]
        else:
            # Get all authors from database
            db_authors = db.get_all_authors()
            if db_authors:
                return [
                    AuthorResponse(author_id=a['author_id'], author_name=a['author_name'], genre_id=a.get('genre_id'))
                    for a in db_authors
                ]
        
        # Fallback to hardcoded authors if database is empty
        hardcoded_authors = []
        author_id = 1
        for genre, authors in genre_authors.AUTHORS_BY_GENRE.items():
            for author in authors:
                hardcoded_authors.append(
                    AuthorResponse(author_id=author_id, author_name=author, genre_id=None)
                )
                author_id += 1
        
        return hardcoded_authors
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve authors: {str(e)}")

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
