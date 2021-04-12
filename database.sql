CREATE DATABASE chatify_id;

CREATE TABLE single_chat_message(
    scm_id SERIAL PRIMARY KEY,
    sc_id INT,
	content VARCHAR(255),
	sender_username VARCHAR(50) NOT NULL,
	receiver_username VARCHAR(50) NOT NULL,
	time TIMESTAMP,
	status VARCHAR(20)
)

CREATE TABLE users(
	user_id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    phone VARCHAR(20) UNIQUE NOT NULL,
    photo_profile VARCHAR(100),
    username VARCHAR(20) UNIQUE,
    email VARCHAR(50) UNIQUE,
    password VARCHAR(20),
    bio VARCHAR(100),
)