import { Route, Routes, BrowserRouter as Router } from "react-router-dom";

// Components
import Songs from "./components/Songs";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Songs />} />
          <Route path="/songs" element={<Songs />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
