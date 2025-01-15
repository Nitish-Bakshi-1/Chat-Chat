import { useEffect, useRef, useState } from "react";

const Room = () => {
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>(
    []
  );
  const [username, setUsername] = useState<string>("ab"); // Added username state
  const inputRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<WebSocket>();

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data.toString());
      setMessages((messages) => [...messages, msg]);
    };

    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            // TODO: room logic
            room: "red",
            username,
          },
        })
      );
    };
  }, []);

  return (
    <div className="w-full h-screen flex flex-col lg:flex-row  justify-around items-center">
      <div className="rightPortion  bg-[#ecf0f1] h-screen w-[30%] flex justify-center items-center flex-col gap-5">
        <h1 className="text-4xl uppercase font-bold">room id:123</h1>
        <div className="">
          <h1 className=" text-2xl uppercase font-semibold mb-4 ">members</h1>
          <p>1. Ram</p>
          <p>2. Sham</p>
          <p>3. Balram</p>
        </div>
      </div>
      <div className=" leftPortion flex flex-col items-center justify-center pt-4   w-[70%] h-[90vh]">
        <div className="w-full h-[80vh]  flex justify-center items-center">
          <div className="w-[95%] h-[95%] bg-[#2f3640] p-20 rounded-lg">
            {messages.map((message, index) => (
              <div
                className={`min-h-[5vh] flex ${
                  message.sender === username ? "justify-end" : "justify-start"
                }`}
                key={index}
              >
                <span className="bg-white text-[#2f3640] px-2 py-1 rounded">
                  {message.text}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full h-[20vh] flex flex-col justify-center items-center ">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type your message here ..."
            className="w-[95%] h-[55%] rounded-lg bg-[#2f3640] text-white px-10 text-xl"
          />

          <button
            onClick={() => {
              const message = inputRef.current?.value;
              if (message) {
                const messageData = { text: message, sender: username };
                wsRef.current?.send(
                  JSON.stringify({
                    type: "chat",
                    payload: messageData,
                  })
                );
                setMessages((prevMessages) => [...prevMessages, messageData]);
              }

              if (inputRef.current?.value) {
                inputRef.current.value = "";
              }
            }}
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
