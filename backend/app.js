const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const authRouter = require('./routes/auth');

const app = express();

dotenv.config();

// setting up mongoose connection
const mongoDB = process.env.DEV_DB_URL;
mongoose.connect(
  mongoDB,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => { console.log('connected to db!'); },
);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', authRouter);

module.exports = app;
