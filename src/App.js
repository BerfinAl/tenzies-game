import { Routes, Route } from "react-router-dom";
import "./App.css";

import Game from "./pages/Game";
import Home from "./pages/Home";

export default function App() {


  return (
    <>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </>
  );
}
