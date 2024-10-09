const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Basket } = require("../models/models");

function getUserId(token) {
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  return decoded.id;
}

const generateJwt = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
    expiresIn: "744h",
  });
};

class UserController {
  async registration(req, res, next) {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return next(ApiError.badRequest("Некорректный email или password"));
    }
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      return next(
        ApiError.badRequest("Пользователь с таким email уже существует")
      );
    }
    const hashPassword = await bcrypt.hash(password, 5);
    const user = await User.create({ email, role, password: hashPassword });
    const basket = await Basket.create({ userId: user.id });
    const token = generateJwt(user.id, user.email, user.role);
    return res.json({ token });
  }

  async login(req, res, next) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(ApiError.internal("Пользователь не найден"));
    }
    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiError.internal("Указан неверный пароль"));
    }
    const token = generateJwt(user.id, user.email, user.role);
    return res.json({ token });
  }
  async getAll(req, res, next) {
    const users = await User.findAll();
    return res.json(users);
  }
  async updateProfile(req, res, next) {
    const { secondname, firstname, middlename, email, phone, organization } =
      req.body;
    const token = req.headers.authorization.split(" ")[1];
    const user_id = getUserId(token);
    try {
      await User.update(
        { secondname, firstname, middlename, email, phone, organization },
        { where: { id: user_id } }
      );
      const user = await User.findOne({ where: { id: user_id } });
      return res.json(user);
    } catch (error) {
      return next(ApiError.forbidden("Почта занята"));
    }
  }
  async getProfile(req, res, next) {
    const token = req.headers.authorization.split(" ")[1];
    const user_id = getUserId(token);
    const user = await User.findOne({ where: { id: user_id } });
    return res.json(user);
  }
}

module.exports = new UserController();
