const Room = () => {
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
      <div className=" leftPortion flex flex-col items-center pt-4   w-[70%] h-[90vh]">
        <div className="w-full h-[80vh]  flex justify-center items-center">
          <div className="w-[95%] h-[95%] bg-[#2f3640] rounded-lg"></div>
        </div>
        <div className="w-full h-[20vh] flex flex-col justify-center items-center ">
          <input
            type="text"
            placeholder="Type your message here ..."
            className="w-[95%] h-[55%] rounded-lg bg-[#2f3640] text-white px-10 text-xl"
          />
          <button className="my-1 px-10 py-4 focus:bg-[#2f3640] focus:text-white border-2 border-[#2f3640]">
            SEND
          </button>
        </div>
      </div>
    </div>
  );
};

export default Room;