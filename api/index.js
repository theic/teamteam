var express = require('express');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    // var db = req.db;
    // const users = db.get('users');
    // users.remove({}); // Для дебаггинга

    // users.insert({email: 'teamteam@gmail.com', password: '123456'});
    // users.find({}).then(docs => {
    //     console.log('=========== ', docs);
    // });

    res.sendFile(path.join(__dirname, '../public/src/teamteam-app/index.html'));
});

// Authentication and Authorization Middleware
var auth = function (req, res, next) {
    if (req.session && req.session.id === req.headers.sid)
        return next();
    else
        return res.sendStatus(401);
};

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.send("logout success!");
});

router.post('/login', (req, res) => {

    if (!req.body.email || !req.body.password) {

        res.send({
            message: 'No user data provided.',
            userid: null,
            sid: null
        });
    } else {
        let db = req.db;
        let users = db.get('users');
        users.findOne({email: req.body.email, password: req.body.password}, {}, (e, u) => {

            if (u !== null) {
                // req.session.email = req.body.email;

                res.send({
                    message: 'User successfully loggedIn.',
                    userid: u._id,
                    sid: req.sessionid
                });
            } else {
                users.insert({email: req.body.email, password: req.body.password}, {}, (e, u) => {
                    // req.session.email = req.body.email;

                    res.send({
                        message: 'New user created',
                        userid: u._id,
                        sid: req.sessionid
                    });
                });
            }
        });
    }
});

router.post('/content', auth, function (req, res) {
    res.send({msg: 'Nice to see you!'});
});

module.exports = router;
