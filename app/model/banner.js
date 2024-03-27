/* indent size: 2 */
'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('banner', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '1',
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0',
    },
    createTime: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: app.Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    type: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '3',
    },
  }, {
    tableName: 'banner',
  });

  Model.associate = function() {
    // 一对一关联,X 表的 id 唯一对应 Y 表的 cs_id
    app.model.Banner.hasOne(app.model.User, {
      foreignKey: 'id',
      sourceKey: 'userId',
      as: 'user', // 查询结果中，给 Y 表配置一个别名
    });
    // 一对多关联，Z 表的 cs_id 有多个与 X 表的 id 对应
    // app.model.Banner.hasMany(app.postgres.Z, {
    //   foreignKey: 'cs_id',
    //   sourceKey: 'id',
    // });
  };

  return Model;
};
