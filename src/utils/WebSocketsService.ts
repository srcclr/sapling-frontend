import config from './config';
import AuthService from './AuthService';

let socket;
let boardUpdateCallback, boardListUpdateCallback;
let connected = false;

function initWebSocketConnection(onMessageCallback) {
  console.log(socket ? socket.readyState : '');
  socket = new WebSocket(`${config.WS_URL}/ws`);
  socket.binaryType = 'arraybuffer';

  socket.onopen = function() {
    console.log(socket ? socket.readyState : '');

    connected = true;
  };
  console.log(socket ? socket.readyState : '');

  socket.onmessage = onMessageCallback;

  socket.onclose = function() {
    // Try to reconnect
    console.log(socket ? socket.readyState : '');
    socket.close();
    connected = false;
    initWebSocketConnection(onMessageCallback);
  };
}

function send(message) {
  // Lazily initialize connection
  // await initWebSocketConnection();
  if (socket && socket.readyState === 1) {
    socket.send(JSON.stringify(message));
  }
}

// // The socket is nulled when hot reloading, but the underlying connection persists.
// // We need to explicitly get rid of it.
// if (module.hot) {
//   module.hot.dispose(_ => {
//     if (socket) {
//       socket.close();
//       socket = null;
//     }
//   });
// }

function isConnected() {
  return connected;
}

// And these are for acting on the messages which come in

export default {
  initWebSocketConnection,
  isConnected,
  send,
};
