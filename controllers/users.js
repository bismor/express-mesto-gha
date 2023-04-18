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
  user.findById(req.params._id)
    .then((getUser) => res.send({ data: getUser }))
    .catch((err) => res.status(500).send(err.message));
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  user.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((updateUser) => res.send({ data: updateUser }))
    .catch((err) => res.status(500).send(err.message));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  user.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((updateAvatar) => res.send({ data: updateAvatar }))
    .catch((err) => res.status(500).send(err.message));
};
