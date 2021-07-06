const express = require('express');
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

const app = express();

const { isLoggedIn, isNotLoggedIn } = require('../middlewares/isLoggedInOrisNotLoggedIn');
const Board = require('../models/board');
const User = require('../models/user');
const Comment = require('../models/comment');
const router = express.Router();

router.use((req, res, next) => {

    res.locals.user = req.cookies.user;
    next();
});

router.get('/', async (req, res) => {
    try {
        const boards = await Board.findAll({
            include: [{
                model: User,
                attribute: ['nickname'],
            }],
            order: [['createdAt', 'DESC']]
        });
        res.render('board', { boards, moment });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/login', isNotLoggedIn, (req, res) => {
    res.render('login');
});

router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join');
});


router.get('/create', isLoggedIn, (req, res) => {
    res.render('createBoard');
});

router.get('/loginError', (req, res) => {
    res.locals.error = { "status": 403 }
    res.locals.message = "로그인이 필요합니다";
    res.locals.login = true;
    res.render("error")
});


//게시글 수정
router.get('/update', isLoggedIn, (req, res, next) => {

    const board = app.get("board");
    const { id: userId } = res.locals.user;
    if (userId !== board.User.id) {
        const error = new Error("접근권한이 없습니다.");
        error.status = 403;
        next(error);
    } else {
        res.render('boardUpdate', { board });
    }
});

//게시글 디테일
router.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const board = await Board.findByPk(id, {
            include: [{
                model: User,
                attribute: ['nickname'],
            }],
        });
        const comments = await board.getComments({
            include: [{
                model: User,
                attribute: ['nickname'],
            }]
        });
        app.set("board", board);
        res.render('boardDetail', { board, comments, moment });
    } catch (error) {
        console.error(error);
        next(error)
    };
});



module.exports = router;
