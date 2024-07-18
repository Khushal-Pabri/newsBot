const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    link: { type: String, required: true },
});

const newsSchema = new mongoose.Schema({
    category: { type: String, required: true },
    articles: [articleSchema]
});

module.exports = mongoose.model('articles', newsSchema);
