/* indent size: 2 */
'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('click_like', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    articleId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      defaultValue: '1',
    },
    createTime: {
      type: DataTypes.TIME,
      allowNull: true,
    },
  }, {
    tableName: 'click_like',
  });

  Model.associate = function() {

  };

  return Model;
};
