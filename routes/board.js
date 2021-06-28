const express = require('express');
const { v4: uuidv4 } = require('uuid');
const bycrypt = require('bcrypt');
const Board = require('../schema/board');

const router = express.Router();

// router.get('/', async (req, res, next) => {
//     try {
//         const boards = await Board.find({}).sort=;
//         console.log(boards);
//         res.json(boards, { boards });
//     } catch (error) {
//         console.error(error);
//         next(error);
//     }
// });

router.post('/create', async (req, res, next) => {
    try {
        const { title, description, password } = req.body;
        const writer = req.user;

        const hash = await bycrypt.hash(password, 12);
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
module.exports = router;