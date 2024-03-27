/* indent size: 2 */
'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('msg', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '1',
    },
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createTime: {
      type: DataTypes.TIME,
      allowNull: true,
      defaultValue: app.Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    status: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '0',
    },
    callUserId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    source: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    sourceId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    commentId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
  }, {
    tableName: 'msg',
  });

  Model.associate = function() {
    app.model.Msg.belongsTo(app.model.User, { foreignKey: 'userId', targetKey: 'id', as: 'user' });
    app.model.Msg.belongsTo(app.model.User, { foreignKey: 'callUserId', targetKey: 'id', as: 'callUser' });
    app.model.Msg.belongsTo(app.model.Comment, { foreignKey: 'commentId', targetKey: 'id', as: 'comment' });
  };

  return Model;
};
