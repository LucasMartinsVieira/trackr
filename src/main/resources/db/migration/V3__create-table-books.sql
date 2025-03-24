CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE book_status AS ENUM ('to_read', 'reading', 'complete', 'paused', 'dropped');

CREATE TYPE book_type as ENUM ('paperback', 'hardcover', 'e-book', 'audiobook');

CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  openlibrary_id VARCHAR(20) UNIQUE NOT NULL,
  title VARCHAR(20) NOT NULL,
  subtitle VARCHAR(255),
  authors JSONB NOT NULL,
  publish_date DATE,
  cover_url TEXT,
  isbn_10 VARCHAR(20),
  isbn_13 VARCHAR(20),
  number_of_pages INT,
  description TEXT,
  publishers JSONB,
  status book_status DEFAULT 'to_read',
  type book_type DEFAULT 'paperback',
  loved BOOLEAN DEFAULT FALSE,
  user_rating DECIMAL(3, 1) CHECK (user_rating BETWEEN 1 AND 5),
  date_started DATE,
  date_finished DATE,
  notes TEXT,
  user_id VARCHAR(36) REFERENCES users(id)
);