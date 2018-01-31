from flask import Flask, request, jsonify
import requests
import os
from datetime import datetime, time
import pytz

app = Flask(__name__)


@app.route("/", methods=['POST'])
def handle_door_open():
    # TODO: Persist Request in Database
    # print(type(request.form), dict(request.form))

    # Check for Authorized Team
    if request.form['token'] != os.getenv('VERIFICATION_TOKEN'):
        return 'Unauthorized Application!!'

    # Check for Authorized Channel
    if request.form['channel_id'] != os.getenv('CHANNEL_ID'):
        return 'Unauthorized Channel!'

    # Get the request from slash command
    request_type = request.form['text']
    if request_type == 'open':
        # Get the current time to check for timing rules
        tz = pytz.timezone('Europe/Berlin')
        current_time = datetime.now(tz)
        current_day = current_time.isoweekday()
        current_timestamp = current_time.timestamp()

        # Rule for weekend
        if current_day >= 6:
            return 'Hodor wants you to enjoy your Weekend outdoors not in the office'

        # Rule for weekdays time limits
        if not(time(6, 30) <= current_time.time() <= time(19, 30)):
            return 'Hodor is disabled between 7:30 PM and 6:30 AM'

        # Call the Service to open the door
        open_url_response = requests.post(os.getenv("DOOR_SERVICE"))

        # Return response to the command
        if open_url_response.ok:
            success_msg = {
                'response_type': 'ephemeral',
                'text': 'Door Opened By <@{0}>'.format(request.form['user_id']),
            }
            return jsonify(success_msg)
        else:
            return 'Something went wrong. Please try again or contact the Developers'
    else:
        # Unknown command
        return "Sorry, that didn't work. \n `/door open` to open the door"


if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=False)
