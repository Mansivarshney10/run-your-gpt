from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import json
import asyncio
import sys
import websockets

app = Flask(__name__)
socketio = SocketIO(app)

HOST = 'localhost:5005'
URI = f'ws://{HOST}/api/v1/stream'

async def run(prompt):
    request = {
        'prompt': prompt,
        # Other request parameters
    }

    async with websockets.connect(URI, ping_interval=None) as websocket:
        await websocket.send(json.dumps(request))

        while True:
            incoming_data = await websocket.recv()
            incoming_data = json.loads(incoming_data)

            match incoming_data['event']:
                case 'text_stream':
                    yield incoming_data['text']
                case 'stream_end':
                    return


@socketio.on('user_message')
def handle_user_message(user_message):
    bot_responses = asyncio.run(list(run(user_message)))
    for response in bot_responses:
        emit('bot_response', response)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    socketio.run(app, debug=True)
