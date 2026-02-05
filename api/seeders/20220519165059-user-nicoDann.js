'use strict';
const bcrypt = require('bcrypt');

const hashedPass = bcrypt.hashSync(process.env.ND_PASSWORD, 10);
// const hashedPass = bcrypt.hashSync('secret', 10);

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('users', [{
      username: 'nicoDann',
      email: 'nico@test.com',
      password: hashedPass,
      location: 'Toronto, ON',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', null, {});
  }
};
