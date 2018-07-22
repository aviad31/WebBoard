var express = require('express');
var router = express.Router();

/* info of users lodged in
       console.log('userAgent : ' + req.get('User-Agent'));
       console.log('ip: '+ req.connection.remoteAddress);
*/

/* GET home page. */
router.get('/', function(req, res, next) {
    var singleDB=require('../singletonDB');
    var io = require('../bin/www');

    //index page name
    var indexPageName = req.url;

    //draw from data base
    singleDB.getPaintFromUrl('/',(rows) =>{{
        res.render('index', { elementDraw: JSON.stringify(rows), grp: indexPageName });
    }});

    socketHandling(io,singleDB,indexPageName);
});

//socket handle
function socketHandling(io,singleDB,indexPageName){
    io.on('connection',
        // We are given a websocket object in our function
        function (socket) {
            console.log("We have a new client: " + socket.id);

            //receive draw from client
            socket.on(indexPageName+'-print',
                function(data) {
                    console.log("Received: 'print' " + data.x + " " + data.y);
                    //add to data base the paint
                    singleDB.insertElemnt(indexPageName,data.x,data.y,data.color);
                    // Send it to all other clients
                    socket.broadcast.emit(indexPageName+'-print', data);
                }
            );

            //client disconnect
            socket.on('disconnect', function() {
                console.log("Client has disconnected");
            });
        }
    );
}


module.exports = router;
