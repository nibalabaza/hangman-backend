const RoomModel = require('../models/room'); 
const WordModel = require('../models/word'); 
const cryptoRandomString = require('crypto-random-string'); 
module.exports = {
    create : async (req, res) => {  
        let code = cryptoRandomString({length: 10, type: 'url-safe'}); 
        const word = await WordModel.random(); 
        // @todo get a new word  
        let room = { 
            code , 
            players : [] , 
            word : word.value , 
            letters  : word.value.split("").map( (e, i ) => ({ letter : e  , index : i , clicked : false })) , 
            wrongMoves : 0 
        }; 
        let result = await RoomModel.create(room); 
        res.send(result);
    }
}