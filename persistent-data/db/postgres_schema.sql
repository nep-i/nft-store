CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    metadata JSONB
);

CREATE TABLE feeds (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    metadata JSONB
);

CREATE TABLE posts (
    id UUID PRIMARY KEY,
    feed_id UUID NOT NULL REFERENCES feeds(id),
    user_id UUID NOT NULL REFERENCES users(id),
    message_id UUID NOT NULL, 
    timestamp TIMESTAMP NOT NULL,
    metadata JSONB
);

CREATE TABLE post_replies (
    post_id UUID NOT NULL REFERENCES posts(id),
    message_id UUID NOT NULL, 
    PRIMARY KEY (post_id, message_id)
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY,
    buyer_id UUID NOT NULL REFERENCES users(id),
    seller_id UUID NOT NULL REFERENCES users(id),
    product_id UUID NOT NULL, 
    amount DECIMAL(15,2) NOT NULL,
    date TIMESTAMP NOT NULL,
    metadata JSONB
);