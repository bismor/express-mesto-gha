const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', auth, getCards);
router.post('/', auth, celebrate({
  body: Joi.object.keys({
    link: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), createCard);
router.delete('/:cardId', auth, celebrate({
  params: Joi.object.keys({
    cardId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
  }),
}), deleteCardById);
router.put('/:cardId/likes', auth, celebrate({
  params: Joi.object.keys({
    cardId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
  }),
}), likeCard);
router.delete('/:cardId/likes', auth, celebrate({
  params: Joi.object.keys({
    cardId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
  }),
}), dislikeCard);

module.exports = router;
