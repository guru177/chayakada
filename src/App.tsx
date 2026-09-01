import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AudioProvider } from "./context";
import { Home } from "./pages/Home";
import { Pomodoro } from "./pages/Pomodoro";

export default function App() {
  return (
    <AudioProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pomodoro" element={<Pomodoro />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AudioProvider>
  );
}
