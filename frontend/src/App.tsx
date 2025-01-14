import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Room from "./pages/Room";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/room" element={<Room />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
