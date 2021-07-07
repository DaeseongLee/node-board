const Joi = require('joi');


exports.validate = (req, res, next) => {
    const schema = Joi.object({
        nickname: Joi.string()
            .alphanum()
            .min(3)
            .regex(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/)
            .required()
            .messages({
                'string.base': `닉네임은 문자열이어야 합니다.`,
                'string.empty': `닉네임을 입력하세요.`,
                'string.min': `닉네임은 3자 이상이어야 합니다.`,
                'string.pattern.base': `닉네임은 알파벳 대소문자와, 숫자로 구성되어야 합니다.`
            }),
        password: Joi.string()
            .min(4)
            .custom((value, helper) => {
                if (value.includes(req.body.nickname)) {
                    return helper.message("닉네임과 같은 값이 비밀번호에 포함되면 안됩니다.");
                }
            }),
    });

    const result = schema.validate(req.body);

    if (result.error) {
        res.json({ "ok": false, "message": result.error.message })
    } else {
        next();
    }
};