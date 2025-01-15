// console.log("waheguru");

import { WebSocket, WebSocketServer } from "ws";

interface User {
  socket: WebSocket;
  room: string;
  username: string;
}
interface Message {
  text: string;
  sender: string;
}

let allSockets: User[] = [];

const ws = new WebSocketServer({ port: 8080 });

ws.on("connection", (socket) => {
  socket.on("message", (message: Message) => {
    const parsedMessage = JSON.parse(message.toString());
    const { username, room } = parsedMessage.payload;
    if (parsedMessage.type === "join") {
      {
        /*so here the message has to be of format    
        message ={
          type:"join",
            payload:{
            room :"red"
          }}*/
      }
      allSockets.push({
        socket,
        room,
        username,
      });
    }
    if (parsedMessage.type === "chat") {
      let currentUserRoom = null;
      let currentUser = null;
      for (let i = 0; i < allSockets.length; i++) {
        if (allSockets[i].socket === socket) {
          currentUserRoom = allSockets[i].room;
          currentUser = allSockets[i];
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
});
