// const path = require('path');
// const express = require('express');
// const {
//   getUsers,
//   createUser,
//   getUserById,
// } = require('./users');

// const app = express();

// app.post('/users', createUser);
// app.get('/users', getUsers);
// app.delete('/users/:id', getUserById);

const user = require('../models/user')

module.exports.getUsers = (req, res) => {
  user.find({})
  .then(users => res.send({data: users}))
  .catch(err => res.status(500).send(err.message));
}

module.exports.createUser = (req, res) => {
  const {name, about, avatar} = req.body

  user.create({name, about, avatar})
  .then(newUser => res.send({data: newUser}))
  .catch(err => res.status(500).send(err.message))
}

module.exports.getUserById = (req, res) => {
  user.findById(req.params.id)
  .then(user => res.send({ data: user }))
  .catch(err => res.status(500).send(err.message));
}