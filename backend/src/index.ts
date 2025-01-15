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
    const { type, payload } = parsedMessage;

    if (type === "join") {
      const { username, room } = payload;
      if (username && room) {
        allSockets.push({ socket, room, username });
        console.log(`${username} joined room ${room}`);
      }
    }

    if (type === "chat") {
      const chatMessage = payload.message;
      let currentUserRoom = null;
      let currentUser: User | null = null;

      // Identifying the current user
      for (let i = 0; i < allSockets.length; i++) {
        if (allSockets[i].socket === socket) {
          currentUserRoom = allSockets[i].room;
          currentUser = allSockets[i];
          break;
        }
      }

      if (!currentUser) {
        console.log("No current user found");
        return;
      }

      console.log(
        `Broadcasting message: "${chatMessage}" from ${currentUser.username} in room ${currentUserRoom}`
      );

      // Broadcasting message to all users in the same room
      allSockets.forEach((user) => {
        if (user.room === currentUserRoom) {
          user.socket.send(
            JSON.stringify({
              text: chatMessage,
              sender: currentUser.username, // Sender's username
            })
          );
        }
      });
    }
  });

  socket.on("close", () => {
    console.log("User disconnected");
    allSockets = allSockets.filter((user) => user.socket !== socket);
  });
});
