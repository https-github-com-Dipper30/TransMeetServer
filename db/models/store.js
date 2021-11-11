'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Store extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Store.belongsTo(models.State, { foreignKey: 'state_id', targetKey: 'id' } )
      Store.belongsTo(models.Staff, { foreignKey: 'manager_id', targetKey: 'id' } )
      Store.belongsTo(models.Region, { foreignKey: 'region_id', targetKey: 'id' } )
      // Store.hasMany(models.Product_Store, {
      //   foreignKey: 'sid',
      //   onDelete: 'CASCADE',
      // })
    }
  };
  Store.init({
    manager_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    street: DataTypes.STRING,
    city: DataTypes.STRING,
    state_id: DataTypes.INTEGER,
    zip_code: DataTypes.INTEGER,
    region_id: DataTypes.INTEGER
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Store',
  });
  return Store;
};