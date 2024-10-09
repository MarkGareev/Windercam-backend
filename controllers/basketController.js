const ApiError = require("../error/ApiError");
const jwt = require("jsonwebtoken");
const {
  Basket,
  BasketComponent,
  Component,
  Software,
} = require("../models/models");

function getUserId(token) {
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  return decoded.id;
}
class BasketController {
  async getBasket(req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const user_id = getUserId(token);

    const basket = await Basket.findOne({
      where: { id: user_id },
    });
    const basketItems = await BasketComponent.findAll({
      where: { basketId: basket.id },
    });
    const componentsId = basketItems.map((component) => component.componentId);
    const components = await Component.findAll({
      where: {
        id: componentsId,
      },
    });
    components.forEach((component, index) => {
      component.dataValues.quantity = basketItems[index].quantity;
    });
    const softwareId = components.map((component) => component.softwareId);
    const uniqueSoftwareId = Array.from(new Set(softwareId));
    const softwares = await Software.findAll({
      where: {
        id: uniqueSoftwareId,
      },
    });
    softwares.forEach((software) => {
      software.dataValues.components = [];
      components.forEach((component) => {
        if (software.id === component.softwareId)
          software.dataValues.components.push(component);
      });
    });
    return res.json(softwares);
  }
  async addItemToBasket(req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const user_id = getUserId(token);
    const componentsId = req.body;
    try {
      const basket = await Basket.findOne({
        where: { id: user_id },
      });
      const basketComponents = await BasketComponent.findAll({
        where: { basketId: basket.id },
      });
      const basketComponentsID = basketComponents.map((basketComponent) => {
        return basketComponent.componentId;
      });
      componentsId.forEach(async (componentId) => {
        if (!basketComponentsID.includes(componentId))
          await BasketComponent.create({
            quantity: 1,
            basketId: basket.id,
            componentId,
          });
      });
      return res.json(basketComponentsID);
    } catch (error) {
      return res.json(ApiError.internal(error.message));
    }
  }
  async updateQuantuity(req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const user_id = getUserId(token);

    const { componentId, quantity } = req.body;

    try {
      const basket = await Basket.findOne({
        where: { id: user_id },
      });
      if (quantity === 0) {
        const basketComponent = await BasketComponent.destroy({
          where: { componentId: componentId },
        });
      }
      const basketComponent = await BasketComponent.update(
        {
          quantity,
          basket: basket.id,
        },
        {
          where: { componentId },
        }
      );
      return res.json("Изменено");
    } catch (error) {
      return res.json(ApiError.internal(error.message));
    }
  }
  async deleteItemFromBasket(req, res) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const user_id = getUserId(token);

      const { componentId } = req.body;
      const basket = await Basket.findOne({
        where: { userId: user_id },
      });
      await BasketComponent.destroy({
        where: { componentId, basketId: basket.id },
      });
      return res.json("Удалено");
    } catch (error) {
      return res.json(ApiError.internal(error.message));
    }
  }
  async clearBasket(user_id) {
    try {
      const basket = await Basket.findOne({
        where: { userId: user_id },
      });
      const basketComponent = await BasketComponent.findAll({
        where: { basketId: basket.id },
      });
      await BasketComponent.destroy({
        where: { basketId: basket.id },
      });
      return basketComponent;
    } catch (error) {
      return res.json(ApiError.internal(error.message));
    }
  }
}

module.exports = new BasketController();
