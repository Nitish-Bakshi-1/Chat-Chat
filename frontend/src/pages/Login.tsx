import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen flex justify-center items-center flex-col">
      <h1 className="font-bold text-2xl">LOGIN</h1>
      <button
        onClick={() => {
          navigate("/room");
        }}
        className="p-4 focus:bg-black m-4 focus:text-white border-2 border-black"
      >
        ENTER ROOM
      </button>
    </div>
  );
};

export default Login;
