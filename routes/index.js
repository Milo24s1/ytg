const express = require('express');
const router = express.Router();
const EventController = require('../src/model/event');
const EventVideoController = require('../src/model/eventVideo');


/*
GET home page
 */

router.get('/',(req,res,next)=>{
    EventController.getAllEventAndVideos(req,res);

});


router.get('/admin',(req,res,next)=>{
    EventController.getEventList(req,res);
});

router.post('/addEvent',(req,res,next)=>{
    EventController.addEventToDatabase(req,res);
});

router.get('/deleteEvent/:id',function (req,res) {
    EventController.deleteEventFromDatabase(req,res);
});

router.get('/event/:id',function (req,res) {
    EventController.getEvent(req,res);
});
router.get('/channel/:id',function (req,res) {
    EventVideoController.getChannel(req,res);
});


router.post('/addEventVideo',(req,res,next)=>{
    EventVideoController.addEventVideoToDatabase(req,res);
});
router.post('/deleteEventVideo',(req,res,next)=>{
    EventVideoController.deleteEventVideo(req,res);
});

router.post('/getEventVideo',(req,res,next)=>{
    EventVideoController.getEventVideoList(req,res);
});
router.post('/getChannelVideo',(req,res,next)=>{
    EventVideoController.getChannelVideoList(req,res);
});

module.exports = router;