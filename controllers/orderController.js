const ApiError = require("../error/ApiError");
const jwt = require("jsonwebtoken");
const {
  Order,
  OrderComponent,
  Component,
  Software,
} = require("../models/models");
const basketController = require("./basketController");
function getUserId(token) {
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  return decoded.id;
}
class orderController {
  async getOrders(req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const user_id = getUserId(token);

    try {
      const orders = await Order.findAll({
        where: { userId: user_id },
        order: [["id", "DESC"]],
      });
      for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        const orderComponents = await OrderComponent.findAll({
          where: {
            orderId: order.id,
          },
          order: [["id", "ASC"]],
        });
        order.dataValues.components = [];
        for (let j = 0; j < orderComponents.length; j++) {
          const orderComponent = orderComponents[j];
          const component = await Component.findOne({
            where: {
              id: orderComponent.componentId,
            },
          });
          const software = await Software.findOne({
            where: {
              id: component.softwareId,
            },
          });
          component.dataValues.software = software;
          component.dataValues.quantity = orderComponent.quantity;
          order.dataValues.components.push(component);
        }

        const softwaresOrder = [];
        order.dataValues.components.forEach((component) => {
          softwaresOrder.push(component.softwareId);
        });
        const uniqueSoftwaresIdOrder = [...new Set(softwaresOrder)];
        order.dataValues.softwares = await Software.findAll({
          where: {
            id: uniqueSoftwaresIdOrder,
          },
        });
        order.dataValues.softwares.forEach((software) => {
          software.dataValues.components = [];
          order.dataValues.components.forEach((component) => {
            if (software.id === component.softwareId) {
              software.dataValues.components.push(component);
            }
            delete component.dataValues.software;
          });
        });
        delete order.dataValues.components;
      }

      return res.json(orders);
    } catch (error) {
      return res.json(ApiError.internal(error.message));
    }
  }
  async createOrder(req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const user_id = getUserId(token);
    let amount = 0;

    const basketComponents = await basketController.clearBasket(user_id);
    const order = await Order.create({
      userId: user_id,
    });

    for (let i = 0; i < basketComponents.length; i++) {
      const element = basketComponents[i];
      await OrderComponent.create({
        orderId: order.id,
        quantity: element.quantity,
        componentId: element.componentId,
      });
      const component = await Component.findOne({
        where: { id: element.componentId },
      });
      amount += component.price;
    }
    await Order.update(
      {
        amount,
      },
      {
        where: { id: order.id },
      }
    );

    return res.json("Заказ сформирован");
  }
}

module.exports = new orderController();
