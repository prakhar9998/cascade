const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const authRouter = require('./routes/auth');
const boardRouter = require('./routes/board');
const listRouter = require('./routes/list');
const cardRouter = require('./routes/card');
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
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', authRouter);
app.use('/api/board', boardRouter);
app.use('/api/list', listRouter);
app.use('/api/card', cardRouter);

// middleware for handling errors
app.use(errorHandler);

module.exports = app;
