'use strict';

require("dotenv").config();
let keys = require("./keys.js");
let request = require("request");
let twitter = require("twitter");
let nodeSpotifyApi = require("node-spotify-api");
let fs = require("fs");
let oper = process.argv[2];
let remArgs = "";


for (let i = 3; i < process.argv.length; i++) {
    if (i === 3) {
        remArgs = remArgs + process.argv[i]
    }
    else {
        remArgs = remArgs + " " + process.argv[i]
    }
}

function doOper() {
    switch (oper) {
        case "my-tweets":
            myTweets();
            break;

        case "spotify-this-song":
            spotThisSong();
            break;

        case "movie-this":
            movieThis();
            break;

        case "do-what-it-says":
            doIt();
            break;
    }
}

function myTweets() {
    let client = new twitter(keys.twitter);
    let screen_name = "Autolispman"
    let count = 20
    let queryUrl = "https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=" + screen_name + "&count=" + count
    client.get(queryUrl, function (err, data, response) {
        let arr = [];
        if (!err && response.statusCode === 200) {
            let prom = new Promise(function (resolve) {
                for (let i = 0; i < data.length; i++) {
                    arr.push("-------------------------------");
                    arr.push("Created on " + data[i].created_at);
                    arr.push("Message " + data[i].text);
                }
                resolve(arr);
            });
            prom.then(displayToScreen).then(sendToLogFile).catch(result => console.log(result));
        }
        else {
            let prom = new Promise(function (resolve) {
                arr.push(err);
                resolve(arr);
            })
            prom.then(displayToScreen).then(sendToLogFile).catch(result => console.log(result));
        }
    })
}

function spotThisSong() {
    let spotify = new nodeSpotifyApi(keys.spotify);;
    if (remArgs === "") {
        spotify.search({ type: "track", query: "The Sign" }, function (err, data) {
            let arr = [];
            if (!err) {
                let prom = new Promise(function (resolve) {
                    for (let i = 0; i < data.tracks.items.length; i++) {
                        if (data.tracks.items[i].name === "The Sign" && data.tracks.items[i].artists[0].name === "Ace of Base") {
                            arr.push("-------------------------------");
                            arr.push("Artists:  " + data.tracks.items[i].artists[0].name)
                            arr.push("Song name:  " + data.tracks.items[i].name)
                            arr.push("Preview url:   " + data.tracks.items[i].preview_url)
                            arr.push("Album name:   " + data.tracks.items[i].album.name)
                            break;
                        }
                    }
                    resolve(arr);
                });
                prom.then(displayToScreen).then(sendToLogFile).catch(result => console.log(result));
            }
            else {
                let prom = new Promise(function (resolve) {
                    arr.push(err);
                    resolve(arr);
                })
                prom.then(displayToScreen).then(sendToLogFile).catch(result => console.log(result));
            }
        })
    }
    else {
        spotify.search({ type: "track", query: remArgs, limit: "1" }, function (err, data) {
            let arr = [];
            if (!err) {
                let prom = new Promise(function (resolve) {
                    arr.push("-------------------------------");
                    arr.push("Artists:  " + data.tracks.items[0].artists[0].name)
                    arr.push("Song name:  " + data.tracks.items[0].name)
                    arr.push("Preview url:   " + data.tracks.items[0].preview_url)
                    arr.push("Album name:   " + data.tracks.items[0].album.name)

                    resolve(arr);
                });
                prom.then(displayToScreen).then(sendToLogFile).catch(result => console.log(result));
            }
            else {
                let prom = new Promise(function (resolve) {
                    arr.push(err);
                    resolve(arr);
                })
                prom.then(displayToScreen).then(sendToLogFile).catch(result => console.log(result));
            }
        })
    }
}

function movieThis() {
    let movie = "";
    if (remArgs === "") {
        movie = "Mr.+Nobody"
    }
    else {
        movie = remArgs.replace(/ /gi, "+")
    }

    let id = "tt3896198"
    //let apiKey = "78e94a03";
    let apiKey = "trilogy";
    let queryUrl = "http://www.omdbapi.com/?i=" + id + "&apikey=" + apiKey + "&t=" + movie + "&plot=full&r=json"
    request(queryUrl, function (err, response, data) {
        let arr = [];
        if (!err && response.statusCode === 200) {
            let prom = new Promise(function (resolve) {
                let dataP = JSON.parse(data);
                arr.push("-------------------------------");
                arr.push("Title:  " + dataP.Title);
                arr.push("Year:  " + dataP.Year);
                arr.push("IMDB Rating:  " + dataP.imdbRating);
                arr.push("Rotten Tomatoes Rating:  " + dataP.Ratings[1].Value);
                arr.push("Country:  " + dataP.Country);
                arr.push("Language:  " + dataP.Language);
                arr.push("Plot:  " + dataP.Plot);
                arr.push("Actors:  " + dataP.Actors);
                resolve(arr);
            });
            prom.then(displayToScreen).then(sendToLogFile).catch(result => console.log(result));
        }
        else {
            let prom = new Promise(function (resolve) {
                arr.push(err);
                resolve(arr);
            })
            prom.then(displayToScreen).then(sendToLogFile).catch(result => console.log(result));
        }
    })
}

function doIt() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        console.log(data);
        if (err) {
            console.error(err);
        }
        else {
            let splitOnN = data.split("\n");
            for (let i = 0; i < splitOnN.length; i++) {
                let splitOnComma = splitOnN[i].split(",");
                oper = splitOnComma[0];
                remArgs = splitOnComma[1];
                doOper();
            }
        }
    });
}

function displayToScreen(arr) {
    for (let i = 0; i < arr.length; i++) {
        console.log(arr[i]);
    }
    return arr;
}

function sendToLogFile(arr) {
    let str = "";
    for (let i = 0; i < arr.length; i++) {
        str = str + arr[i] + "\n";
    }
    fs.appendFile('log.txt', str, (err) => {
        if (err) {
            console.error(err);
        }
    });
    return arr;
}

doOper();
