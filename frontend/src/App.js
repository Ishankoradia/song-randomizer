import { Route, Routes, BrowserRouter as Router } from "react-router-dom";

// Components
import Songs from "./components/Songs";
import Songs1 from "./components/Songs1";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Songs />} />
          <Route path="/songs" element={<Songs />} />
          <Route path="/songs1" element={<Songs1 />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
