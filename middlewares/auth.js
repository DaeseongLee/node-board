
module.exports = (req, res, next) => {
    const { authorization } = req.headers;

    const [authType, authToken] = (authorization || "").split(" ");
    if (!authToken || authType !== "Bearer1") {
        const error = new Error("인증이 안된 사용자입니다.")
        error.status = 403;
        next(error);
    } else {
        next();
    };
}