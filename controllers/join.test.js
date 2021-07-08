const { join } = require('./join');
const User = require('../models/user');
jest.mock('../models/user');

describe('joinTest', () => {
    const req = {
        body: { nickname: 'Asce1', password: '1234' }
    };
    const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
    };
    const next = jest.fn();


    it('중복된 사용자를 저장하면 실패하여야 합니다.', async () => {
        User.findOne.mockReturnValue(Promise.resolve(true));
        await join(req, res, next);
        expect(res.json).toBeCalledWith({ "ok": false, "message": 'nickname already exists' });
    });

    it('사용자를 생성하면 ok를 응답해야 합니다.', async () => {
        User.findOne.mockReturnValue(Promise.resolve(false));
        await join(req, res, next);
        expect(res.status).toBeCalledWith(201);
        expect(res.json).toBeCalledWith('ok');
    });

    it('DB에서 에러가 발생하면 next(error)를 호출해야 합니다', async () => {
        const error = '테스트용 에러';
        User.findOne.mockReturnValue(Promise.reject(error));
        await join(req, res, next);
        expect(next).toBeCalledWith(error);
    });
});