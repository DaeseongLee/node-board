const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { ExtractJwt, Strategy: JWTStrategy } = require('passport-jwt');
const User = require('../models/user');
const bcrypt = require('bcrypt');
require('dotenv').config();

const passportConfig = { usernameField: 'nickname', passwordField: 'password' };

const passportVerify = async (nickname, password, done) => {
    try {
        const existUser = await User.findOne({
            where: {
                nickname
            },
        });
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
    }
};

const JWTConfig = { jwtFromRequest: ExtractJwt.fromHeader('authorization'), secretOrKey: process.env.JWT_SECRET };

const JWTVerify = async (jwtPayload, done) => {
    try {
        const user = await User.findOne({
            where: {
                nickname: jwtPayload.nickname
            }
        });
        if (user) {
            done(null, user);
        } else {
            done(null, false, { message: "올바르지 않은 인증정보 입니다." });
        }
    } catch (error) {
        console.error(error);
        done(error);
    }
}

module.exports = () => {
    passport.use('local', new LocalStrategy(passportConfig, passportVerify));
    passport.use('jwt', new JWTStrategy(JWTConfig, JWTVerify));
}