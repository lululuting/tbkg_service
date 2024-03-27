/* indent size: 2 */
'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('config', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    icon: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    introduce: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    status: {
      type: DataTypes.INTEGER(255),
      allowNull: false,
      defaultValue: '1',
    },
  }, {
    tableName: 'config',
  });

  Model.associate = function() {

  };

  return Model;
};
