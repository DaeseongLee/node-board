const express = require('express');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Board = require('../schema/board');

const router = express.Router();

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
    console.log(req.file);
    res.json({ url: `/img/${req.file.filename}` });
});


const upload2 = multer();
router.post('/create', upload2.none(), async (req, res, next) => {
    try {
        const { title, description, password, url } = req.body;
        const writer = req.user;

        const hash = await bcrypt.hash(password, 12);
        const board = await Board.create({
            id: uuidv4(),
            title,
            description,
            password: hash,
            writer,
            url,
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
    const { title, description, password: inputPassword, url } = req.body;

    try {
        const { password } = await Board.findOne({ id });
        const pwdChk = await bcrypt.compare(inputPassword, password);
        if (pwdChk) {
            await Board.updateOne({
                id
            }, {
                title,
                description,
                url
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