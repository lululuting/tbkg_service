/* indent size: 2 */
'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('user', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    userName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'admin',
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '$2a$10$ouyBweiOSOd7ifjhLYA7s.IFL4LtppcybkD0yn/Pup0rX9OAvkU62',
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    },
    autograph: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    post: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '无业游民',
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    tags: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    mobile: {
      type: DataTypes.STRING(11),
      allowNull: true,
    },
    cover: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'http://cdn.lululuting.com/ebe15f00-6531-11ea-9ef1-793305692a81',
    },
    wbUid: {
      type: DataTypes.STRING(11),
      allowNull: true,
    },
    auth: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '3',
    },
    songsId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '705619441',
    },
    status: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '1',
    },
    contact: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    rewardCode: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'user',
  });

  Model.associate = function() {
    app.model.User.hasMany(app.model.Fans, {
      foreignKey: 'userId',
      sourceKey: 'id',
      as: 'fans',
    });

    app.model.User.hasMany(app.model.Article, {
      foreignKey: 'userId',
      sourceKey: 'id',
      as: 'article',
    });


    app.model.User.belongsTo(app.model.Fans, {
      foreignKey: 'id',
      sourceKey: 'userId',
      as: 'fs',
    });
  };

  return Model;
};
