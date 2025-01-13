// console.log("waheguru");

import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  socket: WebSocket;
  room: string;
}
interface joinMessage {
  type: string;
  payload: {
    room: string;
  };
}
wss.on("connection", (socket) => {
  socket.on("message", (message) => {});
});
