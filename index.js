const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({
    secret: "fingerprint_customer", 
    resave: true, 
    saveUninitialized: true
}));

// Authentication middleware for /customer/auth/*
app.use("/customer/auth/*", function auth(req, res, next) {
    const token = req.body.token || req.query.token; // Check JSON body and query params

    if (!token) {
        return res.status(403).json({ message: 'No token provided or user not logged in.' });
    }

    // Verify the JWT token
    jwt.verify(token, process.env.JWT_SECRET || "secret_key", function(err, decoded) {
        if (err) {
            return res.status(500).json({ message: 'Failed to authenticate token.' });
        }
        // Store the decoded information in the request object
        req.user = decoded;
        next();
    });
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
