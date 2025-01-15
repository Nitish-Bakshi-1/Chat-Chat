// console.log("waheguru");

import { WebSocket, WebSocketServer } from "ws";

interface User {
  socket: WebSocket;
  room: string;
}

let allSockets: User[] = [];

const ws = new WebSocketServer({ port: 8080 });

ws.on("connection", (socket) => {
  // here message comes from socket and after we run a callback in which we got the actual message in buffer form as an argument
  socket.on("message", (message) => {
    // we got message from frontend in string form so we parse it to json in case we got something else from frontend we change it to string first
    const parsedMessage = JSON.parse(message.toString());
    // if the message we got has the type join then we push that socket to allSockets array (which is of user type) along with the room
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
        room: parsedMessage.payload.room,
      });
    }
    // if message's type is "chat" then we have to find the current room of the user(socket)
    if (parsedMessage.type === "chat") {
      let currentUserRoom = null;
      // iterating over allSockets and confirming whether socket exists in allSockets or not
      for (let i = 0; i < allSockets.length; i++) {
        if (allSockets[i].socket === socket) {
          // if socket exists then we got the user's room assigning its value to currentUserRoom
          currentUserRoom = allSockets[i].room;
        }
      }
      // after getting the current room iterar=ting over allSockets and every socket which has same room will receieve the message
      allSockets.map((s) => {
        if (s.room === currentUserRoom) {
          s.socket.send(parsedMessage.payload.message);
        }
      });
    }
  });
});
