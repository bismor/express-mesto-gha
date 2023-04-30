/* eslint-disable no-unused-vars */
const card = require('../models/card');
const HTTP_STATUS_CODE = require('../utils/http-status-code');

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
    const userId = req.user._id;
    const cardData = await card.findOneAndRemove({ _id: req.params.cardId, owner: userId });
    if (cardData) {
      res.status(HTTP_STATUS_CODE.OK).send({ data: cardData });
    }
  } catch (error) {
    next(error);
  }
};

module.exports.likeCard = async (req, res, next) => {
  try {
    const data = await card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    );

    res.status(HTTP_STATUS_CODE.OK)
      .send({ data });
  } catch (error) {
    next(error);
  }
};

module.exports.dislikeCard = async (req, res, next) => {
  try {
    const data = await card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    );

    res.status(HTTP_STATUS_CODE.OK)
      .send({ data });
  } catch (error) {
    next(error);
  }
};
