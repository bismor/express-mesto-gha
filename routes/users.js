const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getUsers, createUser, getUserById, updateProfile, updateAvatar, login,
} = require('../controllers/users');

router.get('/', auth, getUsers);
router.get('/:userId', getUserById);
router.patch('/me', auth, updateProfile);
router.patch('/me/avatar', auth, updateAvatar);
router.post('/signin', login);
router.post('/signup', createUser);

module.exports = router;
