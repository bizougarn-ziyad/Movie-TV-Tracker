import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./components/Login";
import SearchResults from "./pages/SearchResults";
import SignUp from "./components/SignUp";


export default function App() {
  return (
    <Router>
     
      <Navbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/signup" element={<SignUp />} />

      </Routes>
      
    </Router>
  );
}
