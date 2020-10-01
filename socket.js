const RoomModel = require('./models/room'); 
module.exports = function (server) {
    const io = require('socket.io')(server);
    
    
    io.on('connection', client => {
        console.log('client connected');


        client.on('disconnect', () => {
            console.log('client disconnected');
        });


        client.on("join-room" , async ({room: roomCode , userId: userId}) => {
            // @todo room exists 
            client.join(roomCode); 
            
            // get room 
            const room = await RoomModel.findOne({code : roomCode}); 
            // if user is not in the room then add it 
            if(room.players.find(p => p.id == userId ) == null ){
                    room.players.push(
                        {
                            id : userId ,
                            score : 0 
                        }
                    ); 

                    await room.save(); 
            }

            client.emit("room-joined" , { wordLength : room.word.length , clickedLetters : room.letters.filter(e => e.clicked ) , wrongMoves : room.wrongMoves  });
            io.in(roomCode).emit("user-joined" , room.players); 
            
        }); 

        client.on("move" ,async (data) => { 

            // data 
            /*   
                { 
                    player : , 
                    move : "d" 
                    room 
                }
             */
            const room = await RoomModel.findOne({code : data.room}); 
            /*
                {
                    code : "" , 
                    word : ""  ,
                    letters : [ { letter : "b" , index : 0 , clicked : true  }  , { } ,  {}]
                }
            */
            // { letter  : "a" , index : 3 }
            let letter  = room.letters.find( e => e.letter == data.move && !e.clicked ); 
            let result = false; 
            let player = room.players.find ( e => e.id === data.player ); 
            if(letter) {
                letter.clicked = true ; 
                result = true; 
                await RoomModel.updateOne( { _id : room.id } , {  $set : { letters : room.letters }}); 
                player.score += 10; 
            }else {
                player.score -= 5 ;                 
                // update room wrongMoves 
                room.wrongMoves += 1 ; 
                await room.save(); 
            }
            // update player score 
            await RoomModel.updateOne( { _id : room.id } , {  $set : { players : room.players }}); 

            

            io.in(data.room).emit("move-recieved" , {  result , letter  , player : player.id  }); 
        });


        


    });

    return io; 
}