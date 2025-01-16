import { WebSocket, WebSocketServer } from "ws";

interface User {
  socket: WebSocket;
  room: string;
  username: string;
}

let rooms: Record<string, User[]> = {}; // Object to store users by room

const ws = new WebSocketServer({ port: 8080 });

ws.on("connection", (socket) => {
  socket.on("message", (message: string) => {
    try {
      const parsedMessage = JSON.parse(message);
      const { type, payload } = parsedMessage;

      if (type === "join") {
        const { username, room } = payload;

        // Add user to the room
        if (username && room) {
          if (!rooms[room]) {
            rooms[room] = [];
          }

          rooms[room].push({ socket, room, username });
          console.log(`User ${username} joined room ${room}`);

          // Notify other users in the room
          rooms[room].forEach((user) => {
            user.socket.send(
              JSON.stringify({
                type: "userJoined",
                payload: { username, room },
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

        // Find the user who sent the message
        const currentUser = Object.values(rooms)
          .flat()
          .find((user) => user.socket === socket);
        if (!currentUser) {
          return;
        }

        // Broadcast the message to all users in the same room
        rooms[currentUser.room].forEach((user) => {
          user.socket.send(
            JSON.stringify({
              type: "chat",
              payload: { message: chatMessage, sender: currentUser.username },
            })
          );
        });
      }

      if (type === "leave") {
        const { username, room } = payload;

        // Remove user from the room
        rooms[room] = rooms[room].filter((user) => user.username !== username);

        // Notify others in the room
        rooms[room].forEach((user) => {
          user.socket.send(
            JSON.stringify({
              type: "userLeft",
              payload: { username, room },
            })
          );
        });
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  socket.on("close", () => {
    // Clean up users when they disconnect
    Object.keys(rooms).forEach((room) => {
      rooms[room] = rooms[room].filter((user) => user.socket !== socket);
    });
  });
});
