const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const auth = require('./middlewares/auth');
const HTTP_STATUS_CODE = require('./utils/http-status-code');
const {
  createUser, login,
} = require('./controllers/users');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().regex(/^\S+@\S+\.\S+$/),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().required().regex(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/),
    email: Joi.string().required().regex(/^\S+@\S+\.\S+$/),
    password: Joi.string().required(),
  }),
}), createUser);

app.use('/users', require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res) => {
  res.status(HTTP_STATUS_CODE.NOT_FOUND).send({ message: 'Not Found' });
});
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  if (err.code === 11000) {
    res.status(HTTP_STATUS_CODE.CONFLICT).send({ message: 'Такой email уже существует' });
  }
  if (err) {
    res
      .status(statusCode)
      .send({
        // проверяем статус и выставляем сообщение в зависимости от него
        message: statusCode === 500
          ? 'На сервере произошла ошибка'
          : message,
      });
  } else { next(); }
});

app.listen(3000);
