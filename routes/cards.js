const router = require('express').Router();
const { getCards, createCard, deleteCardById } = require('../controllers/users');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCardById);

module.exports = router;
