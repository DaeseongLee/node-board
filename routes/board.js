const express = require('express');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const Board = require('../schema/board');
const moment = require('moment');

const router = express.Router();

router.post('/create', async (req, res, next) => {
    try {
        const { title, description, password } = req.body;
        const writer = req.user;

        const hash = await bcrypt.hash(password, 12);
        const board = await Board.create({
            id: uuidv4(),
            title,
            description,
            password: hash,
            writer,
            createdAt: Date.now(),
        });
        await Board.populate(board, { path: 'writer' });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.patch('/:id/update', async (req, res, next) => {
    const { id } = req.params;
    const { title, description, password: inputPassword } = req.body;

    try {
        const { password } = await Board.findOne({ id });
        const pwdChk = await bcrypt.compare(inputPassword, password);
        if (pwdChk) {
            await Board.updateOne({
                id
            }, {
                title,
                description
            })

            res.json({ ok: true, url: `/${id}` });
        } else {
            res.json({ ok: false, message: "비밀번호가 일치 하지 않습니다." });
        }

    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.delete('/:id/delete', async (req, res, next) => {
    const { id } = req.params;
    const { password: inputPassword } = req.body;
    try {
        const { password } = await Board.findOne({ id });
        console.log(inputPassword, password);
        const pwdChk = await bcrypt.compare(inputPassword, password);
        if (pwdChk) {
            await Board.remove({ id });
            res.json({ ok: true, url: `/` });
        } else {
            res.json({ ok: false, message: "비밀번호가 일치 하지 않습니다." });
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});
module.exports = router;