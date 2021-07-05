const Sequelize = require('sequelize');

module.exports = class Board extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            title: {
                type: Sequelize.STRING,
                defaultValue: "제목없음"
            },
            description: {
                type: Sequelize.TEXT,
                defaultValue: "내용없음"
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            },
            url: {
                type: Sequelize.STRING(100),
                defaultValue: "/img/default.jpg"
            },
        }, {
            sequelize,
            timestamps: true,
            modelName: 'Board',
            tableName: 'boards',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        })
    }

    static associate(db) {
        db.Board.belongsTo(db.User, { foreignKey: 'writer', targetKey: 'id' });
        db.Board.hasMany(db.Comment, { foreignKey: 'board', sourceKey: 'id' });
    }
}