const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const feedRoutes = require('./routes/feed');
const pratoRoutes = require('./routes/prato');
const helmet = require('helmet');
const compression = require('compression');

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'images');
  },
  filename: (req, file, cb) => {
      /** DON'T USE .toISOString() on windows */
      cb(null, Date.now() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
  ) {
      cb(null, true);
  } else {
      cb(null, false);
  }
};

app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded <form>
// app.use(express.json()); // application/json
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization'
    );
    next();
});

app.use('/feed', feedRoutes);
app.use('/cantina', pratoRoutes);
app.use(helmet());
app.use(compression());

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

mongoose
.connect(
  `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.752m5.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority&appName=Cluster0`
)
.then(result => {
  app.listen(process.env.PORT || 8080);
})
.catch(err => console.log(err));
