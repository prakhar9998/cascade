const request = require('supertest');
const mongoose = require('mongoose');
const faker = require('faker');
const app = require('../app');
const User = require('../models/User');
const seedUsers = require('./seeds/seedUsers');

describe('Testing user registration', () => {
  const seed = 12;

  beforeAll(async () => {
    const mongoDB = process.env.TEST_DB_URL;
    mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
    await seedUsers(seed, 5);
  });

  afterAll(async () => {
    await User.deleteMany({});
    mongoose.connection.close();
  });

  it('should REGISTER new user', async (done) => {
    const res = await request(app).post('/api/register').send({
      firstname: 'John',
      lastname: 'Lennon',
      email: 'john12@gmail.com',
      password: '1234124321',
    });

    expect(res.status).toEqual(200);
    expect(res.body.success).toBeTruthy();

    done();
  });

  it('should NOT REGISTER already registered user', async (done) => {
    faker.seed(seed);
    const res = await request(app).post('/api/register').send({
      firstname: 'John',
      lastname: '',
      email: 'john12@gmail.com',
      password: '1234124a1',
    });

    expect(res.status).toEqual(400);
    expect(res.body.success).toBeFalsy();
    done();
  });

  it('returns 400 if password length is < 8', async (done) => {
    const res = await request(app)
      .post('/api/register')
      .send({
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(7),
      });

    expect(res.status).toEqual(400);
    expect(res.body.success).toBeFalsy();
    done();
  });

  it('returns 400 if email is not valid', async (done) => {
    const res = await request(app)
      .post('/api/register')
      .send({
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        email: 'asdf@kfd',
        password: faker.internet.password(8),
      });

    expect(res.status).toEqual(400);
    expect(res.body.success).toBeFalsy();
    done();
  });
});
