CREATE TABLE users (
    id       VARCHAR(36) PRIMARY KEY NOT NULL,
    name     TEXT NOT NULL,
    email    TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);
