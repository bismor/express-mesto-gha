const router = require('express').Router()
const {getUsers, createUser, getUserById} = require('../controllers/users')

router.get ('/:id', getUsers)
router.get ('/', getUserById)
router.post ('/', createUser)

module.exports = router;