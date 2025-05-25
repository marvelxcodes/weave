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
