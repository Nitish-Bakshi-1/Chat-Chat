import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { usernameAtom } from "../states/atoms";
import { roomAtom } from "../states/atoms";

const Room = () => {
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>(
    []
  );
  const username = useRecoilValue<string>(usernameAtom);
  const room = useRecoilValue<string>(roomAtom);
  const inputRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<WebSocket>();
  useEffect(() => {
    const ws = new WebSocket("https://chat-chat-0ckn.onrender.com");

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            username,
            room: room,
          },
        })
      );
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data.toString());
      setMessages((prevMessages) => [...prevMessages, msg]);
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, [username]);

  const handleSendMessage = () => {
    const message = inputRef.current?.value.trim();
    if (message && wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "chat",
          payload: {
            message, // Changed to match server expectation
            username, // Include username in payload
          },
        })
      );

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <div className="w-full h-screen flex flex-col lg:flex-row justify-around items-center">
      <div className="rightPortion bg-[#ecf0f1] h-screen w-[30%] flex justify-center items-center flex-col gap-5">
        <h1 className="text-4xl uppercase font-bold">room:{room}</h1>
      </div>
      <div className="leftPortion flex flex-col items-center justify-center  w-[70%] h-[90vh]">
        <div className="w-full h-[80vh] flex overflow-hidden justify-center items-center">
          <div className="w-[95%] h-[95%] overflow-hidden bg-[#2f3640] p-4 lg:p-20 rounded-lg overflow-y-auto">
            {messages.map((message, index) => (
              <div
                className={`min-h-[4vh] m-2 w-full flex ${
                  message.sender === username ? "justify-end" : "justify-start"
                }`}
                key={index}
              >
                <span className="bg-white text-[#2f3640] px-2 py-1 rounded text-center">
                  <p className="bg-[#2f3640] rounded text-white  px-2">
                    {message.sender}
                  </p>
                  <p className="py-2 ">{message.text}</p>
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full h-[20vh] flex flex-col justify-center items-center">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type your message here ..."
            className="w-[95%] h-[55%] rounded-lg bg-[#2f3640] text-white px-10 text-xl"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
          <button
            onClick={handleSendMessage}
            className="mt-2 px-10 py-4 focus:bg-[#2f3640] focus:text-white border-2 border-[#2f3640]"
          >
            SEND
          </button>
        </div>
      </div>
    </div>
  );
};

export default Room;
