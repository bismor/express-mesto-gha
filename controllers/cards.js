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
