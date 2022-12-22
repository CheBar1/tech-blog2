// set up imports
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// set up object
class Post extends Model {}

Post.init(
  {
// define columns
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      // datatype TEXT is unlimited in length / whereas STRING defaults to 255 characters
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'post',
  }
);
// export
module.exports = Post;