//require command allows twitter keys from keys.js to access file
var keys = require('./keys.js');

var request = require(request);

var fs = require('fs');

var command = process.argv[2];

var twitter = require ('twitter');

var spotify = require('spotify');

var tweetClient = new twitter(keys.twitterKeys);

var twitterParams = {
    screen_name: 'DevinWiebelt'
}

var select = function (caseData, functionData) {

    switch (command) {
        case 'my-tweets':
            getTweetData();

            break;

        case 'movie-this':
            getMovieData();

            break;

        case 'spotify-this-song':
            getMusicData(functionData);

            break;

        case 'do-what-it-says':
            doSomething();

            break;

        default:
            console.log('What you entered is not recognized. Please give it another try and I will do my best to assist.')

         }
    };


var getTweetData = function () {

    tweetClient.get('statuses/user_timeline', twitterParams, function(err, response) {
        if (!err) {
            console.log(err);
        }

        console.log('These are the last ' + response.length + ' tweets made by user @DevinWiebelt.')
        for (var i = 0; i < 20; i++) {

            console.log((i + 1) + ": " + response[i].text);
            console.log('This tweet was posted on: ' + response[i].created_at)
        }
    };
};


function getMusicData() {

}
