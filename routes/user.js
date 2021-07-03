const express = require('express');
const passport = require('passport');
const bycrypt = require('bcrypt');
const jwt = require("jsonwebtoken");


const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../schema/user');
const auth = require('../middlewares/auth');

const router = express.Router();


router.get('/me', auth, (req, res, next) => {
    const { id } = req.params;
    try {
        // const board = await Board.findOne({ id }).populate('writer');
        // app.set("board", board);
        // res.render('boardDetail', { board, moment });
    } catch (error) {
        console.error(error);
        next(error)
    };
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
    const { id, password } = req.body;

    const user = await User.findOne({ id });

    if (!user || !await bycrypt.compare(password, user.password)) {
        res.json({ "ok": false, "message": "아이디 또는 패스워드가 틀렸습니다." });
        return;
    }

    const token = jwt.sign({ user }, process.env.JWT_SECRET);

    // req.login(user, );
    res.json({ "ok": true, token: token });

    //passport로 작성한 것.
    // passport.authenticate('local', (error, user, info) => {
    //     if (error) {
    //         console.error(error);
    //         return next(error);
    //     };
    //     if (!user) {
    //         return res.json({ "message": `${info.message}` });
    //     };

    //     return req.login(user, (loginError) => {
    //         if (loginError) {
    //             console.error(loginError);
    //             return next(loginError);
    //         };

    //         return res.redirect('/');
    //     });
    // })(req, res, next);
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;