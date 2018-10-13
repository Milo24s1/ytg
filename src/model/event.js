const moment = require('moment');
const EventController = {};
const Event = require('../../model/event');
const EventVideo = require('../../model/eventVideo');

EventController.getEventList  = function (req,res) {
    const sortParams = {createDate:-1};
    Event.getEventList({},sortParams,function (err,result) {
        if(err){
            console.log(err);
            res.render('admin',{'itms':[]});
        }
        else {
            res.render('admin',{'itms':result});
        }
    });

};


EventController.addEventToDatabase = function (req,res) {
    try {
        const newEvent = Event({'eventName':req.body.eventName,
                                'year':req.body.year,
                                'createDate':moment()});
        Event.addEvent(newEvent,function (err,event) {

            if(err){
                console.log(err);
                res.status(400).send({});
            }
            else {
                res.status(200).send({});
            }
        });
    }
    catch (e) {
        console.log(e);
        res.status(400).send({});
    }
};

EventController.deleteEventFromDatabase = function(req,res){
    Event.deleteEvent(req.params.id,function (err,data) {
        res.redirect('/admin');

        EventVideo.deleteEventVideoList({eventId:req.params.id},function (err,data) {
            if(err){

            }
            else {
                console.log('Videos deleted successfully');
            }
        })
    });
};



EventController.getAllEventAndVideos = function(req,res){
    const sortParams = {createDate:-1};
    try{
        Event.getEventList({},sortParams,function (err,data) {
            if(err){
                res.render('index',{'allEvents':[]});
            }
            else{
                EventVideo.getEventVideoList({},{},function (err,videos) {
                    const videoMap = {};
                    if(err){
                        res.render('index',{'allEvents':[]});
                    }
                    else {
                        for(let v of videos){

                            if(videoMap[v.eventId]==undefined){
                                videoMap[v.eventId] = [v];
                            }
                            else {
                                videoMap[v.eventId].push(v);
                            }

                        }
                        res.render('index',{'allEvents':data,'videoMap':videoMap});
                    }
                });

            }
        })
    }
    catch (e) {
        res.render('index',{'allEvents':[]});
    }

};

EventController.getEvent = function(req,res){

    const searchParams = {_id:req.params.id};
    try {
        Event.getEventList(searchParams,{},function (err,data) {

            if(err){
                res.render('error',{'error':''});
            }
            else {
               if(data.length==0){
                   res.render('error',{'error':'The Event you are looking for is not found'});
               }
               else {

                   const currentEvent = data[0];

                   EventVideo.getEventVideoList({eventId:req.params.id},{},function (err,videos) {

                       if(err){
                           res.render('error',{'error':''});
                       }
                       else {
                           res.render('event',{event:currentEvent,videos:videos});
                       }
                   });
               }


            }
        });
    }
    catch (e) {
        res.render('error',{'error':''});
    }
};

module.exports = EventController;