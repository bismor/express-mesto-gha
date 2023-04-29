const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const HTTP_STATUS_CODE = require('./utils/http-status-code');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res) => {
  res.status(HTTP_STATUS_CODE.NOT_FOUND).send({ message: 'Not Found' });
});

app.listen(3000);
