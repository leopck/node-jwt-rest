require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

app.use(bodyParser.json());

// Dummy database for users and products
const products = [];
const users = {
    admin: { password: 'adminpassword', roles: ['admin'] },
    user: { password: 'userpassword', roles: ['user'] }
};

// Middleware to handle JWT authentication
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Middleware to check if the user is an admin
function isAdmin(req, res, next) {
    if (!req.user.roles.includes('admin')) {
        return res.sendStatus(403);
    }
    next();
}
app.use(express.static(path.join(__dirname, 'public')));
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

// Get all products
app.get('/products', authenticateToken, (req, res) => {
    res.json(products.length > 0 ? products : { message: "No products found" });
});

// Get a specific product by ID
app.get('/product/:id', authenticateToken, (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
});

// Add a new product
app.post('/product', authenticateToken, isAdmin, (req, res) => {
    const { name } = req.body;
    if (products.some(p => p.name === name)) {
        return res.status(409).json({ message: "Product name must be unique" });
    }
    const product = { id: products.length + 1, name };
    products.push(product);
    res.status(201).json(product);
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users[username];
    if (!user || user.password !== password) {
        return res.status(401).send('Username or password is incorrect');
    }
    const accessToken = jwt.sign({ username, roles: user.roles }, process.env.ACCESS_TOKEN_SECRET);
    console.log(`${username} logged in with roles: ${user.roles}`);  // Log to check roles
    res.json({ accessToken });
});

