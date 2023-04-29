const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getUsers, createUser, getUserById, updateProfile, updateAvatar, login, getProfile,
} = require('../controllers/users');

router.get('/me', auth, getProfile);
router.patch('/me', auth, updateProfile);
router.patch('/me/avatar', auth, updateAvatar);
router.post('/signin', login);
router.post('/signup', createUser);
router.get('/', auth, getUsers);
router.get('/:userId', getUserById);

module.exports = router;
