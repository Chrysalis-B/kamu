DROP TABLE IF EXISTS books;

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    question VARCHAR(299),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
