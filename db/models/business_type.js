'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Business_Type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Business_Type.init({
    name: DataTypes.STRING,
    type: DataTypes.INTEGER
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Business_Type',
  });
  return Business_Type;
};