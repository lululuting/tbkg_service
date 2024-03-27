/* indent size: 2 */
'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('type', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    typeName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    orderNum: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0',
    },
  }, {
    tableName: 'type',
  });

  Model.associate = function() {

  };

  return Model;
};
