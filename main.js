const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(session({ secret: 'mysecretkey', resave: false, saveUninitialized: true }));

// Sample shoe data
const shoes = [
  { id: 1, brand: 'Nike', model: 'Air Max', price: 129.99 },
  { id: 2, brand: 'Adidas', model: 'Superstar', price: 89.99 },
  { id: 3, brand: 'Puma', model: 'Clyde', price: 79.99 },
];

// Initialize an empty shopping cart for shoes
const cart = [];

// User authentication (fake)
const users = [
  { username: 'user1', password: 'password1' },
  { username: 'user2', password: 'password2' },
];

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (!req.session.isAuthenticated) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  req.session.isAuthenticated = true;
  res.json({ message: 'Login successful' });
});

// Logout endpoint
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logout successful' });
  });
});

// API endpoint to get all shoes
app.get('/shoes', (req, res) => {
  res.json(shoes);
});

// API endpoint to add a shoe to the shopping cart
app.post('/cart/add', isAuthenticated, (req, res) => {
  const shoeId = req.body.shoeId;
  const shoe = shoes.find((s) => s.id === shoeId);

  if (!shoe) {
    return res.status(404).json({ error: 'Shoe not found' });
  }

  cart.push(shoe);
  res.json({ message: 'Shoe added to cart successfully' });
});

// API endpoint to view the shopping cart
app.get('/cart', isAuthenticated, (req, res) => {
  res.json(cart);
});

// API endpoint to remove a shoe from the shopping cart
app.post('/cart/remove', isAuthenticated, (req, res) => {
  const shoeId = req.body.shoeId;
  const index = cart.findIndex((s) => s.id === shoeId);

  if (index === -1) {
    return res.status(404).json({ error: 'Shoe not found in cart' });
  }

  cart.splice(index, 1);
  res.json({ message: 'Shoe removed from cart successfully' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
