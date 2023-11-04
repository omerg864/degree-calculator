import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Header from './components/Header.jsx';
import {ToastContainer} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Cookies from 'universal-cookie';
import {useState} from 'react';
import 'react-circular-progressbar/dist/styles.css';

function App() {
  const cookies = new Cookies();

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (cookies.get('userToken') && !isAuthenticated) {
    setIsAuthenticated(true);
  }
  return (
    <>
    <ToastContainer theme="colored"/>
    <Router>
    <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>
      <Routes>
        <Route path="/" element={<Home isAuthenticated={isAuthenticated}/>} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} isAuthenticated={isAuthenticated}/>} />
        <Route path="/register" element={<Register/>} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
