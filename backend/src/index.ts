import { WebSocket, WebSocketServer } from "ws";

interface User {
  socket: WebSocket;
  room: string;
  username: string;
}

let allSockets: User[] = [];
let rooms: Record<string, User[]> = {};

const ws = new WebSocketServer({ port: 8080 });

ws.on("connection", (socket) => {
  socket.on("message", (message: string) => {
    try {
      const parsedMessage = JSON.parse(message);
      const { type, payload } = parsedMessage;

      if (type === "join") {
        const { username, room } = payload;

        if (username && room) {
          if (!rooms[room]) {
            rooms[room] = [];
          }
          rooms[room].push({ socket, room, username });
          console.log(`User ${username} joined room ${room}`);

          rooms[room].forEach((user) => {
            username.socket.send(
              JSON.stringify({
                type: "user joined",
                payload: {
                  username,
                  room,
                },
              })
            );
          });
        }
      }

      if (type === "chat") {
        const { message: chatMessage, username } = payload;
        if (!chatMessage) {
          return;
        }

        const currentUser = allSockets.find((user) => user.socket === socket);
        if (!currentUser) {
          return;
        }

        // Broadcasting message to all users in the same room
        allSockets.forEach((user) => {
          if (user.room === currentUser.room) {
            user.socket.send(
              JSON.stringify({
                text: chatMessage,
                sender: currentUser.username,
              })
            );
          }
        });
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  socket.on("close", () => {
    console.log("User disconnected");
    allSockets = allSockets.filter((user) => user.socket !== socket);
  });
});
