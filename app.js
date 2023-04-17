const express = require('express');
const mongoose = require('mongoose');


const app = express();

mongoose.connect('mongodb://localhost:27017/mydb', {
  useNewUrlParser: true,
  useCreateIndex: true,
    useFindAndModify: false
});

app.listen(3000);
app.use(express.static(path.join(__dirname, 'public')));