const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const passport = require('passport');
const path = require('path');
const nunjucks = require('nunjucks');


const { sequelize } = require('./models');

// const connect = require('./schema');
const pageRouter = require('./routes/page');
const userRouter = require('./routes/user');
const boardRouter = require('./routes/board');
const passportConfig = require('./passport');




dotenv.config();
// connect();

const app = express();


app.set('port', process.env.PORT || 3000);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});

sequelize.sync({ force: false })
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch((error) => {
        console.error(error);
    });

//middleware
app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());
app.use(express.urlencoded({ extend: false }));

app.use(cookieParser(process.env.COOKIE_SECRET));
// const sessionOption = {
//     resave: false,
//     saveUninitialized: false,
//     secret: process.env.COOKIE_SECRET,
//     cookie: {
//         httpOnly: true,
//         secure: false,
//     },
//     name: 'session-cookie',
// };
//https 적용할때만
// if (process.env.NODE_ENV === 'production') {
//     sessionOption.proxy = true;
//     sessionOption.cookie.secure = true;
// }
// app.use(session(sessionOption));
app.use(passport.initialize());
passportConfig();


//router
app.use('/', pageRouter);
app.use('/user', userRouter);
app.use('/board', boardRouter);

//error router
app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다!!`);
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {

    res.locals.message = error.message;
    if (error.message.includes("로그인")) {
        res.locals.login = true;
    } else {
        res.locals.login = false;
    }
    res.locals.error = error;
    res.status(error.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트 대기중....');
});