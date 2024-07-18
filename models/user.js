const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
    discordId: { type: String, unique: true },
    username: String,
    preferences: [String],
    newsInterval: String,
    channelId: String,
    scheduledJob: {type:Schema.Types.Mixed}
});

module.exports = mongoose.model('users', userSchema);