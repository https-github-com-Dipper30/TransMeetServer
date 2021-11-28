'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User, { foreignKey: 'uid', targetKey: 'id' })
      Order.belongsTo(models.Product, { foreignKey: 'pid', targetKey: 'id' })
      Order.belongsTo(models.Staff, { foreignKey: 'staff', targetKey: 'id' })
      Order.belongsTo(models.Store, { foreignKey: 'sid', targetKey: 'id' })
      Order.belongsTo(models.Region, { foreignKey: 'rid', targetKey: 'id' })
    }
  };
  Order.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    uid: DataTypes.INTEGER,
    pid: DataTypes.INTEGER,
    sid: DataTypes.INTEGER,
    rid: DataTypes.INTEGER,
    staff: DataTypes.INTEGER,
    price: DataTypes.BIGINT,
    amount: DataTypes.INTEGER,
    time: DataTypes.BIGINT,
    status: DataTypes.INTEGER,
    rate: DataTypes.INTEGER,
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Order',
  });
  return Order;
};