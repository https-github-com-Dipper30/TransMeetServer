'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Access_Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Access_Role.init({
    rid: DataTypes.INTEGER,
    aid: DataTypes.INTEGER
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Access_Role',
  });
  return Access_Role;
};