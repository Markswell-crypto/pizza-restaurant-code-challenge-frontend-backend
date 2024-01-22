// App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Restaurant from './components/Restaurant';

function App() {
  return (
    <div className="container mt-4">
    <Router>
      <Navbar />
      <Routes>
        <Route path="/restaurants/:id" element={<Restaurant />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;