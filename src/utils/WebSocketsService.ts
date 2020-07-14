import config from './config';
import AuthService from './AuthService';

let socket;
let boardUpdateCallback;

function connect() {
  socket = new WebSocket(`${config.WS_URL}/ws`);
  socket.binaryType = 'arraybuffer';

  socket.onopen = function(event) {
    console.log('websocket connected');
  };

  socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    switch (data['@type']) {
      case 'Board':
        boardUpdateCallback(data.board);
        break;
    }
  };
}

function send(message) {
  socket.send(JSON.stringify(message));
}

function openedBoard(id) {
  send({ '@type': 'OpenedBoard', board: id });
}

function onBoardUpdate(f) {
  boardUpdateCallback = f;
}

export { onBoardUpdate, openedBoard, connect };
