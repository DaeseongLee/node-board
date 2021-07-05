const express = require('express');
const passport = require('passport');
const bycrypt = require('bcrypt');
const jwt = require("jsonwebtoken");


const { isLoggedIn, isNotLoggedIn } = require('../middlewares/isLoggedInOrisNotLoggedIn');

const User = require('../models/user');



const router = express.Router();

const authenticateJWT = (req, res, next) =>
    passport.authenticate("jwt", { sessions: false }, (error, user) => {
        if (user) {
            req.user = user;
        }
        next();
    })(req, res, next);


router.get('/me', authenticateJWT, (req, res) => {
    res.cookie("user", { "nickname": req.user.nickname, "id": req.user.id });
    res.json({ "user": req.user });
});


router.post('/join', isNotLoggedIn, async (req, res, next) => {
    try {
        const { nickname, password } = req.body;
        const existUser = await User.findOne({
            where: {
                nickname
            }
        })
        console.log("existUser", existUser);
        if (existUser) {
            res.json('nickname already exists');
            return;
        }
        const hash = await bycrypt.hash(password, 12);
        await User.create({
            nickname,
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
                const token = jwt.sign({ nickname: user.nickname }, process.env.JWT_SECRET);
                res.json({ token });
            });
        })(req, res);
    } catch (error) {
        console.error(error);
        next(error);
    };
});

router.get('/logout', (req, res) => {
    res.clearCookie('user').redirect('/login');
});

module.exports = router;