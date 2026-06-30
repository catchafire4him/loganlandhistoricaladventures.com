-- Schema for Logan Land Historical Adventures
-- This represents the complete, active database schema for PostgreSQL.

-- 1. Events Table
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date VARCHAR(100) NOT NULL,
    time VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    link VARCHAR(500) DEFAULT '',
    image_url VARCHAR(500) DEFAULT '',
    event_date DATE -- Chronological date field used for ordering and queries
);

-- 2. Presentations Table
CREATE TABLE IF NOT EXISTS presentations (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image_url VARCHAR(500) DEFAULT '',
    description TEXT NOT NULL,
    excerpt TEXT DEFAULT '',
    visible BOOLEAN DEFAULT TRUE -- Switch to show/hide character from public website
);

-- 3. FAQs Table
CREATE TABLE IF NOT EXISTS faqs (
    id SERIAL PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    display_order INT DEFAULT 0
);

-- 4. Dance Videos Table
CREATE TABLE IF NOT EXISTS videos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    video_url VARCHAR(500) NOT NULL,
    display_order INT DEFAULT 0
);

-- 5. Blog Posts Table
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT DEFAULT '',
    image_url VARCHAR(500) DEFAULT '',
    status VARCHAR(50) DEFAULT 'draft', -- 'draft' or 'published'
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Contact Form Submissions Table
CREATE TABLE IF NOT EXISTS contact_submissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) DEFAULT '',
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE, -- Admin read status flag
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
