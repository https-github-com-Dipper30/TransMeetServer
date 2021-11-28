'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Rate.belongsTo(models.Product, { foreignKey: 'pid', targetKey: 'id' })
      console.log('why?? ', models.Product)
    }
  };
  Rate.init({
    pid: DataTypes.INTEGER,
    value: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Rate',
  });
  return Rate;
};