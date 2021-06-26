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


app.use('/user', userRouter);
app.use('/board', boardRouter);


app.get('/', (req, res) => {
    res.render('index', { title: 'Express' });
});

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다!!`);
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.locals.message = error.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? error : {};
    res.status(error.status || 500);
    res.render('error');
})


app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트 대기중....');
});