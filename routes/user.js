const express = require('express');
const User = require('../schema/user');

const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login');
});

router.route('/join')
    .get((req, res) => {
        res.render('join');
    })
    .post(async (req, res, next) => {
        try {
            const { id, password } = req.body;
            const existUser = await User.findOne({ id });
            if (existUser) {
                res.status(201).json('ID Already exists');
                return;
            }
            await User.create({
                id,
                password
            });
            res.status(201).json('ok');
        } catch (error) {
            console.error(error);
            next(error);
        }

    });

module.exports = router;