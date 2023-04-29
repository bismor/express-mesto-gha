const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const HTTP_STATUS_CODE = require('../utils/http-status-code');
const { isValidIbOjectId } = require('../utils/utils');

module.exports.getUsers = async (req, res) => {
  if (!isValidIbOjectId(req.user._id)) {
    res
      .status(HTTP_STATUS_CODE.UNAUTHORIZED)
      .send({ message: 'Передан неккоректный ID пользователя' });
    return;
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

  if (typeof name !== 'string' || name.length <= 2 || name.length >= 30) {
    res
      .status(HTTP_STATUS_CODE.BAD_REQUEST)
      .send({
        message: 'Поле "name" должно быть строкой с минимальной длинной 2 смвола и максимально 30',
      });
    return;
  }

  if (typeof about !== 'string' || about.length <= 2 || about.length >= 30) {
    res.status(HTTP_STATUS_CODE.BAD_REQUEST)
      .send({
        message: 'Поле "about" должно быть строкой с минимальной длинной 2 смвола и максимально 30',
      });
    return;
  }

  if (typeof avatar !== 'string') {
    res.status(HTTP_STATUS_CODE.BAD_REQUEST)
      .send({
        message: 'Поле "avatar" должно быть строкой',
      });
    return;
  }
  const data = await bcrypt.hash(req.body.password, 10).then((hash) => user.create({
    name: 'Жак-Ив Кусто',
    about: 'Исследователь',
    avatar: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',

    email: req.body.email,
    password: hash, // записываем хеш в базу
  }));
  res.status(HTTP_STATUS_CODE.OK)
    .send({ data });
};

module.exports.getUserById = async (req, res) => {
  if (!isValidIbOjectId(req.params.userId)) {
    res
      .status(HTTP_STATUS_CODE.BAD_REQUEST)
      .send({ message: 'Передан неккоректный ID пользователя' });
    return;
  }

  try {
    const data = await user.findById(req.params.userId);
    if (data === null) {
      res
        .status(HTTP_STATUS_CODE.NOT_FOUND)
        .send({ message: 'Передан "userId" несуществующего пользователя' });
      return;
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
    res
      .status(HTTP_STATUS_CODE.BAD_REQUEST)
      .send({ message: 'Передан неккоректный ID пользователя' });
    return;
  }

  const { name, about } = req.body;

  if (typeof name !== 'string' || name.length <= 2 || name.length >= 30) {
    res
      .status(HTTP_STATUS_CODE.BAD_REQUEST)
      .send({
        message: 'Поле "name" должно быть строкой с минимальной длинной 2 смвола и максимально 30',
      });
    return;
  }

  if (typeof about !== 'string' || about.length <= 2 || about.length >= 30) {
    res.status(HTTP_STATUS_CODE.BAD_REQUEST)
      .send({
        message: 'Поле "about" должно быть строкой с минимальной длинной 2 смвола и максимально 30',
      });
    return;
  }

  try {
    const data = await user.findByIdAndUpdate(req.user._id, { name, about }, { new: true });
    if (data === null) {
      res
        .status(HTTP_STATUS_CODE.NOT_FOUND)
        .send({ message: 'Передан _id несуществующего пользователя' });
      return;
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
    res
      .status(HTTP_STATUS_CODE.BAD_REQUEST)
      .send({ message: 'Передан неккоректный ID пользователя' });
    return;
  }

  const { avatar } = req.body;

  if (typeof avatar !== 'string') {
    res.status(HTTP_STATUS_CODE.BAD_REQUEST)
      .send({
        message: 'Поле "avatar" должно быть строкой',
      });
    return;
  }

  try {
    const data = await user.findByIdAndUpdate(req.user._id, { avatar }, { new: true });
    if (data === null) {
      res
        .status(HTTP_STATUS_CODE.NOT_FOUND)
        .send({ message: 'Передан _id несуществующего пользователя' });
      return;
    }
    res.status(HTTP_STATUS_CODE.OK)
      .send({ data });
  } catch (error) {
    res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
      .send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  user.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      res.send({ message: 'Всё верно!' });
    })
    .catch((err) => {
      res.status(401)
        .send({ message: err.message });
    });
  return user.findUserByCredentials(email, password)
    .then(() => {
      // создадим токен
      const token = jwt.sign({ _id: 'd285e3dceed844f902650f40' }, 'some-secret-key', { expiresIn: '7d' });

      // вернём токен
      res.send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};
