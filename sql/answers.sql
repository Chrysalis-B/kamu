DROP TABLE IF EXISTS answers;

CREATE TABLE answers (
    id SERIAL PRIMARY KEY,
    question_id INTEGER NOT NULL,
    author_id INTEGER NOT NULL,
    filler_id INTEGER NOT NULL,
    answer VARCHAR(299),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
