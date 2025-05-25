import requests
import json
import random
import time
from typing import List, Optional, Dict, Tuple
from data_models import StoryChapter

class StoryGenerator:
    """Handles story generation using Gemini API"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent"
    
    def _call_gemini_api(self, prompt: str) -> str:
        """Make API call to Gemini with randomized parameters"""
        headers = {
            'Content-Type': 'application/json',
        }
        
        # Randomize generation parameters for variety
        data = {
            "contents": [{
                "parts": [{
                    "text": prompt
                }]
            }],
            "generationConfig": {
                "temperature": random.uniform(0.85, 1.2),
                "maxOutputTokens": random.randint(900, 1100),
                "topP": random.uniform(0.7, 0.95),
                "topK": random.randint(15, 40),
                "candidateCount": 1
            }
        }
        
        url = f"{self.base_url}?key={self.api_key}"
        response = requests.post(url, headers=headers, json=data)
        
        if response.status_code == 200:
            result = response.json()
            return result['candidates'][0]['content']['parts'][0]['text']
        else:
            return f"Error: {response.status_code} - {response.text}"
    
    def _add_temporal_randomness(self) -> str:
        """Add time-based elements for uniqueness"""
        current_time = int(time.time())
        random.seed(current_time)
        
        time_elements = [
            f"Generated at timestamp {current_time}",
            f"Story variant #{current_time % 1000}",
            f"Creativity factor: {random.uniform(0.1, 1.0):.2f}"
        ]
        
        return random.choice(time_elements)
    
    def generate_first_chapter(self, genre: str, author: str, custom_prompt: Optional[str] = None) -> str:
        """Generate the first chapter with optional custom prompt"""
        temporal_element = self._add_temporal_randomness()
        
        # Build the concept section
        concept_section = ""
        if custom_prompt and custom_prompt.strip():
            concept_section = f"""
STORY CONCEPT INSPIRATION (use as creative springboard):
"{custom_prompt}"

CREATIVE FREEDOM INSTRUCTIONS:
- Use this concept as a launching point, not a rigid constraint
- Feel free to expand, modify, or reinterpret the concept creatively
- Your primary goal is to write an authentic {author}-style story
- Enhance the concept with your own creative elements
- The story should feel natural and well-crafted above all else
- You have complete artistic license to improve upon this foundation"""
        
        prompt = f"""Write a creative and engaging first chapter of an interactive story in the {genre} genre, written in the distinctive style of {author}.

AUTHOR STYLE PRIORITIES:
- Study and embody {author}'s narrative voice and tone
- Capture their character development approach  
- Mirror their descriptive style and pacing
- Replicate their dialogue patterns
- Incorporate their world-building techniques (if applicable)
{concept_section}

UNIQUENESS ELEMENT:
- {temporal_element}

QUALITY GUIDELINES:
- Story quality and authentic {author} style are your top priorities
- Create an engaging, professionally crafted opening
- Let the story flow naturally in {author}'s voice
- Focus on compelling characters and intriguing situations
- Make each generation unique and fresh

The chapter should be approximately 300-500 words and end with two interesting decisions for the reader to choose from.

Format your response as:

**Chapter 1**
[Your story content here in {author}'s authentic style]

**Choose your path:**
A) [First decision option]
B) [Second decision option]"""
        
        return self._call_gemini_api(prompt)
    
    def generate_next_chapter(self, previous_chapters: List[StoryChapter], user_decision: str, 
                            genre: str, author: str, chapter_num: int) -> str:
        """Generate the next chapter based on user decision and story history"""
        temporal_element = self._add_temporal_randomness()
        
        # Build the full story context
        full_story = f"Genre: {genre}, Author Style: {author}\n"
        if previous_chapters and previous_chapters[0].custom_prompt:
            full_story += f"Original Story Concept: {previous_chapters[0].custom_prompt}\n"
        full_story += "\n"
        
        for chapter in previous_chapters:
            full_story += f"{chapter.content}\n\n"
            if chapter.user_decision:
                full_story += f"*Reader chose: {chapter.user_decision}*\n\n"
        
        prompt = f"""Here is the story so far, written in the style of {author}:

{full_story}

The reader has chosen: {user_decision}

UNIQUENESS ELEMENT:
- {temporal_element}

NOTE: The Story must end at Chapter Number 20. Plan the story accordingly.

Based on this decision, write Chapter {chapter_num} of the story. The chapter should:
1. Continue naturally from the reader's choice
2. Be approximately 300-500 words
3. Advance the plot meaningfully
4. Maintain {author}'s distinctive writing style throughout
5. Stay true to the established story tone and direction
6. End with two compelling new decisions for the reader
7. Feel fresh and unique from previous generations

ARTISTIC PRIORITY: Authentic {author} style and compelling storytelling come first. Focus on creating a natural continuation that feels true to the established narrative.

Format your response as:

**Chapter {chapter_num}**
[Your story content here in {author}'s style]

**Choose your path:**
A) [First decision option]
B) [Second decision option]"""
        
        return self._call_gemini_api(prompt)
    
    def parse_chapter_content(self, generated_content: str) -> Tuple[str, List[str]]:
        """Parse generated content to extract chapter text and choices"""
        lines = generated_content.split('\n')
        chapter_content = []
        choices = []
        
        in_choices_section = False
        
        for line in lines:
            line = line.strip()
            if line.startswith('**Choose your path:**') or line.startswith('**Choose your path**'):
                in_choices_section = True
                continue
            elif in_choices_section:
                if line.startswith('A)') or line.startswith('B)'):
                    choice_text = line[2:].strip()  # Remove "A)" or "B)"
                    choices.append(choice_text)
            else:
                if line and not line.startswith('**Chapter'):
                    chapter_content.append(line)
        
        # Join chapter content and clean up
        chapter_text = '\n'.join(chapter_content).strip()
        
        return chapter_text, choices
