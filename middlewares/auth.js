const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const { authorization } = req.headers;

    const [authType, authToken] = (authorization || "").split(" ");
    if (authToken === "null" || authType !== "Bearer") {
        // const error = new Error("인증이 안된 사용자입니다.")
        // error.status = 403;
        // next(error);
        next();
    } else {
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
        res.locals.user = decoded;
        app.set("user", decoded);
        next();
    }
}