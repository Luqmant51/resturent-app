// models/index.js

const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config');

const conn = new Sequelize('resturent_app', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        timestamps: false,
        freezeTableName: true
    }
});

const db = {};

db.Sequelize = Sequelize;
db.conn = conn;

db.User = require('./user.model')(conn, DataTypes);
db.Menu = require('./menu.model')(conn, DataTypes);
db.Order = require('./order.model')(conn, DataTypes);


// Associations
db.User.hasMany(db.Order, { foreignKey: 'user_id', onDelete: 'CASCADE' });
db.Menu.hasMany(db.Order, { foreignKey: 'menu_id', onDelete: 'CASCADE' });

db.Order.belongsTo(db.User, { foreignKey: 'user_id' });
db.Order.belongsTo(db.Menu, { foreignKey: 'menu_id' });

module.exports = db;
