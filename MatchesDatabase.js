const mongoose = require('mongoose');

const matchSchema = mongoose.Schema({
    group: {
        type: String
    },
    stadium: {
        type: String
    },
    date: {
        type: Date,
        required: true
    },
    homeTeam:{
        type: String,
    },
    awayTeam:{
        type: String,
    },
    homeTeamScore:{
        type: Number,
    },
    awayTeamScore:{
        type: Number,
    },

});

const Match = mongoose.model('match', matchSchema)

getMatches = function(callback){
    Match.find(callback);
}

 getMatchThereNames = function(homeTeam, awayTeam ,callback){
    Match.find({homeTeam: homeTeam, awayTeam:awayTeam}).exec(callback)
}

addMatch = function(match, callback){
    Match.create(match, callback);
}

updateMatch = function(homeTeam, awayTeam, match, callback){
    const query = Match.find({homeTeam: homeTeam, awayTeam:awayTeam});
    var update = {
        homeTeamScore: match.homeTeamScore,
        awayTeamScore: match.awayTeamScore
    };
    query.update(update, callback);
}

removeMatch = function(homeTeam, awayTeam, callback){
    const query = Match.find({homeTeam: homeTeam, awayTeam:awayTeam});
    query.remove(callback);
}


module.exports = {
     addMatch:addMatch,
     getMatches:getMatches,
     getMatchThereNames:getMatchThereNames,
     addMatch:addMatch,
     updateMatch:updateMatch,
     removeMatch:removeMatch
}



