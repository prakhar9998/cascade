const faker = require('faker');
const User = require('../../models/User');

const seedUsers = async (seed, count) => {
  faker.seed(seed);
  const userData = new Array(count).fill().map(() => {
    return {
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(8),
    };
  });

  await User.insertMany(userData);
};

module.exports = seedUsers;
