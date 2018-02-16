# Hodor
Hodor is a an automation application that is used to open the door controlled by an intercom system from Slack using a custom slash command. 

## How it Works
Once a command `/door open` is sent from slack, it is processed by the slack bot service and validated before triggering the door_service to activate the switch on the intercom system through the relay.
![Hodor in action](https://github.com/KI-labs/Hodor/blob/master/images/Slack_typing.gif "Hodor in action")

## Wiring the Hardware
We imitate a button press on the intercom by short-circuiting the physical button on the intercom. This is done by using a simple relay which is controlled by the Raspberry Pi as shown in the figure.
![Hodor wiring](https://github.com/KI-labs/Hodor/blob/master/images/HardwareWiring.jpg "Hodor: Wiring the hardware")

## Components
![Hodor architecture](https://github.com/KI-labs/Hodor/blob/master/images/HodorArchitecture.jpg "Hodor: Architecture")
* __door_service__(nodejs_rpi): Raspberry Pi running a Node.js server that is connected to the intercom switch using a relay.
* __slack_bot__: Slack integration with a custom slash command `/door` which is handled by a serverless Python web service running on AWS Lambda

## How to Run?
### Door Service
```
$ npm install 
$ node app.js
```
#### Deployment
If the server is run on port 80 of Raspberry Pi, it can be available on the internet using [Dataplicity](https://www.dataplicity.com/).

Cron jobs can be added to automatically restart the service on restart of the device.
```
@reboot /path/to/node /path/to/the/app.js &
```

### Slack Bot
``` 
$ export VERIFICATION_TOKEN=<Verification Token for App from Slack>
$ export CHANNEL_ID=<Identifier for the Slack Channel in which command should be accessible>
$ export DOOR_SERVICE=<URL end point for the Node.js server running on Raspberry Pi>
$ pip install -r requirements.txt
$ python slack_bot.py
```
#### Deployment to AWS Lambda
```
$ zappa init
$ zappa deploy
```
Note: Your AWS credentials need to be configured for [Zappa](https://www.zappa.io/) to work.
