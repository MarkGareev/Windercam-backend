const ApiError = require("../error/ApiError");
const jwt = require("jsonwebtoken");
const { Message, File, Chat, User } = require("../models/models");
const uuid = require("uuid");
const path = require("path");

function getUserId(token) {
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  return decoded.id;
}
function getUserRole(token) {
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  return decoded.role;
}
async function handleFile(file, messageId) {
  const oldFileName = file.name;
  const fileName = uuid.v4();
  const newFileName = fileName + file.name;
  file.mv(path.resolve(__dirname, "..", "static/users", newFileName));
  const fileResponse = await File.create({
    newFileName,
    oldFileName,
    messageId,
  });
  return fileResponse;
}

class supportController {
  async createSupport(req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const user_id = getUserId(token);
    const user_role = getUserRole(token);
    const { topic, text } = req.body;
    const reqFiles = req.files;

    try {
      const chat = await Chat.create({
        topic,
        userId: user_id,
      });
      const message = await Message.create({
        text,
        chatId: chat.id,
        userId: user_id,
      });
      const fileResponse = [];
      for (let i = 0; i < reqFiles?.files.length; i++) {
        const file = reqFiles?.files[i];
        const handledFile = await handleFile(file, message.id);
        fileResponse.push(handledFile);
      }

      message.dataValues.files = fileResponse;
      message.dataValues.isSpecialist = user_role === "ADMIN";

      chat.dataValues.messages = message;

      return res.json(chat);
    } catch (error) {
      return res.json(ApiError.internal(error.message));
    }
  }

  async getSupports(req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const user_id = getUserId(token);

    try {
      const chats = await Chat.findAll({
        where: {
          userId: user_id,
        },
        order: [["id", "DESC"]],
      });
      return res.json(chats);
    } catch (error) {
      return res.json(ApiError.internal(error.message));
    }
  }
  async getAllSupports(req, res) {
    try {
      const chats = await Chat.findAll({
        order: [["id", "ASC"]],
      });
      return res.json(chats);
    } catch (error) {
      return res.json(ApiError.internal(error.message));
    }
  }
  async getSupport(req, res) {
    const { id } = req.params;
    try {
      const chat = await Chat.findOne({
        where: {
          id,
        },
      });
      // добавить middleware на проверку пользователя
      const messages = await Message.findAll({
        where: {
          chatId: chat.id,
        },
      });
      for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        const user = await User.findOne({
          where: {
            id: message.userId,
          },
        });
        message.dataValues.isSpecialist = user.role === "ADMIN";

        const files = await File.findAll({
          where: {
            messageId: message.id,
          },
        });
        message.dataValues.files = files;
      }

      chat.dataValues.messages = messages;

      return res.json(chat);
    } catch (error) {
      return res.json(ApiError.internal(error.message));
    }
  }
  async sendMessage(req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const user_id = getUserId(token);
    const user_role = getUserRole(token);
    const { id } = req.params;
    const { text } = req.body;
    const reqFiles = req.files;

    try {
      const chat = await Chat.findOne({
        where: {
          id,
        },
      });

      const message = await Message.create({
        text,
        userId: user_id,
        chatId: chat.id,
      });
      const fileResponse = [];
      if (Array.isArray(reqFiles?.files))
        for (let i = 0; i < reqFiles?.files.length; i++) {
          const file = reqFiles?.files[i];
          const handledFile = await handleFile(file, message.id);
          fileResponse.push(handledFile);
        }
      else {
        const file = reqFiles?.files;
        const handledFile = await handleFile(file, message.id);
        fileResponse.push(handledFile);
      }

      message.dataValues.files = fileResponse;
      message.dataValues.isSpecialist = user_role === "ADMIN";
      return res.json(message);
    } catch (error) {
      return res.json(ApiError.internal(error.message));
    }
  }
}

module.exports = new supportController();
