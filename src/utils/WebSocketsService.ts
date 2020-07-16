import config from './config';

let socket;
let messageHandler;
let connected = false;

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
      connected = true;
      resolve();
    };
  });

  socket.onmessage = event => {
    messageHandler(event);
  };

  socket.onclose = function() {
    // Try to reconnect
    connected = false;
    initWebSocketConnection();
  };

  return p;
}

async function send(message) {
  // Lazily initialize connection
  await initWebSocketConnection();
  if (socket && socket.readyState === 1) {
    socket.send(JSON.stringify(message));
  }
}

// The socket is nulled when hot reloading, but the underlying connection persists.
// We need to explicitly get rid of it.
if (module.hot) {
  module.hot.dispose(_ => {
    if (socket) {
      socket.close();
      socket = null;
    }
  });
}

function isConnected() {
  return connected;
}

function handleMessage(fn) {
  messageHandler = fn;
}

// And these are for acting on the messages which come in

export default {
  handleMessage,
  initWebSocketConnection,
  isConnected,
  send,
};
