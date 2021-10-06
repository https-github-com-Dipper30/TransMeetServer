'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Home_Customers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      marriage_status: {
        type: Sequelize.INTEGER
      },
      gender: {
        type: Sequelize.INTEGER
      },
      birth: {
        type: Sequelize.INTEGER
      },
      annual_income: {
        type: Sequelize.INTEGER
      },
      street: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      state_id: {
        type: Sequelize.INTEGER
      },
      zip_code: {
        type: Sequelize.INTEGER
      },
      uid: {
        type: Sequelize.INTEGER
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Home_Customers');
  }
};