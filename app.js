require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const passport = require('./config/passport');
const socketio = require('socket.io');

const app = express();

mongoose.connect(`${process.env.MONGODB_URI}jobsity-chat`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
}).catch(() => console.log('Ocorreu um erro ao conectar com o banco de dados!', 'M00001'));

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(cookieParser());

app.use(express.static(__dirname + '/public'));

app.use(session({
  secret: 'jobsity-chat',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
  }),
}));

app.use(passport.initialize());
app.use(passport.session());
app.get('/*/', (req, res) => res.sendFile(__dirname));
app.use(flash());

// app.use('/auth', require('./routes/auth'));

app.get('*', (req, res) => {
  res.sendFile(`${__dirname}/public/chat.html`);
});

app.use((req, res) => {
  res.status(404);
  res.render('not-found');
});

app.use((err, req, res) => {
  console.error('ERROR', req.method, req.path, err);

  if (!res.headersSent) {
    res.status(500);
    res.render('error');
  }
});

const expressServer = app.listen(process.env.PORT);
const server = socketio(expressServer);

server.of('/').on('connection', (socket) => {
  socket.emit('messageToClients', { text: 'Welcome to the chat server!', initial: true });

  socket.on('newMessageToServer', ({ text }) => {
    server.emit('messageToClients', { text });
  });
});
