'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CartItems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uid: {
        type: Sequelize.INTEGER
      },
      pid: {
        type: Sequelize.INTEGER
      },
      sid: {
        type: Sequelize.INTEGER
      },
      amount: {
        type: Sequelize.INTEGER
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('CartItems');
  }
};