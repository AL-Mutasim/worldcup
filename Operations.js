const rp = require('request-promise');
const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
var matches = JSON.parse(fs.readFileSync('./matches.json', 'utf8'));
var TeamsDatabase = require('./TeamsDatabase');
var MatchesDatabase = require('./MatchesDatabase');
var newsDatabase = require('./newsDatabase');


const updateNews = function () {
    rp("http://www.livesoccertv.com/competitions/international/world-cup/")
        .then(html => {
  
            const dom = new JSDOM(html);
            var item = dom.window.document.getElementsByClassName("news_item");
            for (var i = 0; i < item.length; i++) {
                var team = item[i];
                var artical = {
                    url: "http://www.livesoccertv.com" + team.getElementsByTagName("a")[0].getAttribute("href"),
                    title: team.getElementsByTagName("a")[2].textContent,
                    imageUrl: team.getElementsByTagName("img")[0].getAttribute("data-cfsrc")
                }
                // news.push(artical);
                // console.log(artical);
                newsDatabase.addNews(artical, error=> console.log(error));
            }
            // return JSON.stringify(news);
        })
        .catch(error => console.log(error));
}

const removeAllNews = function(){
    newsDatabase.removeAll(error=> console.log(error));
}


function updateScors(){
    matches.matches.forEach(element => {
        updateScore(element.id2);
    });
}


function updateScors2(){
    matches.matches.forEach(element => {
        updateScore2(element.id);
    });
}
/**
 * get Matche score by id
 *
 * @param {*} id
 * @returns promise of json data
 */
const updateScore = function (id) {
    rp(`https://www.soccerstand.com/match/${id}/#match-summary`)
        .then(htmlString => {
            const dom = new JSDOM(htmlString);
            var s = dom.window.document.body.getElementsByClassName("team");
            var s2 = s[0];
            if (s2 == null) return;
            var result = s2.getElementsByClassName("current-result")[0].textContent.split("-");
            var homeTeam = s2.getElementsByClassName("tname-home")[0].textContent.trim();
            var awayTeam = s2.getElementsByClassName("tname-away")[0].textContent.trim();
            var match = {
                homeTeamScore: result[0] || null,
                awayTeamScore: result[1] || null
            }

            MatchesDatabase
            .updateMatch(homeTeam, awayTeam, match, error => console.log(error))
            console.log('done');
            // return JSON.stringify(match);
        })
        .catch(error => console.log(error));
}


/**
 * get Matche score by id
 *
 * @param {*} id
 * @returns promise of json data
 */
var updateScore2 = function (id) {
     rp(`http://www.espn.com/soccer/match?gameId=${id}`)
        .then(html => {
            const dom = new JSDOM(html);
            var team = dom.window.document.body;
            var teamAwayHtml = team.getElementsByClassName("team away")[0];
            var teamHomeHtml = team.getElementsByClassName("team home")[0];
            var homeTeam= teamAwayHtml.getElementsByClassName("long-name")[0].textContent;
            var awayTeam= teamHomeHtml.getElementsByClassName("long-name")[0].textContent;
            var match = {
                homeTeamScore: teamAwayHtml.getElementsByClassName("score-container")[0].textContent.trim() || null,
                awayTeamScore: teamHomeHtml.getElementsByClassName("score-container")[0].textContent.trim() || null
            }
            MatchesDatabase
            .updateMatch(homeTeam, awayTeam, match, error => console.log(error))
            console.log('done');
        })
        .catch(error => console.log(error));
}

/**
 * get teams datails 
 *  like that {"cuntry":"Russia","MP":"0","W":"0","D":"0","L":"0","GF":"0","GA":"0","GD":"+0","p":"0"}
 * @returns promise of json of teams
 */
var updateTeamsData = function getTeamsData() {
    return rp(`http://www.livesoccertv.com/competitions/international/world-cup/`)
        .then(html => {
            const dom = new JSDOM(html);
            var team = dom.window.document.getElementById("fixtures").getElementsByTagName("tr");
            var arrayOfTeams = cleanArray(team[0].getElementsByTagName("td")[0].textContent.split("\n"));
                updateTeams(arrayOfTeams);
        })
        .catch(error => console.log(error));
}

/**
 * change the style of data
 *
 * @param {array} array
 * @returns jsonData
 */
function updateTeams(array) {
    var count = 0;
    // var teamData = new Array();
    for (i = 0; i < array.length; i++) {
        data.teams.forEach(team => {
            if (array[i] == team.name) {
                var team = {
                    id: team.name,
                    flagUrl: team.flag,
                    flagFile: team.name+".png",
                    details: {
                        MP: array[i + 1],
                        W: array[i + 2],
                        D: array[i + 3],
                        L: array[i + 4],
                        GF: array[i + 5],
                        GA: array[i + 6],
                        GD: array[i + 7],
                        P: array[i + 8]
                    }
                }
                TeamsDatabase.updateTeam(team.name, team, error => console.log(error));
            }
        });
    }

}




/**
 * remove empty items in array
 *
 * @param {Array} array
 * @returns array
 */
function cleanArray(array) {
    var resultArray = new Array();
    for (var i = 0; i < array.length; i++) {
        if (array[i] != "")
            resultArray.push(array[i]);
    }
    return resultArray;
}


/**
 * get id from teams name
 *  anether way
 * @param {text} match
 * @returns string
 */
function getIdFromMatch(match) {
    var id;
    var s = match.trim().split("*")
    matches.matches.forEach(element => {
        if (element.hometeam == capitalizeFirstLetter(s[0])) {
            if (element.awayTeam == capitalizeFirstLetter(s[1])) {
                id = { id: element.id, id2: element.id2 }
            }

        }
    });
    return id;
}

// console.log( getIdFromMatch("poland*colombia") );
// console.log( getIdFromMatch2("poland*colombia").id2 );


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


module.exports = {
    updateNews:updateNews,
    updateTeamsData: updateTeamsData,
    getIdFromMatch:getIdFromMatch,
    removeAllNews:removeAllNews,
    updateScors:updateScors,
    updateScors2:updateScors2
}