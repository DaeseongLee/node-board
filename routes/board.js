const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('board');
});

router.get('/create', (req, res) => {
    res.render('createBoard');
})

router.get('/update/:id', (req, res) => {
    res.render('boardUpdate');
})

router.get('/delete/:id', (req, res) => {
    res.render('boardDelete');
})

router.get('/:id', (req, res) => {
    res.render('boardDetail');
})
module.exports = router;