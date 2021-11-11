'use strict';
const {
  Model
} = require('sequelize');
const Store = require('./store');
const Product = require('./product');
const User = require('./user')
module.exports = (sequelize, DataTypes) => {
  class Product_Store extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Product.belongsToMany(models.Store, {
        through: models.Product_Store,
        unique: false,
        foreignKey: 'pid',
        onDelete: 'CASCADE',
        // hooks: true,
      })
      models.Store.belongsToMany(models.Product, {
        through: models.Product_Store,
        unique: false,
        foreignKey: 'sid',
        onDelete: 'CASCADE',
        // hooks: true,
      })
      
    }
  };
  Product_Store.init({
    pid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: 'id',
      }
    },
    sid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Store,
        key: 'id',
      }
    },
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Product_Store',
  });
  return Product_Store;
};