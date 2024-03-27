/* indent size: 2 */
'use strict';
module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('comment', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    pid: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    createTime: {
      type: DataTypes.TIME,
      allowNull: true,
      defaultValue: app.Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    articleId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER(255),
      allowNull: false,
      defaultValue: '1',
    },
    visitorAvatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    visitorName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    equipmentInfo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'comment',
  });

  Model.associate = function() {
    app.model.Comment.hasMany(app.model.CommentLike, {
      foreignKey: 'commentId',
      sourceKey: 'id',
      as: 'cl',
    });
    app.model.Comment.belongsTo(app.model.User, { foreignKey: 'userId', targetKey: 'id', as: 'user' });
    app.model.Comment.belongsTo(app.model.Article, { foreignKey: 'articleId', targetKey: 'id', as: 'article' });
  };

  return Model;
};
