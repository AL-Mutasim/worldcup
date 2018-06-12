const express = require('express');
const mongoose = require('mongoose');
const rp = require('request-promise');
const jsdom = require("jsdom");
const schedule = require('node-schedule');
const { JSDOM } = jsdom;
var operation = require('./Operations');
var TeamsDatabase = require('./TeamsDatabase');
var MatchesDatabase = require('./MatchesDatabase');
var newsDatabase = require('./newsDatabase');

const app = express();



mongoose.connect("mongodb://localhost/world-cup")
    .catch(error => console.log(`database Error ${error}`));
var db = mongoose.connection;




app.listen(3000, () => console.log("server running in port 3000"));


app.get('/favicon.ico', (request, response) => response.status(204));

app.get('/', (request, response) => {
    response.send('hello')
})

app.get('/api/worldcup/matchScores', (request, response) => {
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    MatchesDatabase.getMatches((err, data) => {
        console.log(err);
        response.send(data);
    });
});


app.get('/api/worldcup/teamsData', (request, response) => {
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    TeamsDatabase.getTeams((err, data) => {
        console.log(err);
        response.send(data);
    })
});

app.get('/api/worldcup/news', (request, response) => {
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    newsDatabase.getNews((err, data) => {
        console.log(err);
        response.send(data);
    })
});



schedule.scheduleJob('0 */1 * * * *', function(){
    operation.updateScors();
    console.log("done update scores")
  });

schedule.scheduleJob('0 */4 * * * *', function(){
    operation.updateScors2();
    console.log("done update scores2")
});

schedule.scheduleJob('0 */5 * * * *' ,function(){
    operation.updateTeamsData();
    console.log("done update teamsData");
})

schedule.scheduleJob('0 */30 * * *', function(){
    operation.removeAllNews();
    operation.updateNews();
    console.log('done update news');
});
