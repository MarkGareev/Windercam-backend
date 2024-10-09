const {
  Software,
  Component,
  Picture,
  Base,
  Description,
} = require("../models/models");
const ApiError = require("../error/ApiError");

class SoftwareController {
  async create(req, res, next) {
    try {
      const { name, description } = req.body;
      const software = await Software.create({
        name,
        description,
      });
      return res.json(software);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res) {
    const software = await Software.findAll({ order: [["id", "ASC"]] });
    const component = await Component.findAll({ order: [["id", "ASC"]] });

    software.forEach((item) => {
      item.dataValues.components = [];
      component.forEach((component) => {
        if (item.id === component.softwareId) {
          item.dataValues.components.push(component);
        }
      });
    });
    return res.json(software);
  }

  async getOne(req, res) {
    const { id: slug } = req.params;
    try {
      const software = await Software.findOne({
        where: { slug },
      });
      if (!software) {
        throw new Error();
      }
      const picture = await Picture.findAll({
        where: { softwareId: software.id },
      });
      const base = await Base.findAll({
        where: { softwareId: software.id },
      });
      const components = await Component.findAll({
        where: { softwareId: software.id },
      });
      const descriptions = await Description.findAll({
        where: { softwareId: software.id },
      });
      software.dataValues.components = [];
      software.dataValues.descriptions = descriptions;
      software.dataValues.pictures = picture;
      software.dataValues.base = base;

      components.forEach((component) => {
        if (software.id === component.softwareId) {
          software.dataValues.components.push(component);
        }
      });
      return res.json(software);
    } catch (error) {
      return res.json(ApiError.notFound("Не найднено"));
    }
  }
}

module.exports = new SoftwareController();
