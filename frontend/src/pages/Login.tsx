import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { usernameAtom } from "../states/atoms";
import { useRef } from "react";
const Login = () => {
  const navigate = useNavigate();
  const setUsername = useSetRecoilState(usernameAtom);
  const usernameInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="w-full h-screen flex justify-center items-center flex-col">
      <h1 className="font-bold text-2xl">LOGIN</h1>
      <input className="" ref={usernameInputRef} placeholder="username" />
      <input placeholder="room" />

      <button
        onClick={() => {
          const username = usernameInputRef.current?.value;
          if (username) {
            setUsername(username);
            navigate("/room");
          } else {
            return <div>enter username</div>;
          }
        }}
        className="p-4 focus:bg-black m-4 focus:text-white border-2 border-black"
      >
        ENTER ROOM
      </button>
    </div>
  );
};

export default Login;
