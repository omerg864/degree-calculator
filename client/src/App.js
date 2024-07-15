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
import Verify from './pages/Verify.jsx';
import Profile from './pages/Profile.jsx'
import PasswordChange from './pages/PasswordChange';
import PasswordResetEmail from './pages/PasswordResetEmail.jsx';
import PasswordResetToken from './pages/PasswordResetToken.jsx';

function App() {
  const cookies = new Cookies();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [degreeAvg, setDegreeAvg] = useState(0);

  if (cookies.get('userToken') && !isAuthenticated) {
    setIsAuthenticated(true);
  }


  return (
    <>
    <ToastContainer theme="colored"/>
    <Router>
    <Header direction="rtl" isAuthenticated={isAuthenticated} setDegreeAvg={setDegreeAvg} degreeAvg={degreeAvg} setIsAuthenticated={setIsAuthenticated}/>
      <Routes>
        <Route path="/" element={<Home isAuthenticated={isAuthenticated} setDegreeAvg={setDegreeAvg} degreeAvg={degreeAvg}/>} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} isAuthenticated={isAuthenticated}/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/verify/:id" element={<Verify/>} />
        <Route path="/profile" element={<Profile isAuthenticated={isAuthenticated}/>} />
        <Route path="/password/change" element={<PasswordChange isAuthenticated={isAuthenticated}/>} />
        <Route path="/password/reset/email" element={<PasswordResetEmail/>} />
        <Route path="/password/reset/:token" element={<PasswordResetToken/>} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
