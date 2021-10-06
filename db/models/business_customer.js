'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Business_Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Business_Customer.init({
    annual_income: DataTypes.INTEGER,
    street: DataTypes.STRING,
    city: DataTypes.STRING,
    state_id: DataTypes.INTEGER,
    zip_code: DataTypes.INTEGER,
    uid: DataTypes.INTEGER,
    cate: DataTypes.STRING,
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Business_Customer',
  });
  return Business_Customer;
};