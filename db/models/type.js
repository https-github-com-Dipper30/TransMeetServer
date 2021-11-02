'use strict';
const {
  Model
} = require('sequelize');
const Category = require('./category')
module.exports = (sequelize, DataTypes) => {
  class Type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Type.belongsTo(models.Category, { foreignKey: 'cate_code', targetKey: 'code' })
    }
  };
  Type.init({
    name: DataTypes.STRING,
    code: DataTypes.INTEGER,
    cate_code: DataTypes.INTEGER
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Type',
  });
  return Type;
};