/* eslint-disable no-unused-vars */
const card = require('../models/card');
const HTTP_STATUS_CODE = require('../utils/http-status-code');
const { isValidIbOjectId } = require('../utils/utils');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');

module.exports.getCards = async (req, res, next) => {
  try {
    const data = await card.find({});
    res.status(HTTP_STATUS_CODE.OK)
      .send({ data });
  } catch (error) {
    next(error);
  }
};

module.exports.createCard = async (req, res, next) => {
  try {
    const {
      name, link,
    } = req.body;

    if (typeof name !== 'string' || name.length < 2 || name.length > 30) {
      throw new BadRequestError('Поле "name" должно быть строкой с минимальной длинной 2 смвола и максимально 30');
    }

    if (typeof link !== 'string') {
      throw new BadRequestError('Поле "Поле "link" должно быть строкой');
    }
    const data = await card.create({
      name, link, owner: req.user._id,
    });
    res.status(HTTP_STATUS_CODE.OK)
      .send({ data });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteCardById = async (req, res, next) => {
  try {
    if (!isValidIbOjectId(req.params.cardId)) {
      throw new BadRequestError('Передан неккоректный ID карточки');
    }
    const userId = req.user._id;
    const cardData = await card.findOneAndRemove({ _id: req.params.cardId, owner: userId });
    if (cardData) {
      res.status(HTTP_STATUS_CODE.OK).send({ data: cardData });
    }
    throw new NotFoundError('Передан _id несуществующей карточки');
  } catch (error) {
    next(error);
  }
};

module.exports.likeCard = async (req, res, next) => {
  try {
    if (!isValidIbOjectId(req.params.cardId)) {
      throw new BadRequestError('Передан неккоректный ID карточки');
    }

    if (!isValidIbOjectId(req.user._id)) {
      throw new BadRequestError('Передан неккоректный ID пользователя');
    }
    const data = await card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    );

    if (data === null) {
      throw new NotFoundError('Передан _id несуществующей карточки');
    }

    res.status(HTTP_STATUS_CODE.OK)
      .send({ data });
  } catch (error) {
    next(error);
  }
};

module.exports.dislikeCard = async (req, res, next) => {
  try {
    if (!isValidIbOjectId(req.params.cardId)) {
      throw new BadRequestError('Передан неккоректный ID карточки');
    }

    if (!isValidIbOjectId(req.user._id)) {
      throw new BadRequestError('Передан неккоректный ID карточки');
    }
    const data = await card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    );

    if (data === null) {
      throw new NotFoundError('Передан _id несуществующей карточки');
    }

    res.status(HTTP_STATUS_CODE.OK)
      .send({ data });
  } catch (error) {
    next(error);
  }
};
