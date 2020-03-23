require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('./config/passport');
const hbs = require('hbs');
const axios = require('axios');

const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

mongoose.connect(`${process.env.MONGODB_URI}jobsity-chat`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
}).catch(() => console.log('Error while connecting to Database! Make sure Mongo is running on your server!', 'M00001'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(cookieParser());
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

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

app.use(function(req, res, next){
  res.io = io;
  next();
});

app.use('/auth', require('./routes/auth'));
app.use('/', require('./routes/index'));

// app.get('*', (req, res) => {
//   res.redirect('/');
// });

server.listen(process.env.PORT);

io.on('connection', (socket) => {
  socket.emit('messageToClients', { text: 'Welcome to the chat server!', initial: true });

  socket.on('newMessageToServer', ({ text, user }) => {
    if (text[0] === '/') {
      const splitCommand = text.split('=');
      socket.emit('messageToClients', { text, user });
      if (splitCommand[0] === '/stock') {
        axios.get(`https://stooq.com/q/l/?s=${splitCommand[1]}&f=sd2t2ohlcv&h&e=csv`)
          .then(result => {
            const splitResult = result.data.split('\n')[1].split(',');
            if (splitResult[6] === 'N/D') {
              socket.emit('messageToClients', { user: 'BOT', text: `The stock ${splitResult[0]} was not found!` });
            } else {
              socket.emit('messageToClients', { user: 'BOT', text: `${splitResult[0]} quote is $${splitResult[6]} per share!` });
            }
          })
          .catch((e) => {
            socket.emit('messageToClients', { user: 'BOT', text: 'An error occurred while getting information about your stock!' });
          });
      }
    } else {
      io.emit('messageToClients', { user, text });
    }
  });
});
