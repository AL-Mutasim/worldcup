const mongoose = require('mongoose');

const newsSchema = mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
});

const News = mongoose.model('news', newsSchema);


addNews = function(news, callback){
    // News.find().where('title').gte(news.title)
    News.create(news, callback);
}

removeAll = function(callbakc){
    News.remove({}, callback)
}


getNews = function(callback){
    News.find(callback);
}

module.exports = {
    addNews:addNews,
    removeAll:removeAll,
    getNews:getNews
}