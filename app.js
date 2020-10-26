var express = require('express')
var app = express();
var mongoose = require('mongoose')
var db = require('./db');
var uuid = require('uuid')
var passport = require('passport')
var bodyParse = require('body-parser')
var UserController = require('./controller/UserController')
var GithubController = require('./controller/GithubController')
var SearchHistoryController = require('./controller/SearchHistoryController')
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)
var cors = require('cors')
app.use(cors({
    origin: 'http://localhost:8080',//frontend server localhost:8080
    methods:['GET','POST','PUT','DELETE'],
    credentials: true
}));
//app.use(cors({origin: 'http://localhost:8080'}))

app.use(session({
    secret: "haneef",
    cookie: {
        httpOnly: false,
        secure: false, // since we're using http, this is set to false
        maxAge: 60000 * 60
    },
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(bodyParse.json());
app.use(bodyParse.urlencoded({ extended: true }));

app.use('/users', UserController);
app.use('/github', GithubController);
app.use('/search-history', SearchHistoryController)
app.get('/', (req, resp) => {
    if (!req.session.sessionId) {
        return resp.status(400).send({
            message: 'Session does not exist or expired'
        })
    } else {
        return resp.status(200).send({
            message: 'Session retrieved',
            path: req.session.sessionRole == 'USER' ? 'user' : 'admin'
        })
    }
});
module.exports = app;
