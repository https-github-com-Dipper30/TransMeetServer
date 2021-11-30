'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Home_Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Home_Customer.belongsTo(models.User, { foreignKey: 'uid', targetKey: 'id' })
    }
  };
  Home_Customer.init({
    marriage_status: DataTypes.INTEGER,
    phone:  DataTypes.STRING,
    email:  DataTypes.STRING,
    gender: DataTypes.INTEGER,
    birth: DataTypes.INTEGER,
    annual_income: DataTypes.INTEGER,
    street: DataTypes.STRING,
    city: DataTypes.STRING,
    state_id: DataTypes.INTEGER,
    zip_code: DataTypes.INTEGER,
    uid: DataTypes.INTEGER
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Home_Customer',
  });
  return Home_Customer;
};