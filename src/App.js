import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Home from './pages/Home';
import Parks from './pages/Parks';



const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/parks" element={<Parks />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
