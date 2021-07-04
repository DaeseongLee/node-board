const express = require('express');
const passport = require('passport');
const bycrypt = require('bcrypt');
const jwt = require("jsonwebtoken");


const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../schema/user');
const auth = require('../middlewares/auth');

const router = express.Router();

const authenticateJWT = (req, res, next) =>
    passport.authenticate("jwt", { sessions: false }, (error, user) => {
        //verifyUser에서 user를 찾았다면 서버에게 요청하는 req객체의 user에 담아서 서버에게 넘겨줌
        if (user) {
            req.user = user;
        }
        next();
    })(req, res, next);



router.get('/me', authenticateJWT, (req, res) => {
    console.log(req.user)
    console.log("여기 안들어놔");
});


router.post('/join', isNotLoggedIn, async (req, res, next) => {
    try {
        const { id, password } = req.body;
        const existUser = await User.findOne({ id });
        if (existUser) {
            res.status(400).json('ID Already exists');
            return;
        }
        const hash = await bycrypt.hash(password, 12);
        await User.create({
            id,
            password: hash
        });
        res.status(201).json('ok');
    } catch (error) {
        console.error(error);
        next(error);
    }
});



router.post('/login', isNotLoggedIn, async (req, res, next) => {
    try {
        passport.authenticate('local', (error, user, info) => {
            if (error) {
                console.error(error);
                return next(error);
            };
            if (!user) {
                return res.json({ "message": `${info.message}` });
            };

            return req.login(user, { session: false }, (loginError) => {
                if (loginError) {
                    console.error(loginError);
                    return next(loginError);
                };
                const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
                res.json({ token });
            });
        })(req, res);
    } catch (error) {
        console.error(error);
        next(error);
    };
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;