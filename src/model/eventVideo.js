const moment = require('moment');
var fetchVideoInfo = require('youtube-info');
const EventVideoController = {};
const EventVideo  = require('../../model/eventVideo');

EventVideoController.addEventVideoToDatabase =  async function(req,res){

    res.status(200).send({});
    try {
        console.log('Response sent');
        const tempVideo = await fetchYoutubeVideoInfo(req.body.url);
        tempVideo.eventId = req.body.eventId;
        tempVideo.url = req.body.url;
        console.log(tempVideo);
        const newEventVideo = EventVideo(tempVideo);
        EventVideo.addEventVideo(newEventVideo,function (err,event) {

            if(err){
                console.log(err);
                // res.status(400).send({});
            }
            else {
                // res.status(200).send({});
            }
        });
    }
    catch (e) {
        console.log(e);
        res.status(400).send({});
    }
};

EventVideoController.getEventVideoList = function(req,res){

    const searchParams = {'eventId':req.body.eventId};
    const sortParams = {};

    if(req.body.sort != undefined){
        switch (req.body.sort) {
            case '1':
                // this should be relase date
                sortParams.addedDate = 1;
                break;
            case '2':
                // this should be relase date
                sortParams.addedDate = -1;
                break;
            case '3':
                sortParams.likes = -1;
                break;
            case '4':
                sortParams.likes = 1;
                break;
            case '5':
                sortParams.dislikes = -1;
                break;
            case '6':
                sortParams.dislikes = 1;
                break;
            case '7':
                sortParams.views = -1;
                break;
            case '8':
                sortParams.likes = 1;
                break;
            default :

                break;
        }
    }

    try{
        EventVideo.getEventVideoList(searchParams,sortParams,function (err,data) {
            if(err){
                res.status(500).send({'err':err});
            }
            else{
                res.status(200).send(data);
            }
        });
    }
    catch (e) {

    }

};
EventVideoController.getChannelVideoList = function(req,res){

    const searchParams = {'channelId':req.body.channelId};
    const sortParams = {};

    if(req.body.sort != undefined){
        switch (req.body.sort) {
            case '1':
                // this should be relase date
                sortParams.addedDate = 1;
                break;
            case '2':
                // this should be relase date
                sortParams.addedDate = -1;
                break;
            case '3':
                sortParams.likes = -1;
                break;
            case '4':
                sortParams.likes = 1;
                break;
            case '5':
                sortParams.dislikes = -1;
                break;
            case '6':
                sortParams.dislikes = 1;
                break;
            case '7':
                sortParams.views = -1;
                break;
            case '8':
                sortParams.likes = 1;
                break;
            default :

                break;
        }
    }

    try{
        EventVideo.getChannelVideos(searchParams,sortParams,function (err,results) {
            if(err){
                res.status(500).send({'err':err});
            }
            else{

                const uniqueLinks = [];
                let videos = [];
                videos = results.filter(function (result) {
                    if(uniqueLinks.indexOf(result.videoId)==-1){
                        uniqueLinks.push(result.videoId);
                        return result;
                    }
                });
                res.status(200).send(videos);
            }
        });
    }
    catch (e) {

    }

};


function fetchYoutubeVideoInfo(url) {
    const tempVideo = {};

    return new Promise(function (resolve,reject) {

        try {
            fetchVideoInfo(url.substr(url.length-11)).then(function (videoInfo) {

                tempVideo.videoId = videoInfo.videoId;
                tempVideo.owner = videoInfo.owner;
                tempVideo.channelId = videoInfo.channelId;
                tempVideo.title = videoInfo.title;
                tempVideo.description = videoInfo.description;
                tempVideo.views = videoInfo.views;
                tempVideo.comments = videoInfo.commentCount;
                tempVideo.likes = videoInfo.likeCount;
                tempVideo.dislikes = videoInfo.dislikeCount;
                tempVideo.releaseDate = videoInfo.datePublished;
                tempVideo.addedDate = moment();

                resolve(tempVideo);
            });
        }
        catch (e) {
            console.log(e);
            resolve(tempVideo);
        }

    });
}

function randomVideoData(url){
    const tempVideo = {};

    fetchVideoInfo(url).then(function (videoInfo) {
        tempVideo.videoId = videoInfo.videoId;
        tempVideo.owner = videoInfo.owner;
        tempVideo.channelId = videoInfo.channelId;
        tempVideo.title = videoInfo.title;
        tempVideo.description = videoInfo.description;
        tempVideo.views = videoInfo.views;
        tempVideo.comments = videoInfo.commentCount;
        tempVideo.likes = videoInfo.likeCount;
        tempVideo.dislikes = videoInfo.dislikeCount;
        tempVideo.releaseDate = videoInfo.datePublished;
        tempVideo.addedDate = moment();



    });

    tempVideo.views = (Math.random() * (1500 - 0+ 1) ) << 0;
    tempVideo.comments = (Math.random() * (100 - 0+ 1) ) << 0;
    tempVideo.likes = (Math.random() * (1000 - 0+ 1) ) << 0;
    tempVideo.dislikes = (Math.random() * (500 - 0+ 1) ) << 0;

    const y = (Math.random() * (2018 - 0+ 1) ) << 0;
    const m = (Math.random() * (11 - 0+ 1) ) << 0;
    const d = (Math.random() * (30 - 0+ 1) ) << 0;

    tempVideo.releaseDate = moment(y+'-'+m+'-'+d);
    tempVideo.addedDate = moment();

    return tempVideo;

}


EventVideoController.getChannel = function(req,res){

    const searchParams = {channelId:req.params.id};
    try {
        EventVideo.getChannelVideos(searchParams,{},function (err,results) {

            if(err){

                res.render('error',{'error':''});
            }
            else {
                if(results.length==0){
                    res.render('error',{'error':'No videos found '});
                }
                else {
                    const uniqueLinks = [];
                    let videos = [];
                    videos = results.filter(function (result) {
                        if(uniqueLinks.indexOf(result.videoId)==-1){
                            uniqueLinks.push(result.videoId);
                            return result;
                        }
                    });
                    res.render('channel',{channelId:req.params.id,videos:videos});

                }


            }
        });
    }
    catch (e) {
        res.render('error',{'error':''});
    }
};
module.exports = EventVideoController;