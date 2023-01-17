import mongoose, {
    Schema
} from "mongoose";

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

export default mongoose.model('Rooms', RoomsSchema);