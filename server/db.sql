DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS passwordCodes;
DROP TABLE IF EXISTS friendships;
DROP TABLE IF EXISTS messages;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL
    profile_pic TEXT,
    bio TEXT
);

CREATE TABLE friendships (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users(id),
    recipient_id INTEGER NOT NULL REFERENCES users(id),
    accepted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE passwordCodes (
    email VARCHAR(255) NOT NULL REFERENCES users(email),
    passwordCode VARCHAR(255) NOT NULL CHECK(passwordCode != ''),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


--Add to the database-- 
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) NOT NULL,
    message TEXT NOT NULL CHECK (message != ''),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);