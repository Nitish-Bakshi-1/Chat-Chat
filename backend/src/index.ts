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
    try {
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
        const { message: chatMessage, username } = payload;
        if (!chatMessage) {
          console.log("Empty message received, ignoring");
          return;
        }

        const currentUser = allSockets.find((user) => user.socket === socket);

        if (!currentUser) {
          console.log("No current user found");
          return;
        }

        console.log(
          `Broadcasting message: "${chatMessage}" from ${currentUser.username} in room ${currentUser.room}`
        );

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
