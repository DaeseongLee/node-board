const express = require('express');
const moment = require('moment');

const app = express();

const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const Board = require('../schema/board');

const router = express.Router();



router.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.boards = req.board;
    next();
});

router.get('/', async (req, res) => {
    if (req.user) {
        try {
            const boards = await Board.find({}).populate('writer').sort({ createdAt: -1 });
            res.render('board', { boards, moment });
        } catch (error) {
            console.error(error);
            next(error);
        }
    } else {
        res.render('login');
    }
});

router.get('/login', isNotLoggedIn, (req, res) => {
    res.render('login');
});

router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join');
});


router.get('/board/create', isLoggedIn, (req, res) => {
    res.render('createBoard');
});



//게시글 수정
router.get('/board/update', isLoggedIn, (req, res) => {
    const board = app.get("board");
    res.render('boardUpdate', { board });
});

//게시글 디테일
router.get('/board/:id', isLoggedIn, async (req, res, next) => {
    const { id } = req.params;
    try {
        const board = await Board.findOne({ id }).populate('writer');
        app.set("board", board);
        res.render('boardDetail', { board, moment });
    } catch (error) {
        console.error(error);
        next(error)
    }

})



module.exports = router;