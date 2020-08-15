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

  // can't use insertMany as it doesn't run the pre-save
  // middleware which is required to hash the passwords.
  userData.map(async (user) => {
    await User.create(user);
  });
};

module.exports = seedUsers;
