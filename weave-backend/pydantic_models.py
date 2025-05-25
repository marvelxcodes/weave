from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Request Models
class UserRegistration(BaseModel):
    user_id: str
    email: str
    name: str
    profile_pic_url: Optional[str] = None
    preferred_authors: List[int] = []

class StoryGeneration(BaseModel):
    user_id: str
    genre: str
    custom_prompt: Optional[str] = None

class StoryContinuation(BaseModel):
    user_id: str
    story_id: int
    choice: str  # "A" or "B" or full choice text

# Response Models
class GenreResponse(BaseModel):
    genre_id: int
    genre_name: str

class AuthorResponse(BaseModel):
    author_id: int
    author_name: str
    genre_id: Optional[int] = None

class SuggestionResponse(BaseModel):
    genre: str
    prompts: List[str]

class ChapterResponse(BaseModel):
    chapter_num: int
    content: str
    choices: List[str]

class StoryResponse(BaseModel):
    story_id: int
    title: str
    genre: str
    chapters: List[ChapterResponse]
    current_chapter: int

class UserStoryResponse(BaseModel):
    story_id: int
    title: str
    genre: str
    current_chapter: int
    created_at: datetime

class StoryDetailResponse(BaseModel):
    story_id: int
    title: str
    genre: str
    created_at: datetime
    current_chapter: int
    story_content: str  # Full story as formatted text

# Generic Response Models
class SuccessResponse(BaseModel):
    success: bool
    message: str

class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None
