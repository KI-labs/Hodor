# Hodor
Hodor is a an automation application that is used to open the door controlled by an intercom system from Slack using a custom slash command. 

## Components
* __door_service__: Raspberry Pi running a Node.js server that is connected to the intercom switch using a relay.
* __slack_bot__: Slack integration with a custom slash command `/door` which is handled by a serverless Python web service running on AWS Lambda

## How it Works
Once a command `/door open` is sent from slack, it is processed by the slack bot service and validated before triggering the door_service to activate the switch on the intercom system through the relay.
