-- Schema for Logan Land Historical Adventures

-- 1. Events Table
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date VARCHAR(100) NOT NULL,
    time VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    link VARCHAR(500) DEFAULT '',
    image_url VARCHAR(500) DEFAULT ''
);

-- 2. Presentations Table
CREATE TABLE IF NOT EXISTS presentations (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image_url VARCHAR(500) DEFAULT '',
    description TEXT NOT NULL,
    excerpt TEXT DEFAULT ''
);

-- 3. FAQs Table
CREATE TABLE IF NOT EXISTS faqs (
    id SERIAL PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    display_order INT DEFAULT 0
);
