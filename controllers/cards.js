/* eslint-disable no-unused-vars */
const card = require('../models/card');

module.exports.getCards = (req, res) => {
  card.find({})
    .then((allCards) => res.send({ data: allCards }))
    .catch((err) => res.status(500).send(err.message));
};

module.exports.createCard = (req, res) => {
  const {
    name, link,
  } = req.body;
  card.create({
    name, link,
  })
    .then((newCard) => res.send({ data: newCard }))
    .catch((err) => res.status(500).send(err.message));
};

module.exports.deleteCardById = (req, res) => {
  card.findByIdAndRemove(req.params._id)
    .then((deleteCard) => res.send({ data: deleteCard }))
    .catch((err) => res.status(500).send(err.message));
};

module.exports.likeCard = (req, res) => card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
);

module.exports.dislikeCard = (req, res) => card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
);
