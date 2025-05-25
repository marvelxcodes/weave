CREATE DATABASE weave;

use weave;

CREATE TABLE users (
	    user_id VARCHAR(50) PRIMARY KEY,         -- Google unique user ID (sub)
	    email VARCHAR(100) UNIQUE NOT NULL,      -- Email from Google
	    name VARCHAR(100),                       -- Optional: name from Google
	    profile_pic_url VARCHAR(255),            -- Optional: profile picture URL
	    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE genres (
	    genre_id INT AUTO_INCREMENT PRIMARY KEY,
	    genre_name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE authors (
	    author_id INT AUTO_INCREMENT PRIMARY KEY,
	    author_name VARCHAR(100) NOT NULL,
	    genre_id INT,
	    FOREIGN KEY (genre_id) REFERENCES genres(genre_id)
);

CREATE TABLE user_preferences (
	    user_id VARCHAR(50),
	    author_id INT,
	    PRIMARY KEY (user_id, author_id),
	    FOREIGN KEY (user_id) REFERENCES users(user_id),
	    FOREIGN KEY (author_id) REFERENCES authors(author_id)
);

CREATE TABLE stories (
	    story_id INT AUTO_INCREMENT PRIMARY KEY,
	    user_id VARCHAR(50),
	    genre VARCHAR(50) NOT NULL,
	    title VARCHAR(255) NOT NULL,
	    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE chapters (
	    chapter_id INT AUTO_INCREMENT PRIMARY KEY,
	    story_id INT,
	    chapter_num INT NOT NULL,
	    content TEXT NOT NULL,
	    choices_json JSON,
	    FOREIGN KEY (story_id) REFERENCES stories(story_id),
	    UNIQUE (story_id, chapter_num)
);

CREATE TABLE story_progress (
	    progress_id INT AUTO_INCREMENT PRIMARY KEY,
	    user_id VARCHAR(50),
	    story_id INT,
	    chapter_num INT NOT NULL,
	    choice TINYINT(1) NOT NULL,
	    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
	    FOREIGN KEY (user_id) REFERENCES users(user_id),
	    FOREIGN KEY (story_id) REFERENCES stories(story_id)
);

CREATE TABLE story_likes (
	    id VARCHAR(50) PRIMARY KEY,
	    user_id VARCHAR(50) NOT NULL,
	    story_id INT(11) NOT NULL,
	    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

	    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
	    FOREIGN KEY (story_id) REFERENCES stories(story_id) ON DELETE CASCADE,
	    UNIQUE KEY unique_user_story (user_id, story_id)
);

CREATE INDEX idx_stories_user ON stories(user_id);
CREATE INDEX idx_progress_user_story ON story_progress(user_id, story_id);

-- Insert genres first
INSERT INTO genres (genre_name) VALUES
('fantasy'),
('sci-fi'),
('mystery'),
('horror'),
('romance'),
('adventure');

-- Insert all unique authors (removing duplicates across genres)
INSERT INTO authors (author_name, genre_id) VALUES
-- Fantasy authors
('J.R.R. Tolkien', (SELECT genre_id FROM genres WHERE genre_name = 'fantasy')),
('George R.R. Martin', (SELECT genre_id FROM genres WHERE genre_name = 'fantasy')),
('J.K. Rowling', (SELECT genre_id FROM genres WHERE genre_name = 'fantasy')),
('Brandon Sanderson', (SELECT genre_id FROM genres WHERE genre_name = 'fantasy')),
('Robin Hobb', (SELECT genre_id FROM genres WHERE genre_name = 'fantasy')),

-- Sci-fi authors
('Isaac Asimov', (SELECT genre_id FROM genres WHERE genre_name = 'sci-fi')),
('Philip K. Dick', (SELECT genre_id FROM genres WHERE genre_name = 'sci-fi')),
('Arthur C. Clarke', (SELECT genre_id FROM genres WHERE genre_name = 'sci-fi')),
('Ursula K. Le Guin', (SELECT genre_id FROM genres WHERE genre_name = 'sci-fi')),
('Ray Bradbury', (SELECT genre_id FROM genres WHERE genre_name = 'sci-fi')),

-- Mystery authors
('Agatha Christie', (SELECT genre_id FROM genres WHERE genre_name = 'mystery')),
('Arthur Conan Doyle', (SELECT genre_id FROM genres WHERE genre_name = 'mystery')),
('Dorothy L. Sayers', (SELECT genre_id FROM genres WHERE genre_name = 'mystery')),
('Raymond Chandler', (SELECT genre_id FROM genres WHERE genre_name = 'mystery')),
('Dashiell Hammett', (SELECT genre_id FROM genres WHERE genre_name = 'mystery')),

-- Horror authors
('Stephen King', (SELECT genre_id FROM genres WHERE genre_name = 'horror')),
('H.P. Lovecraft', (SELECT genre_id FROM genres WHERE genre_name = 'horror')),
('Clive Barker', (SELECT genre_id FROM genres WHERE genre_name = 'horror')),
('Shirley Jackson', (SELECT genre_id FROM genres WHERE genre_name = 'horror')),
('Edgar Allan Poe', (SELECT genre_id FROM genres WHERE genre_name = 'horror')),

-- Romance authors
('Jane Austen', (SELECT genre_id FROM genres WHERE genre_name = 'romance')),
('Nicholas Sparks', (SELECT genre_id FROM genres WHERE genre_name = 'romance')),
('Nora Roberts', (SELECT genre_id FROM genres WHERE genre_name = 'romance')),
('Emily Brontë', (SELECT genre_id FROM genres WHERE genre_name = 'romance')),
('Diana Gabaldon', (SELECT genre_id FROM genres WHERE genre_name = 'romance')),

-- Adventure authors
('Jules Verne', (SELECT genre_id FROM genres WHERE genre_name = 'adventure')),
('Robert Louis Stevenson', (SELECT genre_id FROM genres WHERE genre_name = 'adventure')),
('Ernest Hemingway', (SELECT genre_id FROM genres WHERE genre_name = 'adventure')),
('Jack London', (SELECT genre_id FROM genres WHERE genre_name = 'adventure')),
('Daniel Defoe', (SELECT genre_id FROM genres WHERE genre_name = 'adventure'));
