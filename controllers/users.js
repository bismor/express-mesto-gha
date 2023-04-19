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
      .send({ message: 'INTERNAL_SERVER_ERROR' });
  }
};

module.exports.createUser = async (req, res) => {
  const { name, about, avatar } = req.body;

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
  const data = await user.create({ name, about, avatar });
  res.status(HTTP_STATUS_CODE.OK)
    .send({ data });
};

module.exports.getUserById = async (req, res) => {
  try {
    const data = await user.findById(req.params._id);
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
      .send({ message: 'INTERNAL_SERVER_ERROR' });
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

  try {
    const data = await user.findByIdAndUpdate(req.user._id, { name, about }, { new: true });
    if (data === null) {
      res
        .status(HTTP_STATUS_CODE.NOT_FOUND)
        .send({ message: 'Передан _id несуществующего пользователя' });
      return;
    }
  } catch (error) {
    res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
      .send({ message: 'INTERNAL_SERVER_ERROR' });
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

  try {
    const data = await user.findByIdAndUpdate(req.user._id, { avatar }, { new: true });
    if (data === null) {
      res
        .status(HTTP_STATUS_CODE.NOT_FOUND)
        .send({ message: 'Передан _id несуществующего пользователя' });
      return;
    }
  } catch (error) {
    res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
      .send({ message: 'INTERNAL_SERVER_ERROR' });
  }
};
