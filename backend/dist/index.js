"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
let allSockets = [];
const ws = new ws_1.WebSocketServer({ port: 8080 });
ws.on("connection", (socket) => {
    socket.on("message", (message) => {
        try {
            const parsedMessage = JSON.parse(message);
            const { type, payload } = parsedMessage;
            if (type === "join") {
                const { username, room } = payload;
                if (username && room) {
                    allSockets.push({ socket, room, username });
                    console.log("user connected " + username);
                }
            }
            if (type === "chat") {
                const { message: chatMessage, username } = payload; // destructured message from payload and assigned its value to chatMessage variable
                if (!chatMessage) {
                    return;
                }
                // here we have checked the person who joined and the person who is sending message is same or not and if they are then set its socket to currentUser variable
                const currentUser = allSockets.find((user) => user.socket === socket);
                if (!currentUser) {
                    return;
                }
                // Broadcasting message to all users in the same room
                allSockets.forEach((user) => {
                    if (user.room === currentUser.room) {
                        user.socket.send(JSON.stringify({
                            text: chatMessage,
                            sender: currentUser.username,
                        }));
                    }
                });
            }
        }
        catch (error) {
            console.error("Error processing message:", error);
        }
    });
    socket.on("close", () => {
        console.log("User disconnected");
        allSockets = allSockets.filter((user) => user.socket !== socket);
    });
});
