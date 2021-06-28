const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../schema/user');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'id',
        passwordField: 'password',
    }, async (id, password, done) => {
        try {
            const existUser = await User.findOne({ id });
            if (existUser) {
                const result = await bcrypt.compare(password, existUser.password);
                if (result) {
                    done(null, existUser);
                } else {
                    done(null, false, { message: "비밀번호가 일치하지 않습니다." });
                }
            } else {
                done(null, false, { message: "가입되지 않은 회원입니다." })
            }
        } catch (error) {
            console.error(error);
            done(error);
        };
    }));
};