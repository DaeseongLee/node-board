const mongoose = require('mongoose');

const connect = () => {
    if (process.env.NODE_ENV !== 'production') {
        mongoose.set('debug', true);
    }

    console.log("env!!!!!!!!!!!!!!!!!!", process.env.NODE_ENV)
    if (process.env.NODE_ENV == 'production') {
        mongoose.connect('mongodb://localhost:27017/admin', {
            dbName: 'spartaNode1',
            useNewUrlParser: true,
            useCreateIndex: true,
            user: "test",
            pass: "test"
        }, (error) => {
            if (error) {
                console.log('몽고디비 연결 에러', error);
            } else {
                console.log('몽고디비 연결 성공 production');
            }
        });
    } else {
        console.log("여기는 dev");
        mongoose.connect('mongodb://localhost:27017/admin', {
            dbName: 'spartaNode1',
            useNewUrlParser: true,
            useCreateIndex: true,
        }, (error) => {
            if (error) {
                console.log('몽고디비 연결 에러', error);
            } else {
                console.log('몽고디비 연결 성공');
            }
        });
    }
};

mongoose.connection.on('error', (error) => {
    console.error('몽고디비 연결 에러', error);
});

mongoose.connection.on('disconnected', () => {
    console.error('몽고디비 연결이 끊겼습니다. 연결 재시도');
    connect();
});

module.exports = connect;