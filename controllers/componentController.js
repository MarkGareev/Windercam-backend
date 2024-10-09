const { Component } = require("../models/models");
const ApiError = require("../error/ApiError");

class ComponentController {
  async create(req, res, next) {
    try {
      let { name, price, softwareId } = req.body;
      const component = await Component.create({
        name,
        price,
        softwareId,
      });

      return res.json(component);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res) {
    let component = await Component.findAll();
    return res.json(component);
  }

  async getOne(req, res) {
    const { id } = req.params;
    const component = await Component.findOne({
      where: { id },
    });
    return res.json(component);
  }
}

module.exports = new ComponentController();
