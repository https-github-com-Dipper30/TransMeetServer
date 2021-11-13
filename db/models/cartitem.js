'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CartItem.belongsTo(models.Product, { foreignKey: 'pid', targetKey: 'id' })
    }
  };
  CartItem.init({
    uid: DataTypes.INTEGER,
    pid: DataTypes.INTEGER,
    sid: DataTypes.INTEGER,
    amount: DataTypes.INTEGER
  }, {
    sequelize,
    timestamps: false,
    modelName: 'CartItem',
  });
  return CartItem;
};