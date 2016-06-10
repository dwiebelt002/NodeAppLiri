//require command allows twitter keys from keys.js to access file
var keys = require('./keys.js');

//grabs the access keys, keeps the for later in variable keysTwitter
var keysTwitter = keys.twitterKeys;

//our general request variable
var request = require('request');

//gets access into files
var fs = require('fs');

//varibles for arguments
var command = process.argv[2];

var value = process.argv[3];

//parameter variable allows access to inputs we have put in queries
var parameter = process.argv.slice(3).join('+');

//require pulls from twitter and spotify apis 
var twitter = require ('twitter');

var spotify = require('spotify');

//parameters to our search query for my twitter account
var twitterParams = {
    screen_name: 'DevinWiebelt',
    count: 20,
}

//this function will write to the txt.log file
function writeToLog(textParam) {
    fs.appendFile('log.txt', textParam, function(err) {
        if (err) {
            return console.log (err);
        };

        console.log('log.txt was updated');
    });
};

//the following code controls what data you get based on the user input
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

//this placeholder will be the string variable that will write to our log.txt file
var writeObj = "";

//twitter function below grabs the last 20 tweets from @DevinWiebelt user account
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

    console.log('The following are the last ' + response.length + ' tweets from user @DevinWiebelt.')
     
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

function doSomething(parameter) {

    fs.readFile('random.txt', 'utf8', function(err, data){

        if (err) {
            console.log(err);
        };

        var randomOutput = data.toString().split(',');

        command = randomOutput[0];
        parameter = randomOutput[1];

        switch (command) {
            case 'my-tweets':
                getTweetData();
            break;
            case 'spotify-this-song':
                getMusicData(parameter);
            break;
            case 'movie-this':
                getMovieData(parameter);
            break;
            
            default:
                console.log('What you entered is not recognized. Please try again.');
        };
    });
};