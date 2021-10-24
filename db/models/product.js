'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Product.init({
    name: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    price: DataTypes.BIGINT,
    cate: DataTypes.INTEGER,
    type: DataTypes.INTEGER,
    description: DataTypes.STRING,
    createTS: DataTypes.INTEGER,
    listTS: DataTypes.INTEGER,
    imgSrc: DataTypes.STRING,
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Product',
  });
  return Product;
};