const express = require("express");
const app = express();
exports.isLoggedIn = (req, res, next) => {
    if (req.headers.cookie.user) {
        next();
    } else {
        const error = new Error("로그인이 필요합니다");
        error.status = 403;
        next(error);
    };
}

exports.isNotLoggedIn = (req, res, next) => {
    console.log("!!!!", req.headers.cookie);
    if (!req.headers.cookie.user) {
        next();
    } else {
        const message = encodeURIComponent('로그인한 상태입니다.');
        res.redirect(`/?error=${message}`);
    }
}