const {
    Schema
} = require("mongoose");
const mongoose = require("mongoose");

const RoomsSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    master: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    videoLinks: [{
        type: String,
        required: true
    }],
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    }],
    isPrivate: {
        type: Boolean,
        default: false,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Rooms', RoomsSchema);