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
            console.log('What you entered is not recognized. Please Try again.')

         
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


function getMusicData(parameter) {

   if (!parameter) {
        parameter = "ten+thousand+fists";
    };

    
    var queryUrl = 'https://api.spotify.com/v1/search?q='+ parameter +'&limit=5&type=track';

    
    request(queryUrl, function(err, response, body){
      
        if (err) {
            console.log(err);
        };
        
        body = JSON.parse(body);

        
        console.log('--------------------------------------------------------------');
        console.log('The top results based on your search are the following:');
        for (var i = 0; i < body.tracks.items.length; i++) {
            
            console.log('Artist(s): '+body.tracks.items[i].artists[0].name);
            console.log('Song Title: '+body.tracks.items[i].name);
            console.log('Preview Link: '+body.tracks.items[i].preview_url);
            console.log('Album Name: '+body.tracks.items[i].album.name);
            console.log('--------------------------------------------------------------');
            
            writeObj = command+", "+parameter+", "+body.tracks.items[i].artists[0].name+", "+body.tracks.items[i].name+", "+body.tracks.items[i].preview_url+", "+body.tracks.items[i].album.name+"\n"; 
        };
        
        writeToLog(writeObj);
    });
};

function getMovieData() {
    if (!parameter) {
        parameter = "Star+Trek+Into+Darkness";
    };
    
    var queryUrl = 'http://www.omdbapi.com/?t=' + parameter +'&y=&plot=short&r=json&tomatoes=true';

    request(queryUrl, function(err, response, body){
        if (err) {
            console.log(err);
        } 
       

        body = JSON.parse(body);
        console.log('--------------------------------------------------------------');
        console.log('Title: '+ body.Title);
        console.log('Year released: '+ body.Year);
        console.log('IMDB rating: '+ body.imdbRating);
        console.log('Countries Released in: '+ body.Country);
        console.log('Languages Released in: '+ body.Language);
        console.log('Plot: '+ body.Plot);
        console.log('Actors: '+ body.Actors);
        console.log('Rotten Tomatoes Rating: '+ body.tomatoRating);
        console.log('Rotten Tomatoes URL: '+ body.tomatoURL);
        console.log('--------------------------------------------------------------');
        
        writeObj = command+", "+parameter+", "+body.Title+", "+body.Year+", "+body.imdbRating+", "+body.Country+", "+body.Language+", "+body.Plot+", "+body.Actors+", "+body.tomatoRating+", "+body.tomatoURL+"\n";

        writeToLog(writeObj);
    });
};