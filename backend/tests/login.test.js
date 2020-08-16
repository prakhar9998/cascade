const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');

describe('Testing user login', () => {
  beforeAll(async () => {
    const mongoDB = process.env.TEST_DB_URL;
    mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
    await User.create({
      firstname: 'test',
      email: 'test@abcd.com',
      password: 'helloworld',
    });
  });

  afterAll(async () => {
    await User.deleteMany({});
    mongoose.connection.close();
  });

  it('verifiy user exists in database', async () => {
    const user = User.findOne({ email: 'test@abcd.com' });
    expect(user).toBeTruthy();
  });

  it('login existing user', async () => {
    const res = await request(app).post('/api/login').send({
      email: 'test@abcd.com',
      password: 'helloworld',
    });
    expect(res.status).toEqual(200);
  });
});
