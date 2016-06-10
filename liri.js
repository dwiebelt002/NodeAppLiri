//require command allows twitter keys from keys.js to access file
var keys = require('./keys.js');

var keysTwitter = keys.twitterKeys;

var request = require('request');

var fs = require('fs');

var command = process.argv[2];

var value = process.argv[3];

var parameter = process.argv.slice(3).join('+');

var twitter = require ('twitter');

var twitterParams = {
    screen_name: 'DevinWiebelt',
    count: 20,
}

var spotify = require('spotify');

function writeToLog(textParam) {
    fs.appendFile('log.txt', textParam, function(err) {
        if (err) {
            return console.log (err);
        };

        console.log('log.txt was updated');
    });
};

    switch (command) {
        case 'my-tweets':
            getTweetData();

            break;

        case 'movie-this':
            getMovieData();

            break;

        case 'spotify-this-song':
            getMusicData();

            break;

        case 'do-what-it-says':
            doSomething();

            break;

        default:
            console.log('What you entered is not recognized. Please give it another try and I will do my best to assist.')

         
    };

var writeObj = "";

function getTweetData() {

var client = new twitter({
    consumer_key: keysTwitter.consumer_key,
    consumer_secret: keysTwitter.consumer_secret,
    access_token_key: keysTwitter.access_token_key,
    access_token_secret: keysTwitter.access_token_secret,
});

    client.get('statuses/user_timeline', twitterParams, function (err, response) {
        if (err) {
            console.log(err);
        };

    console.log('The following are my last ' + response.length + ' tweets.')
     
     for (var i = 0; i < response.length; i++) {

        console.log('#' + (i + 1) + response[i].text);
        console.log('This tweet was posted on: ' + response[i].created_at);

        writeObj += ', ' + '#' + (i + 1) + ": " + response[i].text + response[i].created_at;

     };

     writeObj = command + "" + writeObj + "\n";

     writeToLog(writeObj);

    });

};


function getMusicData() {

    if (value) {

        var song = value;

    }

    else {

        var song = "what's my age again?";
    }

    spotify.search({ type: 'track', query: song}, function(err, data){

        if(err) {
            console.log(err);
            return;
        }

        else {

            console.dir('Artist: ' + data.tracks.items[0].artists[0].name);
            console.dir('Song Name: ' + data.tracks.items[0].name);
            console.dir('Preview Link: ' + data.tracks.items[0].preview_url);
            console.dir('Album: ' + data.tracks.items[0].album.name);

            logText = JSON.stringify({
                artist: data.tracks.items[0].artists[0].name,
                songName: data.tracks.items[0].name,
                previewLink: data.tracks.items[0].preview_url,
                album: data.tracks.items[0].album.name,

            })


        }
    })



}
