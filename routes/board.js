const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Board = require('../models/board');
const User = require('../models/user');
const Comment = require('../models/comment');

const router = express.Router();


// router.use((req, res, next) => {
//     passport.authenticate('jwt', { session: false });
//     next();
// });

try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
};

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/create/img', upload.single('img'), async (req, res, next) => {
    res.json({ url: `/img/${req.file.filename}` });
});


const upload2 = multer();
router.post('/create', upload2.none(), async (req, res, next) => {
    try {
        let { title, description, password, url } = req.body;
        const userId = req.cookies.user.id;
        url = url || "/img/default.jpg";
        const hash = await bcrypt.hash(password, 12);
        await Board.create({
            title,
            description,
            password: hash,
            writer: userId,
            url,
        });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.patch('/:id/update', async (req, res, next) => {
    const { id } = req.params;
    const { title, description, password: inputPassword, url } = req.body;
    try {
        const { password } = await Board.findByPk(id);
        const pwdChk = await bcrypt.compare(inputPassword, password);
        if (pwdChk) {
            await Board.update({
                title,
                description,
                url
            }, {
                where: { id }
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
        const { password } = await Board.findByPk(id);
        const pwdChk = await bcrypt.compare(inputPassword, password);
        if (pwdChk) {
            await Board.destroy({ where: { id } });
            res.json({ ok: true, url: `/` });
        } else {
            res.json({ ok: false, message: "비밀번호가 일치 하지 않습니다." });
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});


router.post('/:id/comment', async (req, res, next) => {
    const { boardId, comment } = req.body;
    const userId = req.cookies.user?.id;
    if (userId) {
        try {
            const result = await Comment.create({
                comment,
                board: boardId,
                commenter: userId,
            });
            const nickname = req.cookies.user.nickname;
            console.log("AddComment!!!", result);
            res.json({ "ok": true, "comment": result, nickname });
        } catch (error) {
            console.error(error);
            next(error);
        };
    }
});

router.patch('/:id/comment', async (req, res, next) => {
    const { comment, commentId } = req.body;
    try {
        const result = await Comment.update({
            comment,
        }, {
            where: { id: commentId }
        });
        res.json({ "ok": true, "comment": result });
    } catch (error) {
        console.error(error);
        next(error);
    };
});

router.delete('/comment', async (req, res, next) => {
    const { commentId } = req.body;
    try {
        const result = await Comment.destroy({
            where: { id: commentId }
        });
        res.json({ "ok": true, result });
    } catch (error) {
        console.error(error);
        next(error);
    };

});

module.exports = router;