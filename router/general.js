const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (isValid(username)) {
        return res.status(400).json({ message: "Username already exists" });
    }

    // Register the new user
    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop using Promises
public_users.get('/books-promise', function (req, res) {
    axios.get('http://localhost:3000/')
        .then(response => {
            res.status(200).json(response.data);
        })
        .catch(error => {
            res.status(500).json({ message: "Error retrieving books", error });
        });
});

// Get the book list available in the shop using async-await
public_users.get('/books-async', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:3000/');
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving books", error });
    }
});

// Get book details based on ISBN using Promises
public_users.get('/isbn-promise/:isbn', function (req, res) {
    const { isbn } = req.params;
    axios.get(`http://localhost:3000/isbn/${isbn}`)
        .then(response => {
            res.status(200).json(response.data);
        })
        .catch(error => {
            res.status(404).json({ message: "Book not found", error });
        });
});

// Get book details based on ISBN using async-await
public_users.get('/isbn-async/:isbn', async function (req, res) {
    const { isbn } = req.params;
    try {
        const response = await axios.get(`http://localhost:3000/isbn/${isbn}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(404).json({ message: "Book not found", error });
    }
});

// Get book details based on Author using Promises
public_users.get('/author-promise/:author', function (req, res) {
    const { author } = req.params;
    axios.get(`http://localhost:3000/author/${author}`)
        .then(response => {
            res.status(200).json(response.data);
        })
        .catch(error => {
            res.status(404).json({ message: "No books found by this author", error });
        });
});

// Get book details based on Author using async-await
public_users.get('/author-async/:author', async function (req, res) {
    const { author } = req.params;
    try {
        const response = await axios.get(`http://localhost:3000/author/${author}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(404).json({ message: "No books found by this author", error });
    }
});

// Get book details based on Title using Promises
public_users.get('/title-promise/:title', function (req, res) {
    const { title } = req.params;
    axios.get(`http://localhost:3000/title/${title}`)
        .then(response => {
            res.status(200).json(response.data);
        })
        .catch(error => {
            res.status(404).json({ message: "No books found with this title", error });
        });
});

// Get book details based on Title using async-await
public_users.get('/title-async/:title', async function (req, res) {
    const { title } = req.params;
    try {
        const response = await axios.get(`http://localhost:3000/title/${title}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(404).json({ message: "No books found with this title", error });
    }
});

// Get book details based on ISBN (original route)
public_users.get('/isbn/:isbn', function (req, res) {
    const { isbn } = req.params;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(books[isbn]);
});

// Get book details based on author (original route)
public_users.get('/author/:author', function (req, res) {
    const { author } = req.params;
    const filteredBooks = Object.values(books).filter(book => book.author === author);

    if (filteredBooks.length === 0) {
        return res.status(404).json({ message: "No books found by this author" });
    }

    return res.status(200).json(filteredBooks);
});

// Get all books based on title (original route)
public_users.get('/title/:title', function (req, res) {
    const { title } = req.params;
    const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase().includes(title.toLowerCase()));

    if (filteredBooks.length === 0) {
        return res.status(404).json({ message: "No books found with this title" });
    }

    return res.status(200).json(filteredBooks);
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const { isbn } = req.params;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(books[isbn].reviews || { message: "No reviews available" });
});

module.exports.general = public_users;
