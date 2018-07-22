var express = require('express');
var router = express.Router();
var blacklist= ["'",".","(",";",")"];

function privatRoomHandle(url,res){
    var singleDB=require('../singletonDB');
    var io = require('../bin/www');

    //group name page from url
    var grpName = url;

    //check for illegal tokens
    var containTheBlackListElement = blacklist.filter(token =>  grpName.indexOf(token)>=0);
    if(containTheBlackListElement.length == 0){
        //create table if not exist for the grpName and get all rows in the table
        singleDB.serializeCreateAndGet(grpName,(rows) =>{{
            res.render('index', { elementDraw: JSON.stringify(rows), grp: grpName });
        }});
    }
    socketHandling(io,singleDB,grpName);
}

//socket handle
function socketHandling(io,singleDB,grpName){
    io.on('connection',
        // We are given a websocket object in our function
        function (socket) {
            console.log("We have a new client: " + socket.id);
            //receive draw from client
            socket.on(grpName+'-print',
                function(data) {
                    console.log("Received: 'print' " + data.x + " " + data.y +" "+ data.color);
                    //add to data base the paint
                    singleDB.insertElemnt(grpName,data.x,data.y,data.color);
                    // Send it to all other clients
                    socket.broadcast.emit(grpName+'-print', data);
                }
            );
            socket.on('disconnect', function() {
                console.log("Client has disconnected");
            });
        }
    );
}

module.exports = privatRoomHandle;
