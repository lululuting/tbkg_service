/* indent size: 2 */
'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('article', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    typeId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0',
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    introduce: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '',
    },
    viewCount: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0',
    },
    cover: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '0',
    },
    createTime: {
      type: DataTypes.TIME,
      allowNull: true,
      defaultValue: app.Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0',
    },
    tags: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '1',
    },
    state: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '1',
    },
  }, {
    tableName: 'article',
  });

  Model.associate = function() {

    app.model.Article.hasMany(app.model.ArticleLike, {
      foreignKey: 'articleId',
      sourceKey: 'id',
      as: 'al',
    });

    app.model.Article.hasMany(app.model.ClickLike, {
      foreignKey: 'articleId',
      sourceKey: 'id',
      as: 'cl',
    });

    app.model.Article.hasMany(app.model.Comment, {
      foreignKey: 'articleId',
      sourceKey: 'id',
      as: 'comment',
    });


    app.model.Article.belongsTo(app.model.CommentLike, { foreignKey: 'id', targetKey: 'articleId', as: 'commentLike' });
    app.model.Article.belongsTo(app.model.User, { foreignKey: 'userId', targetKey: 'id', as: 'user' });
    app.model.Article.belongsTo(app.model.Type, { foreignKey: 'typeId', targetKey: 'id', as: 'type' });
  };

  return Model;
};
