const mongoose = require('mongoose')

const SENDER_ROLES = ['sender', 'receiver'];

const MessageSessionSchema = new mongoose.Schema({
    connectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatSession',
        required: true
    },
    sender: {
        type: String,
        enum: SENDER_ROLES,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        default: ''
    },
    mediaUrl: {
        type: String,
        default: '',
        validate: {
            validator: function (v) {
                return v === '' || /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(v);
            },
            message: 'Invalid URL format'
        }
    },
    seenAt: {
        type: Date,
        default: null
    },
}, { timestamps: true })
module.exports = mongoose.model('ChatMessageSession', MessageSessionSchema)
