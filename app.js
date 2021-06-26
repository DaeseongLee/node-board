const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const nunjucks = require('nunjucks');

const userRouter = require('./routes/user');
const boardRouter = require('./routes/board');

dotenv.config();
const app = express();
app.set('port', process.env.PORT || 3000);

app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});



app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extend: false }));

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    name: 'session-cookie',
}));

app.use((req, res, next) => {
    console.log(req.session);
    console.log(req.signedCookies);
    next();
})


app.use('/user', userRouter);
app.use('/board', boardRouter);


app.get('/', (req, res) => {
    res.render('index', { title: 'Express' });
});

app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).send(err.message);
})


app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트 대기중....');
});