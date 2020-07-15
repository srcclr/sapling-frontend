import config from './config';
import AuthService from './AuthService';

let socket;
let identity;
let boardUpdateCallback;

function send(message) {
  socket.send(JSON.stringify(message));
}

function initWebSocketConnection() {
  // This has to be idempotent because it's called from every page's useEffect.
  // That is done because on hot reload, socket will be set to null, causing everything to break.
  if (socket) {
    return Promise.resolve();
  }

  socket = new WebSocket(`${config.WS_URL}/ws`);
  socket.binaryType = 'arraybuffer';

  const p = new Promise((resolve, _) => {
    socket.onopen = function() {
      resolve();
    };
  });

  socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    switch (data['@type']) {
      case 'Board':
        boardUpdateCallback(data.board);
        break;
    }
  };

  return p;
}

// The socket is nulled when hot reloading, but the underlying connection persists.
// We need to explicitly get rid of it.
module.hot.dispose(_ => {
  if (socket) {
    socket.close();
  }
});

function openedBoard(id) {
  send({ '@type': 'OpenedBoard', board: id });
}

function onBoardUpdate(f) {
  boardUpdateCallback = f;
}

export { onBoardUpdate, openedBoard, initWebSocketConnection };
