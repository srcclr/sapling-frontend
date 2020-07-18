import config from './config';
import { useState, useEffect } from 'react';

let socket;
let messageHandler;
let connected = false;

function initWebSocketConnection() {
  // This has to be idempotent because it's called from every page's useEffect.
  // That is done because on hot reload, socket will be set to null, causing everything to break.
  if (socket && socket.readyState === 1) {
    return Promise.resolve();
  }

  if (socket) {
    socket.close();
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

/**
 * This hook exposes SocketWrapper containing an instance of the created WebSocket object
 * and the send function. `send` function "wraps" WebSocket's `send` to add
 * checks on the socket object's ready state before performing actual send.
 *
 * @param props { messageHandler, userAuthToken }
 */
export function useWebSocket(props) {
  const { messageHandler, userAuthToken } = props || {};

  /**
   * Main instance of websocket which events and states are tracked.
   * This is stored in the instance property of the SocketWrapper - the object that
   * is passed as a value to the SocketContext defined in the App.tsx
   */
  const [instance, setInstance] = useState<WebSocket>(null);

  const [readyState, setReadyState] = useState(undefined);

  const sendFn = (i: WebSocket, token: string) => {
    return message => {
      if (i) {
        i.send(JSON.stringify({ ...message, token }));
      }
    };
  };

  /**
   * socketWrapper state stores the current instance and the `send` function.
   * `send` function is run the MiddleWare executes `sendMessage()` defined in
   * a WebSocket-supported action creator (ie, boardActions#openedBoard)
   */
  const [socketWrapper, setSocketWrapper] = useState<ISocketWrapper>({
    instance,
    send: sendFn(instance, userAuthToken),
  });

  useEffect(
    () => {
      if (!instance) {
        const ws = new WebSocket(`${config.WS_URL}/ws`);
        ws.binaryType = 'arraybuffer';

        ws.onopen = function() {
          setReadyState(ws.readyState);
        };

        ws.onmessage = event => {
          if (messageHandler) {
            messageHandler(event);
          }
        };

        ws.onclose = function() {
          setReadyState(ws.readyState);

          // Try to reconnect
          // We handle reconnection by detecting CLOSED readyState in useEffect below
        };

        setInstance(ws);
      }
    },
    [instance]
  );

  /**
   * Closes socket instance and nullifies instance's readyState is CLOSED (3)
   * This kickoffs useEffect above
   */
  useEffect(
    () => {
      if (readyState === 3) {
        instance.close();
        setInstance(null);
      }
    },
    [readyState]
  );

  /**
   * Creates and sets SocketWrapper when instance and userAuthToken changes
   */
  useEffect(
    () => {
      if (instance) {
        setSocketWrapper({
          instance,
          send: sendFn(instance, userAuthToken),
        });
      }
    },
    [instance, userAuthToken]
  );

  return [socketWrapper];
}

export interface ISocketWrapper {
  instance: WebSocket;
  send: (message: Object) => void;
}
