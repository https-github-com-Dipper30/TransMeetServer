'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Staff extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Staff.init({
    name: DataTypes.STRING,
    job_title: DataTypes.INTEGER,
    store_assigned: DataTypes.INTEGER,
    region_assigned: DataTypes.INTEGER,
    salary: DataTypes.INTEGER
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Staff',
  });
  return Staff;
};