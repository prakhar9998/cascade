const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const authRouter = require('./routes/auth');
// const dashboardRouter = require('./routes/dashboard');
const boardRouter = require('./routes/board');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

dotenv.config({ path: './config/.env' });

// setting up mongoose connection
if (process.env.NODE_ENV === 'dev') {
  const mongoDB = process.env.DEV_DB_URL;
  mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('connected to db!');
  });

  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error'));
}

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', authRouter);
app.use('/api/board', boardRouter);
app.get('/test', async (req, res) => {
  res.json({ message: 'pass!' });
});

// middleware for handling errors
app.use(errorHandler);

module.exports = app;
