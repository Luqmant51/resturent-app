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
// db.Event = require('./event.model')(conn, DataTypes);
// db.Booking = require('./booking.model')(conn, DataTypes);

// // Define associations
// db.User.hasMany(db.Booking, { foreignKey: 'user_id' });
// db.Event.hasMany(db.Booking, { foreignKey: 'event_id' });

// db.Booking.belongsTo(db.User, { foreignKey: 'user_id' });
// db.Booking.belongsTo(db.Event, { foreignKey: 'event_id' });



module.exports = db;
