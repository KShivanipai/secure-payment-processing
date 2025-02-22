CREATE DATABASE IF NOT EXISTS payments;
USE payments;

-- Create the transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    card_number VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    merchant_id VARCHAR(50) NOT NULL,
    status VARCHAR(10) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);