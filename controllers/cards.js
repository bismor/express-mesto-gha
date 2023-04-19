/* eslint-disable no-unused-vars */
const card = require('../models/card');
const HTTP_STATUS_CODE = require('../utils/http-status-code');
const { isValidIbOjectId } = require('../utils/utils');

module.exports.getCards = async (req, res) => {
  try {
    const data = await card.find({});
    res.status(HTTP_STATUS_CODE.OK)
      .send({ data });
  } catch (error) {
    res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
      .send({ message: 'INTERNAL_SERVER_ERROR' });
  }
};

module.exports.createCard = async (req, res) => {
  const {
    name, link,
  } = req.body;

  if (typeof name !== 'string' || name.length < 2 || name.length > 30) {
    res
      .status(HTTP_STATUS_CODE.BAD_REQUEST)
      .send({
        message: 'Поле "name" должно быть строкой с минимальной длинной 2 смвола и максимально 30',
      });
    return;
  }

  if (typeof link !== 'string') {
    res.status(HTTP_STATUS_CODE.BAD_REQUEST)
      .send({
        message: 'Поле "link" должно быть строкой',
      });
    return;
  }
  const data = await card.create({
    name, link, owner: req.user._id,
  });
  res.status(HTTP_STATUS_CODE.OK)
    .send({ data });
};

module.exports.deleteCardById = async (req, res) => {
  try {
    const data = await card.findByIdAndRemove(req.params._id);

    if (data === null) {
      res
        .status(HTTP_STATUS_CODE.NOT_FOUND)
        .send({ message: 'Передан _id несуществующей карточки' });
      return;
    }
    res.status(HTTP_STATUS_CODE.NO_CONTENT)
      .send();
  } catch (error) {
    res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
      .send({ message: 'INTERNAL_SERVER_ERROR' });
  }
};

module.exports.likeCard = async (req, res) => {
  if (!isValidIbOjectId(req.params.cardId)) {
    res
      .status(HTTP_STATUS_CODE.BAD_REQUEST)
      .send({ message: 'Передан неккоректный ID карточки' });
    return;
  }

  if (!isValidIbOjectId(req.user._id)) {
    res
      .status(HTTP_STATUS_CODE.BAD_REQUEST)
      .send({ message: 'Передан неккоректный ID пользователя' });
    return;
  }

  try {
    const data = await card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    );

    if (data === null) {
      res
        .status(HTTP_STATUS_CODE.NOT_FOUND)
        .send({ message: 'Передан _id несуществующей карточки' });
      return;
    }

    res.status(HTTP_STATUS_CODE.NO_CONTENT)
      .send();
  } catch (error) {
    res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
      .send({ message: 'INTERNAL_SERVER_ERROR' });
  }
};

module.exports.dislikeCard = async (req, res) => {
  if (!isValidIbOjectId(req.params.cardId)) {
    res
      .status(HTTP_STATUS_CODE.BAD_REQUEST)
      .send({ message: 'Передан неккоректный ID карточки' });
    return;
  }

  if (!isValidIbOjectId(req.user._id)) {
    res
      .status(HTTP_STATUS_CODE.BAD_REQUEST)
      .send({ message: 'Передан неккоректный ID пользователя' });
    return;
  }

  try {
    const data = await card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    );

    if (data === null) {
      res
        .status(HTTP_STATUS_CODE.NOT_FOUND)
        .send({ message: 'Передан _id несуществующей карточки' });
      return;
    }

    res.status(HTTP_STATUS_CODE.NO_CONTENT)
      .send();
  } catch (error) {
    res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
      .send({ message: 'INTERNAL_SERVER_ERROR' });
  }
};
