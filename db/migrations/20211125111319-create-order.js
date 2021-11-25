'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Orders', {
      id: {
        primaryKey: true,
        autoIncrement: false,
        type: Sequelize.STRING
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
      staff: {
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.BIGINT
      },
      amount: {
        type: Sequelize.INTEGER
      },
      time: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.INTEGER
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Orders');
  }
};