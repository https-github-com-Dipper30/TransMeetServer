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
    await queryInterface.bulkInsert('States', [
      {
        name: 'Pennsylvania',
        region_id: 10,
      },
      {
        name: 'New York',
        region_id: 0,
      },
      {
        name: 'Ohio',
        region_id: 0,
      },
      {
        name: 'Virginia',
        region_id: 0,
      },
      {
        name: 'North Carolina',
        region_id: 1,
      },
      {
        name: 'South Carolina',
        region_id: 1,
      },
      {
        name: 'Georgia',
        region_id: 1,
      },
      {
        name: 'Florida',
        region_id: 1,
      },
      {
        name: 'Washington',
        region_id: 2,
      },
      {
        name: 'Oregon',
        region_id: 2,
      },
      {
        name: 'California',
        region_id: 2,
      },
      {
        name: 'Arizona',
        region_id: 2,
      },
      {
        name: 'Texas',
        region_id: 3,
      },
      {
        name: 'Kansas',
        region_id: 3,
      },
      {
        name: 'Colorado',
        region_id: 3,
      },
      {
        name: 'Minnesota',
        region_id: 3,
      },
      {
        name: 'Mars I',
        region_id: 4,
      },
      {
        name: 'Mars II',
        region_id: 4,
      }
    ], {})
    await queryInterface.bulkInsert('Regions', [
      {
        name: 'North East Region',
        manager_id: null,
      },
      {
        name: 'South East Region',
        manager_id: null,
      },
      {
        name: 'West Region',
        manager_id: null,
      },
      {
        name: 'Middle Region',
        manager_id: null,
      },
      {
        name: 'Mars Region',
        manager_id: null,
      }
    ], {})
    await queryInterface.bulkInsert('Business_Types', [
      {
        name: 'Factory',
        type: 1,
      },
      {
        name: 'Internet Services',
        type: 2,
      },
      {
        name: 'Media Company',
        type: 3,
      },
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
