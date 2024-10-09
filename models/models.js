const { version } = require("uuid");
const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: "USER" },
  firstname: { type: DataTypes.STRING },
  secondname: { type: DataTypes.STRING },
  middlename: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  organization: { type: DataTypes.STRING },
});

const Basket = sequelize.define("basket", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});
const BasketComponent = sequelize.define("basket_component", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  quantity: { type: DataTypes.INTEGER },
});
const Component = sequelize.define("component", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
});
const Software = sequelize.define("software", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  description: { type: DataTypes.TEXT },
  version: { type: DataTypes.STRING },
  img: { type: DataTypes.STRING },
  pdf: { type: DataTypes.STRING },
  slug: { type: DataTypes.STRING },
});
const Description = sequelize.define("description", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  text: { type: DataTypes.TEXT },
});
const Picture = sequelize.define("picture", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  path: { type: DataTypes.STRING },
});
const Base = sequelize.define("base", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
});
const Order = sequelize.define("order", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  amount: { type: DataTypes.INTEGER, defaultValue: 0 },
});
const OrderComponent = sequelize.define("order_component", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  quantity: { type: DataTypes.INTEGER },
});

const Message = sequelize.define("message", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  text: { type: DataTypes.TEXT },
});
const File = sequelize.define("file", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  newFileName: { type: DataTypes.STRING, allowNull: false },
  oldFileName: { type: DataTypes.STRING, allowNull: false },
});
const Chat = sequelize.define("chat", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  topic: { type: DataTypes.STRING, allowNull: false },
});

User.hasOne(Basket);
Basket.belongsTo(User);

Basket.belongsToMany(Component, { through: BasketComponent });
Component.belongsToMany(Basket, { through: BasketComponent });

Software.hasMany(Picture);
Picture.belongsTo(Software);

Software.hasMany(Base);
Base.belongsTo(Software);

Software.hasMany(Description);
Description.belongsTo(Software);

Software.hasMany(Component);
Component.belongsTo(Software);

Software.hasMany(Component);
Component.belongsTo(Software);

Order.belongsToMany(Component, { through: OrderComponent });
Component.belongsToMany(Order, { through: OrderComponent });

User.hasMany(Order);
Order.belongsTo(User);

Chat.hasMany(Message);
Message.belongsTo(Chat);

Message.hasMany(File);
File.belongsTo(Message);

User.hasMany(Message);
Message.belongsTo(User);

User.hasMany(Chat);
Chat.belongsTo(User);

module.exports = {
  User,
  Basket,
  BasketComponent,
  Component,
  Software,
  Picture,
  Description,
  Base,
  Order,
  OrderComponent,
  Message,
  File,
  Chat,
};
