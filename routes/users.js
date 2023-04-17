const router = require('express').Router();
const {userSchema} = require('../models/card.js');

router.get('/users', (req, res) => {
  res.send(users);
})

router.get('/users/:id', (req, res) => {
  const { id } = req.params;

  if (!users[id]) {
    res.send({ error: 'Такого пользователя нет' });
    return;
  }

  res.send(users[id]);
});

module.exports = router;