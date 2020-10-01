
const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
 
    code: { 
        type: String
    },
    word : {
        type : String 
    } , 
    players : {
        type : Array 
    } , 
    letters : {
        type : Array 
    }, 
    wrongMoves : {
        type : Number  
    }

} );

module.exports = mongoose.model('room', RoomSchema);