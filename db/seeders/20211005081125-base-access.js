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
    await queryInterface.bulkInsert('Roles', [
      {
        name: 'home',
        type: 1,
      },
      {
        name: 'business',
        type: 2,
      },
      {
        name: 'admin',
        type: 99
      }
    ], {})
    await queryInterface.bulkInsert('Access_Roles', [
      {
        rid: 1,
        aid: 1,
      },
      {
        rid: 1,
        aid: 2,
      },
      {
        rid: 1,
        aid: 3,
      },
      {
        rid: 1,
        aid: 4,
      },
      {
        rid: 1,
        aid: 5,
      },
      {
        rid: 2,
        aid: 1,
      },
      {
        rid: 2,
        aid: 2,
      },
      {
        rid: 2,
        aid: 3,
      },
      {
        rid: 2,
        aid: 4,
      },
      {
        rid: 2,
        aid: 5,
      },
      {
        rid: 99,
        aid: 6
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
