const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const HTTP_STATUS_CODE = require('../utils/http-status-code');
const { isValidIbOjectId } = require('../utils/utils');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const UnauthorizedError = require('../errors/unauthorized-err');

module.exports.getUsers = async (req, res) => {
  if (!isValidIbOjectId(req.user._id)) {
    throw new UnauthorizedError('Передан неккоректный ID пользователя');
  }

  try {
    const data = await user.find({});
    res.status(HTTP_STATUS_CODE.OK)
      .send({ data });
  } catch (error) {
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
      .send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.createUser = async (req, res) => {
  const {
    name, about, avatar,
  } = req.body;

  if (typeof name === 'string' && (name.length <= 2 || name.length >= 30)) {
    throw new BadRequestError('Поле "name" должно быть строкой с минимальной длинной 2 смвола и максимально 30');
  }

  if (typeof about === 'string' && (about.length <= 2 || about.length >= 30)) {
    throw new BadRequestError('Поле "about" должно быть строкой с минимальной длинной 2 смвола и максимально 30');
  }

  if (typeof avatar === 'string') {
    throw new BadRequestError('Поле "avatar" должно быть строкой');
  }
  const data = await bcrypt.hash(req.body.password, 10).then((hash) => user.create({
    name,
    about,
    avatar,

    email: req.body.email,
    password: hash, // записываем хеш в базу
  }));
  res.status(HTTP_STATUS_CODE.OK)
    .send({ data });
};

module.exports.getUserById = async (req, res) => {
  if (!isValidIbOjectId(req.params.userId)) {
    throw new BadRequestError('Передан неккоректный ID пользователя');
  }

  try {
    const data = await user.findById(req.params.userId);
    if (data === null) {
      throw new NotFoundError('Передан "userId" несуществующего пользователя');
    }
    res.status(HTTP_STATUS_CODE.OK)
      .send({ data });
  } catch (error) {
    res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
      .send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.updateProfile = async (req, res) => {
  if (!isValidIbOjectId(req.user._id)) {
    throw new BadRequestError('Передан неккоректный ID пользователя');
  }

  const { name, about } = req.body;

  if (typeof name !== 'string' || name.length <= 2 || name.length >= 30) {
    throw new BadRequestError('Поле "name" должно быть строкой с минимальной длинной 2 смвола и максимально 30');
  }

  if (typeof about !== 'string' || about.length <= 2 || about.length >= 30) {
    throw new BadRequestError('Поле "about" должно быть строкой с минимальной длинной 2 смвола и максимально 30');
  }

  try {
    const data = await user.findByIdAndUpdate(req.user._id, { name, about }, { new: true });
    if (data === null) {
      throw new NotFoundError('Передан "userId" несуществующего пользователя');
    }
    res.status(HTTP_STATUS_CODE.OK)
      .send({ data });
  } catch (error) {
    res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
      .send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.updateAvatar = async (req, res) => {
  if (!isValidIbOjectId(req.user._id)) {
    throw new BadRequestError('Передан неккоректный ID пользователя');
  }

  const { avatar } = req.body;

  if (typeof avatar !== 'string') {
    throw new BadRequestError('Поле "avatar" должно быть строкой');
  }

  try {
    const data = await user.findByIdAndUpdate(req.user._id, { avatar }, { new: true });
    if (data === null) {
      throw new NotFoundError('Передан "_id" несуществующего пользователя');
    }
    res.status(HTTP_STATUS_CODE.OK)
      .send({ data });
  } catch (error) {
    res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
      .send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Поля "email" и "password" должны быть заполнены');
  }

  try {
    const userData = await user.findOne({ email }).select('+password');

    if (!userData) {
      throw new BadRequestError('Неправильные почта или пароль');
    }

    const isPasswordMatch = await bcrypt.compare(password, userData.password);

    if (!isPasswordMatch) {
      throw new BadRequestError('Неправильные почта или пароль');
    }

    const token = jwt.sign({ _id: userData._id }, 'some-secret-key', { expiresIn: '7d' });

    return res.status(HTTP_STATUS_CODE.OK).send({ token });
  } catch (error) {
    return res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
      .send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.getProfile = async (req, res) => {
  const userId = req.user._id;
  if (!isValidIbOjectId(userId)) {
    throw new BadRequestError('Передан неккоректный ID пользователя');
  }

  try {
    const data = await user.findById(userId);
    if (data === null) {
      throw new NotFoundError('Передан "userId" несуществующего пользователя');
    }
    res.status(HTTP_STATUS_CODE.OK)
      .send({ data });
  } catch (error) {
    res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
      .send({ message: 'На сервере произошла ошибка' });
  }
};
