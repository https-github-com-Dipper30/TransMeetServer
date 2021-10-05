'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Accesses', [
      {
        name: 'browse products',
        type: 1,
      },
      {
        name: 'buy products',
        type: 2,
      },
      {
        name: 'browse comments',
        type: 3,
      },
      {
        name: 'make comments',
        type: 4,
      },
      {
        name: 'login main',
        type: 5,
      },
      {
        name: 'login cms',
        type: 6,
      }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Accesses', null, {})
  }
};
