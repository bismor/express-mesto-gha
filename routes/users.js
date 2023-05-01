const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');

const {
  getUsers, getUserById, updateProfile, updateAvatar, getProfile,
} = require('../controllers/users');

router.get('/me', auth, getProfile);
router.patch('/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.required().string().min(2).max(30),
    about: Joi.required().string().min(2).max(30),
  }),
}), updateProfile);
router.patch('/me/avatar', auth, celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/),
  }),
}), updateAvatar);
router.get('/', auth, getUsers);
router.get('/:userId', auth, celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
  }),
}), getUserById);

module.exports = router;
