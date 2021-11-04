'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product_Store extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Product_Store.init({
    pid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'Product_Store',
    },
    sid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'Product_Store',
    },
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Product_Store',
  });
  return Product_Store;
};