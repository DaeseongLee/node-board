const mongoose = require('mongoose');

const { Schema } = mongoose;

const { Types: { ObjectId } } = Schema;
const boardSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    writer: {
        type: ObjectId,
        required: true,
        ref: 'User',
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: false,
        default: "/img/default.jpg"
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Board', boardSchema);