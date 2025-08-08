module.exports = (sequelize, DataTypes) => {
  return sequelize.define("menus", {
    menu_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    menu_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    food_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
        description: {   // <-- New description field
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    image_path: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
};
