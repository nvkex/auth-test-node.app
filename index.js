const express = require('express');
const app = express();
const mongoose = require('mongoose');

const dotenv = require('dotenv');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

dotenv.config();

// Mongoose
mongoose.connect(
    process.env.DB_CONNECT, 
    { 
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    () => {
        console.log('Connected to DB');
    }
);

// Middlware
app.use(express.json());

// Route Middleware
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

// Start listening
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Running at '+PORT);
});