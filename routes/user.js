const express = require('express');
const passport = require('passport');
const bycrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../schema/user');

const router = express.Router();


router.post('/join', isNotLoggedIn, async (req, res, next) => {
    try {
        const { id, password } = req.body;
        const existUser = await User.findOne({ id });
        if (existUser) {
            res.status(201).json('ID Already exists');
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
    passport.authenticate('local', (error, user, info) => {
        if (error) {
            console.error(error);
            return next(error);
        };
        if (!user) {
            return res.json({ "message": `${info.message}` });
        };

        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            };

            return res.redirect('/');
        });
    })(req, res, next);
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;