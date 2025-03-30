CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE book_status AS ENUM ('TO_READ', 'READING', 'COMPLETE', 'PAUSED', 'DROPPED');

CREATE TYPE book_type as ENUM ('PAPERBACK', 'HARDCOVER', 'E_BOOK', 'AUDIOBOOk');

CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  openlibrary_id VARCHAR(20) UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle VARCHAR(255),
  authors JSONB NOT NULL,
  publish_date DATE,
  cover_url TEXT,
  isbn_10 VARCHAR(20),
  isbn_13 VARCHAR(20),
  number_of_pages INT,
  description TEXT,
  publishers JSONB,
  status book_status DEFAULT 'TO_READ',
  type book_type DEFAULT 'PAPERBACK',
  loved BOOLEAN DEFAULT FALSE,
  user_rating DECIMAL(3, 1) CHECK (user_rating BETWEEN 1 AND 5),
  date_started DATE,
  date_finished DATE,
  notes TEXT,
  user_id VARCHAR(36) REFERENCES users(id)
);