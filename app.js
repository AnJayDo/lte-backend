require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const cors = require('cors')

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const putOnlyMiddleware = require('./middleware/putOnlyMiddleware');

const questionController = require('./controllers/questionController');
const { gainpoint_put } = require('./controllers/gainpointController');

const app = express();

const whitelist = [/localhost/g, /vercel.app/g , /learntoearn.work/g]
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors());

// middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = process.env.MONGO_URL;
const port = process.env.PORT || 9000;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => {
    console.log("DB connected.");
    console.log("App running on port:", port);
    app.listen(port);
  })
  .catch((err) => console.log(err));

// routes
app.get('/', (req,res) => res.status(200).json({status: 200, message: "Learn To Earn API Server"}))
// app.get('/', (req, res) => res.render('home'));
// app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use('/user', userRoutes)
app.get('/question', questionController)
app.use('/gainpoint', putOnlyMiddleware, checkUser, gainpoint_put)
app.use(authRoutes);