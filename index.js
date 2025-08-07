const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const env = process.env.NODE_ENV || 'development';
const config = require('./config/config');
const routes = require('./routes/index');
const db = require('./models');

const app = express();
require('dotenv').config();

// Set EJS as view engine
app.set('view engine', 'ejs');

// Set the views directory (optional if default is fine)
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use(routes);

db.conn.authenticate()
  .then(() => console.log('✅ Database connected'))
  .catch(err => console.error('❌ DB connection error:', err));

// Start server
app.listen(config.app.port, () => {
    console.log(`Server running at http://localhost:${config.app.port}`);
});
