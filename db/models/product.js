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
      Product.belongsTo(models.Category, { foreignKey: 'cate', targetKey: 'code' })
      Product.belongsTo(models.Type, { foreignKey: 'type', targetKey: 'code' })
      // Product.hasMany(models.CartItem)
      // Product.belongsToMany(models.User, {
      //   through: {
      //     model: models.CartItem,
      //     unique: false,
      //   },
      //   foreignKey: 'pid',
      //   constraints: false,
      // })

    }
  };
  Product.init({
    name: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    price: DataTypes.BIGINT,
    cate: DataTypes.INTEGER,
    unit: DataTypes.STRING,
    type: DataTypes.INTEGER,
    description: DataTypes.STRING,
    createTS: DataTypes.INTEGER,
    listTS: DataTypes.INTEGER,
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Product',
  });
  return Product;
};