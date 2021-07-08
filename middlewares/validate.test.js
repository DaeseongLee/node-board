const { validate } = require('./validate');

describe('validate', () => {
    let res, next;
    beforeAll(() => {
        res = {
            json: jest.fn(),
        };
        next = jest.fn();
    })
    it('닉네임은 최소 3자 이상 이어야 합니다.', () => {
        const req = {
            body: { nickname: "ki", password: "1234" },
        };
        validate(req, res, next);
        expect(res.json).toBeCalledWith({ "message": "닉네임은 3자 이상이어야 합니다.", "ok": false });
    });

    it('닉네임은 알파벳 대소문자(a~z, A~Z), 숫자로 이루어져 있어야 합니다..', () => {
        const req = {
            body: { nickname: "king1", password: "1234" },
        };
        validate(req, res, next);
        expect(res.json).toBeCalledWith({ "message": "닉네임은 알파벳 대소문자와, 숫자로 구성되어야 합니다.", "ok": false });
    });

    it('비밀번호는 최소 4자 이상이어야 합니다.', () => {
        const req = {
            body: { nickname: "kingStar1", password: "123" },
        };
        validate(req, res, next);
        expect(res.json).toBeCalledWith({ "message": "비밀번호는 4자 이상이어야 합니다.", "ok": false });
    });

    it('비밀번호는 닉네임과 같은 값이 포함되면 안됩니다.', () => {
        const req = {
            body: { nickname: "kingStar1", password: "kingStar12" },
        };
        validate(req, res, next);
        expect(res.json).toBeCalledWith({ "message": "닉네임과 같은 값이 비밀번호에 포함되면 안됩니다.", "ok": false });
    });

    it('valide가 통과 시 next()를 한번만 호출합니다', () => {
        const req = {
            body: { nickname: "kingStar1", password: "1234" },
        };
        validate(req, res, next);
        expect(next).toBeCalledTimes(1);
    });
});