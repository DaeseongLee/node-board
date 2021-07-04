const express = require('express');
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

const app = express();

const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const Board = require('../schema/board');

const router = express.Router();



router.get('/', async (req, res) => {
    try {
        const boards = await Board.find({}).populate('writer').sort({ createdAt: -1 });
        res.render('board', { boards, moment });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/login', isNotLoggedIn, (req, res) => {
    res.render('login');
});

router.get('/join', (req, res) => {
    res.render('join');
});


router.get('/create', isNotLoggedIn, (req, res) => {
    res.render('createBoard');
});



//게시글 수정
router.get('/update', isLoggedIn, (req, res, next) => {

    const board = app.get("board");
    if (req.user.id !== board.writer.id) {
        const error = new Error("접근권한이 없습니다.");
        error.status = 403;
        next(error);
    } else {
        res.render('boardUpdate', { board });
    }
});

//게시글 디테일
router.get('/:id', isLoggedIn, async (req, res, next) => {
    const { id } = req.params;
    try {
        const board = await Board.findOne({ id }).populate('writer');
        app.set("board", board);
        res.render('boardDetail', { board, moment });
    } catch (error) {
        console.error(error);
        next(error)
    };
});



module.exports = router;