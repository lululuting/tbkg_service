/* indent size: 2 */
'use strict';
module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('comment_like', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    commentId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
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
    status: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      defaultValue: '1',
    },
    articleId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
  }, {
    tableName: 'comment_like',
  });

  Model.associate = function() {
    // app.model.CommentLike.hasMany(app.model.Article, { foreignKey: 'articleId', targetKey: 'id' });
  };

  return Model;
};
