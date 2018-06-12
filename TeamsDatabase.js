const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
    id:{
        type: String,
        required: true
    },
    flagUrl:{
        type: String,
    },
    flagFile:{
        type: String,
    },
    details:{
        MP: String,
        W: String,
        D: String,
        L: String,
        GF: String,
        GA: String,
        GD: String,
        P: String
    }
});

const Team = module.exports = mongoose.model('Team', teamSchema);


getTeams = function(callback) {
    Team.find(callback);
}

getTeamByName = function(id, callback){
    Team.findById(id, callback);
}

addTeam = function(team, callback){
    Team.create(team, callback);
}

updateTeam = function(id, team,  callback){
    const query = Team.find();
    
    
    var update = {
        flagUrl: team.flagUrl,
        flagUrl: team.flagFile,
        details: {
            MP: team.details.MP,
            W: team.details.W,
            D: team.details.D,
            L: team.details.L,
            GF: team.details.GF,
            GA: team.details.GA,
            GD: team.details.GD,
            P: team.details.p
        }
        
    }
    query.where('id').gte(id).update(update, callback);
    // Team.findOneAndUpdate(query, update, options, callback);
}

removeTeam = function(id, callback){
    const query = Team.find();
    query.where('id').gte(id).remove(callback);
}

checkIfExist = function(){
    return Team.where('id').gte('Russia').exists();
}

module.exports = {
    getTeams:getTeams,
    getTeamByName:getTeamByName,
    addTeam:addTeam,
    updateTeam:updateTeam,
    removeTeam:removeTeam,
    checkIfExist:checkIfExist
}