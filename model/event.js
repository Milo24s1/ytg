const mongoose = require('mongoose');

const EventSchema = mongoose.Schema({
    eventName : {
        type: String
    },
    year : {
        type: Number
    },
    createDate : {
        type: Date
    }
});


const Event = module.exports = mongoose.model('Event',EventSchema);


module.exports.addEvent = function (event,callback) {
    event.save(callback);
};

module.exports.deleteEvent = function (id,callback) {
    Event.findByIdAndRemove(id,callback);
};

module.exports.updateEvent = function (id,update,callback) {
    Event.findByIdAndUpdate(id, update, callback)
};

module.exports.getEventList = function(searchParams,sortParams,callback){
    Event.find(searchParams,null,{sort:sortParams},callback);
};