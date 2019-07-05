var http = require("http");
var gpio = require("pi-gpio");
var firebaseAdmin = require("firebase-admin");
var pin = 11;
var relayOpen = false;
var openTime = 2000;

// Creation of a simple Webserver to handle requests from slack
http.createServer(function(request, response) {
    new Promise(function(resolve, reject) {
        if (request.method === 'POST' && request.url === '/open') {
            resolve(request.headers);
        } else {
            reject("Wrong request method or url");
        }      
    }).then(function(headers) {
        var header = headers['authorization']||'',
            auth   = header.split(/\s+/) || ['', ''],
            authToken = auth.pop(),
            authType = auth.pop()

        if (authType == "Bearer") {
            return firebaseAdmin.auth().verifyIdToken(idToken);
        } else if (authType == "Basic") {
            return new Promise(function(resolve, reject) {
                if (authToken == process.env.TOKEN) {
                    resolve("");
                } else {
                    reject("password does not conform the environment variable");
                }
            });
        } else {
            return new Promise(function(_, reject) { 
                reject("unknown authentication type");
            });
        }
    }).then(function(_) {
        openDoor(openTime);
        response.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        response.end('Door is opened\n');
    }).catch(function(errorMsg) {
        // No authorization
        response.writeHead(403, {
            'content-type': 'text/html'
        });
        response.end(errorMsg);
    });

}).listen(80); // code is run at port 80 and exposed outside


console.log('Server running at http://127.0.0.1:80/');

// Method to open and close the relay
function openDoor(doorTimeout) {
    doorTimeout = doorTimeout || 1;
    if (!relayOpen) {
        relayOpen = true;
        console.log('open called');
        gpio.open(pin, "output", function(err) { // Open pin 11 for output 
            gpio.write(pin, 1, function() { // Set pin 11 high (1) 
                setTimeout(function() {
                    closeRelay(); // Close pin 11
                }, (doorTimeout));
            });


        });
    }

    return "success";
}

function closeRelay() {
    gpio.write(pin, 0, function() {
        console.log('closed!');
        relayOpen = false;
        gpio.close(pin);
    });

}