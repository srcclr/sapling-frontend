import React, { useEffect, useState, useRef, useContext, useMemo, useCallback } from 'react';
import { SocketContext } from './App';
import { ISocketWrapper } from 'utils/WebSocketsService';

function Socket({ onOpen }: { onOpen: (socket: ISocketWrapper) => void }) {
  const socketContext = useContext(SocketContext);

  const { socket } = socketContext || {};

  const socketReadyState = socket && socket.instance ? socket.instance.readyState : '';

  useEffect(
    () => {
      if (socketReadyState === 1) {
        onOpen(socket);
      }
    },
    [socketReadyState]
  );

  return <div />;
}

export default Socket;
