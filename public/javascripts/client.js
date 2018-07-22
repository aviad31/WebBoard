var socket;

/**
 *how to paint
 * 255 white
 * 0 black
 * -1 none
 */
var paint=-1;

//draw in the database
var drawHistory = JSON.parse(document.currentScript.getAttribute('data'));

//group Page Name
var groupPage = document.currentScript.getAttribute('grp');

//server IP
var url= document.location.toString().substring(7);
var serverIP=url.substr(0,url.indexOf(':'));

/**
 * make a canvas and listen on the socket
 */
function setup() {
    //make canvas
    canvas = createCanvas(400, 400);
    canvas.position(90, 200);
    background(0);

    // Start a socket connection to the server
    socket = io.connect('http://'+serverIP+':3000');

    //draw elements from data base on the canvas
    drawElements(drawHistory);

    // anonymous callback function
    socket.on(groupPage+'-print',
        // When we receive data
        function(data) {
            console.log("Got: " + data.x + " " + data.y + " " + data.color);
            // Draw a circle
            drawElemnt(data);

        }
    );
}


// when mouse is press and dragged draw circles if paint!=-1
function mouseDragged() {
    if(paint != -1 )
    {
        // Make a little object with x and y and color
        var element={x: mouseX,
            y: mouseY,
            color: paint
        };
        drawElemnt(element);
        // Send the mouse coordinates
        sendmouse(element);
    }
}

// Function for sending to the socket
function sendmouse(element) {
    // We are sending!
    console.log("sendmouse: " + element.x + " " + element.y +" "+ element.color);
    // Send that object to the socket
    socket.emit(groupPage+'-print',element);
}

function drawElements(elements) {
    // Draw some white circles
    if(elements)
        elements.forEach( function (element){
            drawElemnt(element)
        });
}

function drawElemnt(element){
    fill(element.color);
    noStroke();
    ellipse(element.x, element.y, 10, 10);
}
//event listeners to button press
$(document).on('click', '#paint', function () {
    paint = 255;
});

$(document).on('click', '#erase', function () {
    paint = 0;
});

