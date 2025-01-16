import { useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { roomAtom, usernameAtom } from "../states/atoms";
import { useRef } from "react";
const Login = () => {
  const navigate = useNavigate();
  const setUsername = useSetRecoilState(usernameAtom);
  const setRoom = useSetRecoilState(roomAtom);
  const usernameInputRef = useRef<HTMLInputElement | null>(null);
  const roomInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="flex justify-center items-center flex-col  w-[40%] h-[60vh] gap-5">
        <h1 className="font-bold text-2xl">Enter Room</h1>
        <input
          className="px-8 py-4 border-2 border-black"
          ref={usernameInputRef}
          placeholder="username"
        />
        <input
          className="px-8 py-4 border-2 border-black"
          ref={roomInputRef}
          placeholder="username"
        />

        <button
          onClick={() => {
            const username = usernameInputRef.current?.value;
            const room = roomInputRef.current?.value;
            if (username && room) {
              setUsername(username);
              setRoom(room);
              navigate("/room");
            }
          }}
          className="p-4 focus:bg-black m-4 focus:text-white border-2 border-black"
        >
          ENTER ROOM
        </button>
      </div>
    </div>
  );
};

export default Login;
