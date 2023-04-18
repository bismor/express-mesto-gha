const user = require('../models/user');

module.exports.getUsers = (req, res) => {
  user.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send(err.message));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  user.create({ name, about, avatar })
    .then((newUser) => res.send({ data: newUser }))
    .catch((err) => res.status(500).send(err.message));
};

module.exports.getUserById = (req, res) => {
  user.findById(req.params.id)
    .then((getUser) => res.send({ data: getUser }))
    .catch((err) => res.status(500).send(err.message));
};
