const passport = require('passport');
const local = require('./localStrategy');
const User = require('../schema/user');

module.exports = () => {
    //로그인 시 실행.. req.session 객체에 어떤 데이터를 저장할 지 결정.
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    //매 요청 시 실행.. passport.session() 미들웨어가 호출. 
    //매개변수 id는 serializeUser의 done()에서 넣어준 user.id
    //DB와 비교해서 있다면, 조회한 정보를 req.user 객체에 집어넣음.
    passport.deserializeUser((id, done) => {
        User.findOne({ id })
            .then(user => done(null, user))
            .catch(error => done(error));
    });

    local();

    //정리하자면 serializeUser는 req.session에 사용자 정보를 넣는 것
    //deserializeUser는  req.user를 만드는 것.
}