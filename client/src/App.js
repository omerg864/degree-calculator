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
import Verify from './pages/Verify';

function App() {
  const cookies = new Cookies();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [title, setTitle] = useState();

  if (cookies.get('userToken') && !isAuthenticated) {
    setIsAuthenticated(true);
  }

  return (
    <>
    <ToastContainer theme="colored"/>
    <Router>
    <Header direction="rtl" isAuthenticated={isAuthenticated} title={title} setIsAuthenticated={setIsAuthenticated}/>
      <Routes>
        <Route path="/" element={<Home isAuthenticated={isAuthenticated} setTitle={setTitle}/>} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} isAuthenticated={isAuthenticated}/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/verify/:id" element={<Verify/>} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
