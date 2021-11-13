'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // User.belongsToMany(models.Product, {
      //   through: {
      //     model: models.CartItem,
      //     unique: false,
      //   },
      //   foreignKey: 'uid',
      //   constraints: false,
      // })
    }
  };
  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    role_id: DataTypes.INTEGER
  }, {
    sequelize,
    timestamps: false,
    modelName: 'User',
  });
  return User;
};