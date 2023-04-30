const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const HTTP_STATUS_CODE = require('../utils/http-status-code');
const { isValidIbOjectId } = require('../utils/utils');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');
const UnauthorizedError = require('../errors/unauthorized-err');

module.exports.getUsers = async (req, res, next) => {
  if (!isValidIbOjectId(req.user._id)) {
    next(new UnauthorizedError('Передан неккоректный ID пользователя'));
  }

  try {
    const data = await user.find({});
    res.status(HTTP_STATUS_CODE.OK)
      .send({ data });
  } catch (error) {
    next(error);
  }
};

module.exports.createUser = async (req, res, next) => {
  const {
    name, about, avatar, email,
  } = req.body;

  if (typeof name === 'string' && (name.length <= 2 || name.length >= 30)) {
    next(new BadRequestError('Поле "name" должно быть строкой с минимальной длинной 2 смвола и максимально 30'));
  }

  if (typeof about === 'string' && (about.length <= 2 || about.length >= 30)) {
    next(new BadRequestError('Поле "about" должно быть строкой с минимальной длинной 2 смвола и максимально 30'));
  }

  if (typeof avatar === 'string') {
    next(new BadRequestError('Поле "avatar" должно быть строкой'));
  }

  try {
    const userEmail = await user.findOne({ email });
    if (userEmail) {
      throw new ConflictError('Такой email уже существует');
    }

    const data = await bcrypt.hash(req.body.password, 10).then((hash) => user.create({
      name,
      about,
      avatar,

      email: req.body.email,
      password: hash, // записываем хеш в базу
    }));
    res.status(HTTP_STATUS_CODE.OK).send({ data });
  } catch (error) {
    next(error);
  }
};

module.exports.getUserById = async (req, res, next) => {
  if (!isValidIbOjectId(req.params.userId)) {
    next(new BadRequestError('Передан неккоректный ID пользователя'));
  }

  try {
    const data = await user.findById(req.params.userId);
    if (data === null) {
      throw new NotFoundError('Передан "userId" несуществующего пользователя');
    }
    res.status(HTTP_STATUS_CODE.OK)
      .send({ data });
  } catch (error) {
    next(error);
  }
};

module.exports.updateProfile = async (req, res, next) => {
  if (!isValidIbOjectId(req.user._id)) {
    next(new BadRequestError('Передан неккоректный ID пользователя'));
  }

  const { name, about } = req.body;

  if (typeof name !== 'string' || name.length <= 2 || name.length >= 30) {
    next(new BadRequestError('Поле "name" должно быть строкой с минимальной длинной 2 смвола и максимально 30'));
  }

  if (typeof about !== 'string' || about.length <= 2 || about.length >= 30) {
    next(new BadRequestError('Поле "about" должно быть строкой с минимальной длинной 2 смвола и максимально 30'));
  }

  try {
    const data = await user.findByIdAndUpdate(req.user._id, { name, about }, { new: true });
    if (data === null) {
      throw new NotFoundError('Передан "userId" несуществующего пользователя');
    }
    res.status(HTTP_STATUS_CODE.OK)
      .send({ data });
  } catch (error) {
    next(error);
  }
};

module.exports.updateAvatar = async (req, res, next) => {
  if (!isValidIbOjectId(req.user._id)) {
    next(new BadRequestError('Передан неккоректный ID пользователя'));
  }

  const { avatar } = req.body;

  if (typeof avatar !== 'string') {
    next(new BadRequestError('Поле "avatar" должно быть строкой'));
  }

  try {
    const data = await user.findByIdAndUpdate(req.user._id, { avatar }, { new: true });
    if (data === null) {
      throw new NotFoundError('Передан "_id" несуществующего пользователя');
    }
    res.status(HTTP_STATUS_CODE.OK)
      .send({ data });
  } catch (error) {
    next(error);
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new BadRequestError('Поля "email" и "password" должны быть заполнены'));
  }

  try {
    const userData = await user.findOne({ email }).select('+password');
    const isPasswordMatch = await bcrypt.compare(password, userData.password);

    if (!isPasswordMatch || !userData) {
      throw new BadRequestError('Неправильные почта или пароль');
    }

    const token = jwt.sign({ _id: userData._id }, 'some-secret-key', { expiresIn: '7d' });

    res.status(HTTP_STATUS_CODE.OK).send({ token });
  } catch (error) {
    next(error);
  }
};

module.exports.getProfile = async (req, res, next) => {
  const userId = req.user._id;
  if (!isValidIbOjectId(userId)) {
    next(new BadRequestError('Передан неккоректный ID пользователя'));
  }

  try {
    const data = await user.findById(userId);
    if (data === null) {
      throw new NotFoundError('Передан "userId" несуществующего пользователя');
    }
    res.status(HTTP_STATUS_CODE.OK)
      .send({ data });
  } catch (error) {
    next(error);
  }
};
