# Interactive Story Generator API

A FastAPI-based interactive story generator that uses Google's Gemini AI to create personalized stories based on user preferences, genres, and custom prompts.

## Features

- **User Management**: Register users with preferences
- **Story Generation**: Generate interactive stories in various genres
- **Story Continuation**: Continue stories based on user choices
- **Custom Prompts**: Use curated story prompts for inspiration
- **Progress Tracking**: Track user progress through stories
- **Multi-Genre Support**: Fantasy, Sci-Fi, Mystery, Horror, Romance, Adventure

## Project Structure

```
├── main.py                 # FastAPI application and routes
├── database.py            # Database connection and queries
├── story_generator.py     # Gemini AI integration for story generation
├── data_models.py         # Data classes for hardcoded content
├── pydantic_models.py     # Pydantic models for API validation
├── config.py              # Configuration management
├── requirements.txt       # Python dependencies
└── README.md             # This file
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd interactive-story-generator
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DB_HOST=localhost
   DB_NAME=weave
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_PORT=3306
   GEMINI_API_KEY=your_gemini_api_key
   ```

5. **Set up MySQL database**
   - Create a database named `weave`
   - Run the following SQL to create the required tables:

   ```sql
   -- Create genres table
   CREATE TABLE genres (
       genre_id INT PRIMARY KEY AUTO_INCREMENT,
       genre_name VARCHAR(255) NOT NULL
   );

   -- Create authors table
   CREATE TABLE authors (
       author_id INT PRIMARY KEY AUTO_INCREMENT,
       author_name VARCHAR(255) NOT NULL,
       genre_id INT,
       FOREIGN KEY (genre_id) REFERENCES genres(genre_id)
   );

   -- Create users table
   CREATE TABLE users (
       user_id VARCHAR(255) PRIMARY KEY,
       email VARCHAR(255) NOT NULL,
       name VARCHAR(255),
       profile_pic_url VARCHAR(255),
       created_at DATETIME
   );

   -- Create user_preferences table
   CREATE TABLE user_preferences (
       user_id VARCHAR(255),
       author_id INT,
       PRIMARY KEY (user_id, author_id),
       FOREIGN KEY (user_id) REFERENCES users(user_id),
       FOREIGN KEY (author_id) REFERENCES authors(author_id)
   );

   -- Create stories table
   CREATE TABLE stories (
       story_id INT PRIMARY KEY AUTO_INCREMENT,
       user_id VARCHAR(255),
       genre VARCHAR(255),
       title VARCHAR(255),
       created_at DATETIME,
       FOREIGN KEY (user_id) REFERENCES users(user_id)
   );

   -- Create chapters table
   CREATE TABLE chapters (
       chapter_id INT PRIMARY KEY AUTO_INCREMENT,
       story_id INT,
       chapter_num INT,
       content TEXT,
       choices_json LONGTEXT,
       FOREIGN KEY (story_id) REFERENCES stories(story_id)
   );

   -- Create story_progress table
   CREATE TABLE story_progress (
       progress_id INT PRIMARY KEY AUTO_INCREMENT,
       user_id VARCHAR(255),
       story_id INT,
       chapter_num INT,
       choice TINYINT,
       timestamp DATETIME,
       FOREIGN KEY (user_id) REFERENCES users(user_id),
       FOREIGN KEY (story_id) REFERENCES stories(story_id)
   );
   ```

## Running the Application

1. **Start the server**
   ```bash
   python main.py
   ```
   Or using uvicorn directly:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

2. **Access the API**
   - API Documentation: http://localhost:8000/docs
   - Alternative Docs: http://localhost:8000/redoc
   - Health Check: http://localhost:8000/health

## API Endpoints

### User Management
- `POST /register` - Register a new user with preferences
- `GET /genres` - Get all available genres
- `GET /authors` - Get all authors (optionally filter by genre)

### Story Operations
- `POST /story/generate` - Generate a new story
- `POST /story/continue` - Continue an existing story with a choice
- `GET /story` - Get all stories for a user
- `GET /story/{story_id}` - Get detailed story information

### Suggestions
- `GET /suggestions` - Get curated story prompts (optionally filter by genre)

## Usage Examples

### Register a User
```bash
curl -X POST "http://localhost:8000/register" \
     -H "Content-Type: application/json" \
     -d '{
       "user_id": "user123",
       "email": "user@example.com",
       "name": "John Doe",
       "preferred_authors": [1, 2, 3]
     }'
```

### Generate a Story
```bash
curl -X POST "http://localhost:8000/story/generate" \
     -H "Content-Type: application/json" \
     -d '{
       "user_id": "user123",
       "genre": "fantasy",
       "custom_prompt": "A young apprentice discovers their magic teacher has been stealing memories from students"
     }'
```

### Continue a Story
```bash
curl -X POST "http://localhost:8000/story/continue" \
     -H "Content-Type: application/json" \
     -d '{
       "user_id": "user123",
       "story_id": 1,
       "choice": "A"
     }'
```

### Get Story Suggestions
```bash
curl "http://localhost:8000/suggestions?genre=fantasy"
```

## Configuration

The application can be configured using environment variables:

- `DB_HOST`: Database host (default: localhost)
- `DB_NAME`: Database name (default: weave)
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password
- `DB_PORT`: Database port (default: 3306)
- `GEMINI_API_KEY`: Google Gemini API key
- `HOST`: Server host (default: 0.0.0.0)
- `PORT`: Server port (default: 8000)
- `DEBUG`: Debug mode (default: False)
- `CORS_ORIGINS`: Allowed CORS origins (default: *)

## Error Handling

The API includes comprehensive error handling:
- **400**: Bad Request (invalid input)
- **404**: Not Found (resource doesn't exist)
- **500**: Internal Server Error (unexpected errors)

All errors return a structured JSON response with error details.

## Database Schema Considerations

The current implementation has some inconsistencies between the hardcoded data and the database schema:

1. **Genre-Author Relationship**: The hardcoded data has authors associated with specific genres, but the API endpoints suggest a more flexible many-to-many relationship.

2. **Author Selection**: Currently uses the first author from a genre's list. You may want to implement user preference-based selection.

3. **Story Titles**: Auto-generated based on genre. Consider allowing custom titles.

## Future Enhancements

- Implement proper user authentication/authorization
- Add story sharing capabilities
- Implement story rating and review system
- Add more sophisticated author selection based on user preferences
- Implement story templates and themes
- Add image generation for story chapters
- Implement story export functionality

## Troubleshooting

1. **Database Connection Issues**: Verify MySQL is running and credentials are correct
2. **Gemini API Errors**: Check API key validity and quota limits
3. **Import Errors**: Ensure all dependencies are installed in the virtual environment
