var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true}));
router.use(bodyParser.json());
var User = require('../model/User');
var bcrypt = require('bcrypt');
var saltRounds = 10;
var uuid = require('uuid')

router.post('/', (req, resp) => {
    User.findOne({email: req.body.email}, (err, user) => {
        if (user) return resp.status(400).send({
            message: 'Email aldready exists!'
        })
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(req.body.password, salt, function(err, hash) {
                if (err) resp.status(400).send({
                    message: 'Internal Server Error'
                })
                User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: hash,
                    role: 'USER'
                }, (err, user) => {
                    if (err) return resp.status(500).send("There was a problem adding the information to the database.");
                    resp.status(200).send(user);
                });
            })
        })
    })


});

router.get('/', (req, resp) => {
    console.log("validating role")
    if (req.query.role) {
        if (!req.session || req.session.sessionRole != req.query.role ) {
            return resp.status(401).send({
                message: 'Unauthorized'
            })
        }
        return resp.status(200).send({
            message: 'Authorized'
        })
    }
})

router.get('/logout', (req, resp) => {
    if (req.session.sessionId) {
        req.session.destroy()
        //req.session.logout()
        return resp.status(200).send({
            message: 'Session destroyed'
        })
    }
    return resp.status(400).send({
        message: 'Session does not exist'
    })
})

router.post('/login', (req, resp) => {
    var email = req.body.email
    var password = req.body.password
    User.findOne({email: email}, function (err, users) {
        if (err) return resp.status(500).send("There was a problem find a user.");
        if (!users) return resp.status(400).send({message: "No user found"})
        bcrypt.compare(password, users.password, function(err, result) {
            if (result == false) {
                return resp.status(400).send({message: "Wrong email or password"});
            } else {
                let uniqueSessionId = uuid.v4()
                let path = users.role == 'USER' ? 'user' : 'admin'
                req.session.sessionRole = users.role
                req.session.sessionUserName = users.name
                req.session.sessionUserEmail = users.email
                req.session.sessionId = uniqueSessionId
                req.session.searches= {
                    language: [],
                    topic: []
                }
                return resp.status(200).send({
                    message: 'Successfully logged in',
                    path: path,
                    sessionId: uniqueSessionId
                });
            }
        })

        //resp.end()
    });


});


function hashPassword(password) {
    var hash = bcrypt.hash(password, saltRounds, (err, hash) => {
        return hash;
    })
    return hash
}


module.exports = router;
