-- Users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Words table
CREATE TABLE words (
    word_id SERIAL PRIMARY KEY,
    eng_word_name VARCHAR(255) NOT NULL,
    tur_word_name VARCHAR(255) NOT NULL,
    picture VARCHAR(255),
    pronunciation VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Word samples table
CREATE TABLE word_samples (
    sample_id SERIAL PRIMARY KEY,
    word_id INTEGER REFERENCES words(word_id) ON DELETE CASCADE,
    sample_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Word progress table with spaced repetition
CREATE TABLE word_progress (
    progress_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    word_id INTEGER REFERENCES words(word_id) ON DELETE CASCADE,
    correct_count INTEGER DEFAULT 0,
    last_correct_date TIMESTAMP,
    next_review_date TIMESTAMP,
    review_stage INTEGER DEFAULT 0, -- 0: initial, 1: 1 day, 2: 1 week, 3: 1 month, 4: 3 months, 5: 6 months, 6: 1 year
    is_learned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, word_id)
); 