const express = require('express');
const config = require('./config');
// parsers
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const mongoose = require('mongoose');

// database
const MONGODB_URI = 'mongodb+srv://' + config.mongoUser + ':' + config.mongoPass + '@cluster0.eolis.mongodb.net/aashroy';

// host and port
const hostname = '127.0.0.1';
const port = 8080;
const {graphqlHTTP} = require('express-graphql');
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolver');
const app = express();

// add routes here
// const homelessRoute = require('./routes/homeless');
// const authRoute = require('./routes/auth');

// disk object & parsers
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './images/');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-') +
    '-' + file.originalname.replace(/\s/g, '_'));
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
app.use(bodyParser.json());

app.use(
    multer({storage: fileStorage, fileFilter: fileFilter}).single('image'),
);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Route and paths
// app.use('/homelessRoute', homelessRoute);
// app.use('/auth', authRoute);

// public folder
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));


app.use('/graphql', graphqlHTTP({
  schema: graphqlSchema,
  rootValue: graphqlResolver,
  graphiql: true,
  customFormatErrorFn(err) {
    if (!err.originalError) {
      return err;
    }
    const data = err.originalError.data;
    const message = err.message || 'An error occurred';
    const code = err.originalError.code || 500;
    console.log('err');
    console.log(err);
    console.log();
    return {message: message, status: code, data: data};
  },
}),
);

// error handler
app.use((error, req, res, next)=>{
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({message: message, data: data});
});

// db connection
mongoose.set('bufferCommands', false);
// mongoose.connect(MONGODB_URI)
mongoose.connect(MONGODB_URI, {useNewUrlParser: true})
    .then((result)=>{
      app.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
      });
    })
    .catch((err)=>{
      console.log(err);
    });
