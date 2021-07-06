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
                done(null, false, { message: "닉네임 또는 패스워드를 확인 해주세요." });
            }
        } else {
            done(null, false, { message: "닉네임 또는 패스워드를 확인 해주세요." })
        }
    } catch (error) {
        console.error(error);
    }
};

const JWTConfig = { jwtFromRequest: ExtractJwt.fromHeader('authorization'), secretOrKey: process.env.JWT_SECRET };

const JWTVerify = async (jwtPayload, done) => {
    try {
        const nickname = jwtPayload.nickname;
        const user = await User.findOne({
            where: {
                nickname
            }
        });
        if (user) {
            done(null, user);
        } else {
            done(null, false, { message: "올바르지 않은 인증정보 입니다." });
        }
    } catch (error) {
        console.error("authentication Error!!!", error);
        done(error);
    }
}

module.exports = () => {
    passport.use('local', new LocalStrategy(passportConfig, passportVerify));
    passport.use('jwt', new JWTStrategy(JWTConfig, JWTVerify));
}