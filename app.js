require('dotenv').config();
const cors = require('cors');
const fs = require('fs');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');
const { MongoClient } = require('mongodb');
const databaseConfig = require('./config/database');
const { userApiAuth }= require('./middleware/userApiAuth');

const mongoClient = new MongoClient(databaseConfig.dbURI);
mongoClient.connect(function(err) {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    return;
  }
  console.log('Connected to MongoDB');
});
const MongoStore = require('connect-mongo');

const rfs = require('rotating-file-stream');
const helmet = require('helmet');
const homeRouter = require('./routes/home');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const dashboardRouter = require('./routes/dashboard');
const adminRouter =require('./routes/admin');
const UserController = require('./controllers/userController');
const app = express();
const utilsPath = path.join(__dirname, 'utils');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'https://172.16.17.11',
  credentials: true
}));

const userController = new UserController();
app.use('/api', userApiAuth,userController.getRouter());
app.use(helmet());
app.use(cookieParser());

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 3600000,
    httpOnly: true,
    secure: false,
    sameSite: 'Lax'
  },
  store: new MongoStore({ 
    client: mongoClient, 
    dbName: databaseConfig.dbName,
    collection: 'sessions'
  })
}));
        // Middleware per impostare la variabile req.session.Api se non è già impostata
// app.use((req, res, next) => {
//   if (!req.session.Api) {
//     req.session.Api = '*******************la-tua-stringa'; // Imposta il valore che desideri
//   }
//   next();
// });
// app.use((req, res, next) => {
//   console.log('Cookies: ', req.cookies);
//   console.log('Session: ', req.session);
//   next();
// });

var accessLogStream = rfs.createStream('access.log', {
  interval: '1d',
  path: path.join(__dirname)
});
app.use(morgan('combined', { stream: accessLogStream }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'utils')));
app.use('/model', express.static(path.join(__dirname, 'model')));
app.use('/utils', express.static(path.join(__dirname, 'model')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use('/utils', express.static(utilsPath, {
  setHeaders: (res, filePath) => {
    if (path.extname(filePath) === '.js') {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

app.use(homeRouter);
app.use(userApiAuth,usersRouter);
app.use(loginRouter);
app.use(logoutRouter);
app.use(dashboardRouter);
app.use(adminRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
