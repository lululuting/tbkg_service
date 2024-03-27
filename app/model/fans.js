/* indent size: 2 */
'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('fans', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    createTime: {
      type: DataTypes.TIME,
      allowNull: true,
      defaultValue: app.Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    fansId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '1',
    },
  }, {
    tableName: 'fans',
  });

  Model.associate = function() {
    app.model.Fans.belongsTo(app.model.User, { foreignKey: 'fansId', targetKey: 'id', as: 'fansUser' });
    app.model.Fans.belongsTo(app.model.User, { foreignKey: 'userId', targetKey: 'id', as: 'user' });
  };

  return Model;
};
