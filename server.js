require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const app = express();
app.use(express.json());

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "administrator",
    password: "admin123",
    database: "payments"
});

db.connect(err => {
    if (err) throw err;
    console.log("Connected to MySQL database");
});

// Authentication route (Login)
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "admin" && password === "password") {
        const token = jwt.sign({ username }, "secretKey", { expiresIn: "1h" });
        return res.json({ token });
    }
    res.status(401).json({ message: "Invalid credentials" });
});

// Payment processing route
app.post("/process-payment", (req, res) => {
    const { cardNumber, amount, merchantId } = req.body;
    const encryptedCard = crypto.createHash("sha256").update(cardNumber).digest("hex");
    const responseCode = amount <= 1000 ? "00" : "51";

    db.query("INSERT INTO transactions (card_number, amount, merchant_id, status) VALUES (?, ?, ?, ?)",
        [encryptedCard, amount, merchantId, responseCode === "00" ? "Approved" : "Declined"],
        (err) => {
            if (err) throw err;
        }
    );

    res.json({ status: responseCode === "00" ? "Approved" : "Declined" });
});

// Start the server
app.listen(3000, () => console.log("Server running on port 3000"));