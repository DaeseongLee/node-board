const bycrypt = require('bcrypt');
const User = require('../models/user');

exports.join = async (req, res, next) => {
    try {
        const { nickname, password } = req.body;
        const existUser = await User.findOne({
            where: {
                nickname
            }
        });
        if (existUser) {
            res.json({ "ok": false, "message": 'nickname already exists' });
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
}