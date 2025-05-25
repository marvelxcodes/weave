from dataclasses import dataclass
from typing import List, Dict, Optional
from datetime import datetime

@dataclass
class GenreAuthors:
    """Data class containing hardcoded authors for each genre"""
    
    AUTHORS_BY_GENRE: Dict[str, List[str]] = None
    
    def __post_init__(self):
        if self.AUTHORS_BY_GENRE is None:
            self.AUTHORS_BY_GENRE = {
                'fantasy': ['J.R.R. Tolkien', 'George R.R. Martin', 'Ursula K. Le Guin', 'Brandon Sanderson', 'Robin Hobb'],
                'sci-fi': ['Isaac Asimov', 'Philip K. Dick', 'Arthur C. Clarke', 'Ursula K. Le Guin', 'Ray Bradbury'],
                'mystery': ['Agatha Christie', 'Arthur Conan Doyle', 'Dorothy L. Sayers', 'Raymond Chandler', 'Dashiell Hammett'],
                'horror': ['Stephen King', 'H.P. Lovecraft', 'Clive Barker', 'Shirley Jackson', 'Edgar Allan Poe'],
                'romance': ['Jane Austen', 'Nicholas Sparks', 'Nora Roberts', 'Emily Brontë', 'Diana Gabaldon'],
                'adventure': ['Jules Verne', 'Robert Louis Stevenson', 'Ernest Hemingway', 'Jack London', 'Daniel Defoe']
            }
    
    def get_authors_for_genre(self, genre: str) -> List[str]:
        return self.AUTHORS_BY_GENRE.get(genre.lower(), [])
    
    def get_all_genres(self) -> List[str]:
        return list(self.AUTHORS_BY_GENRE.keys())


@dataclass
class CustomPrompts:
    """Data class containing hardcoded custom story prompts by genre"""
    
    CUSTOM_PROMPTS: Dict[str, List[str]] = None
    
    def __post_init__(self):
        if self.CUSTOM_PROMPTS is None:
            self.CUSTOM_PROMPTS = {
                'fantasy': [
                    "A young apprentice discovers their magic teacher has been stealing memories from students",
                    "In a world where dragons are librarians, someone is burning the ancient books",
                    "A blacksmith forges weapons that reveal the true nature of whoever wields them",
                    "Twin siblings discover they can swap places across different magical realms",
                    "A cartographer realizes the maps they draw are creating new worlds"
                ],
                'sci-fi': [
                    "Earth receives a message from the future warning about a decision made today",
                    "A space archaeologist uncovers evidence that humans aren't originally from Earth",
                    "Time flows backwards in a small research station, and no one knows why",
                    "An AI designed to solve loneliness begins creating imaginary friends for humanity",
                    "Colonists on Mars discover their oxygen is being stolen by something underground"
                ],
                'mystery': [
                    "A detective investigates a murder where the victim keeps appearing alive",
                    "Books are disappearing from libraries worldwide, but only specific pages",
                    "A small town's residents are forgetting each other, one person at a time",
                    "An antique shop owner realizes their customers are selling memories as objects",
                    "A witness protection agent discovers their protected witness doesn't exist"
                ],
                'horror': [
                    "A family moves into a house where the previous owners are still living in the walls",
                    "A night shift worker notices their reflection arrives at work five minutes before they do",
                    "Children in a town are aging backwards, but only at night",
                    "A grief counselor realizes their patients' deceased loved ones are attending sessions",
                    "A photographer's camera captures events that happen exactly 24 hours in the future"
                ],
                'romance': [
                    "Two rival food truck owners are unknowingly writing love letters to each other online",
                    "A florist keeps receiving anonymous orders to send flowers to themselves",
                    "An insomniac and a narcoleptic meet in a 24-hour coffee shop",
                    "A voice actor falls in love with someone through their audiobook recordings",
                    "Two people discover they've been accidentally living each other's lives for a year"
                ],
                'adventure': [
                    "A travel blogger discovers that every place they write about mysteriously disappears",
                    "Siblings inherit a boat that only sails to places that don't exist on any map",
                    "A storm chaser realizes the tornadoes they follow are trying to communicate",
                    "An urban explorer finds the same abandoned building in every city they visit",
                    "A mountain climber discovers that each peak they summit connects to a different time period"
                ]
            }
    
    def get_prompts_for_genre(self, genre: str) -> List[str]:
        return self.CUSTOM_PROMPTS.get(genre.lower(), [])
    
    def get_all_genres(self) -> List[str]:
        return list(self.CUSTOM_PROMPTS.keys())


@dataclass
class StoryChapter:
    """Data class for story chapter information"""
    chapter: int
    content: str
    genre: Optional[str] = None
    author: Optional[str] = None
    custom_prompt: Optional[str] = None
    user_decision: Optional[str] = None


@dataclass 
class UserPreferences:
    """Data class for user preferences"""
    user_id: str
    author_id: int
    
    
@dataclass
class StoryProgress:
    """Data class for story progress tracking"""
    progress_id: int
    user_id: str
    story_id: int
    chapter_num: int
    choice: int
    timestamp: datetime
