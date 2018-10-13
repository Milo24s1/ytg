const mongoose = require('mongoose');

const EventVideoSchema = mongoose.Schema({
    eventId : {
        type: String
    },
    url : {
        type: String
    },
    videoId: {
        type: String
    },
    owner: {
        type : String
    },
    channelId: {
        type : String
    },
    title : {
        type: String
    },
    description : {
        type: String
    },
    views : {
        type: Number
    },
    comments : {
        type: Number
    },
    likes : {
        type: Number
    },
    dislikes : {
        type: Number
    },
    releaseDate : {
        type: Date
    },
    addedDate : {
        type: Date
    }

});

EventVideoSchema.index({ eventId: 1, url: 1}, { unique: true });

const EventVideo = module.exports = mongoose.model('EventVideo',EventVideoSchema);

module.exports.addEventVideo = function (eventVideo,callback) {
    eventVideo.save(callback);
};


module.exports.getEventVideoList = function (searchParams,sortParams,callback) {
    EventVideo.find(searchParams,null,{sort:sortParams},callback);
};
module.exports.getChannelVideos = function (searchParams,sortParams,callback) {
    EventVideo.find(searchParams,null,{sort:sortParams},callback);

};

module.exports.deleteEventVideoList = function (searchParams,callback) {
    EventVideo.findOneAndRemove(searchParams,callback);
};