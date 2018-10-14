const mongoose = require('mongoose');
const moment = require('moment');
var fetchVideoInfo = require('youtube-info');
const config = require('./config/credintials');
const EventVideo  = require('./model/eventVideo');
const delay = (duration) => new Promise(resolve => setTimeout(resolve, duration));


mongoose.connect(config.database);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.connection.on('connected',()=>{
    console.log('connected to '+config.database);
});
mongoose.connection.on('error',(error)=>{
    console.log('Database error '+error);
});

var operationCount =0;

async function fetchVideos(uniqueUrls){

    for (let u of uniqueUrls){
        const delayMilliseconds = ((Math.random() * (15 - 0+ 1) ) << 0)*1000 ;
        fetchVideoInfo(u,function (err,videoInfo) {

            if(err){

            }
            else {
                EventVideo.update({ videoId: u },{
                    $set:{
                        views:videoInfo.views,
                        comments:videoInfo.commentCount,
                        likes:videoInfo.likeCount,
                        dislikes:videoInfo.dislikeCount,
                    }
                },{"multi": true},function (err,data) {

                    //check and close connection
                    if(err){
                        console.log('updating failed for '+u+' video at'+moment().format("YYYY-MM-DD HH:mm:ss"));
                    }
                    else {
                        console.log('Successfully updated'+u+' video at'+moment().format("YYYY-MM-DD HH:mm:ss"));
                    }

                    operationCount--;

                    if(operationCount==0){
                        mongoose.disconnect();
                        console.log('Crawling Finished Successfully at '+moment().format("YYYY-MM-DD HH:mm:ss"));
                    }


                });
            }

        });

        console.log('setting a '+delayMilliseconds+'ms delay');
        await delay(delayMilliseconds);

    }

}
async function run() {


    try {
        //get Unique video ID list
        EventVideo.getEventVideoList({},{},function (err,videoList) {

            if(err){
                console.log('Crawling fail at '+moment().format("YYYY-MM-DD HH:mm:ss"));
            }
            else {
                console.log('Crawling Started at '+moment().format("YYYY-MM-DD HH:mm:ss"));
                const a = videoList.map(v => v.videoId);
                const uniqueUrls = [... new Set(a)];
                console.log(uniqueUrls);
                operationCount = uniqueUrls.length;


                fetchVideos(uniqueUrls);



            }
        });
    }
    catch (e) {
        console.log(e);
    }
}


run();