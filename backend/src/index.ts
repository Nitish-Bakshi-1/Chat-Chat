// console.log("waheguru");

import { WebSocket, WebSocketServer } from "ws";

interface User {
  socket: WebSocket;
  room: string;
  username: string;
}

let allSockets: User[] = [];

const ws = new WebSocketServer({ port: 8080 });

ws.on("connection", (socket) => {
  socket.on("message", (message: string) => {
    const parsedMessage = JSON.parse(message);
    const { username, room } = parsedMessage.payload;
    if (parsedMessage.type === "join") {
      if (username && room) {
        allSockets.push({
          socket,
          room,
          username,
        });
      }
    }
    if (parsedMessage.type === "chat") {
      let currentUserRoom = null;
      let currentUser: User | null = null;

      for (let i = 0; i < allSockets.length; i++) {
        if (allSockets[i].socket === socket) {
          currentUserRoom = allSockets[i].room;
          currentUser = allSockets[i];
          break;
        }
      }

      allSockets.forEach((s) => {
        if (s.room === currentUserRoom) {
          s.socket.send(
            JSON.stringify({
              text: parsedMessage.payload.message.text,
              sender: currentUser?.username,
            })
          );
        }
      });
    }
  });
  socket.on("close", () => {
    allSockets = allSockets.filter((user) => user.socket !== socket);
  });
});
