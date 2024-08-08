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
import { GoogleOAuthProvider } from '@react-oauth/google';
import CompleteRegistration from './pages/CompleteRegistration.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

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
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <Router>
        <Header direction="rtl" isAuthenticated={isAuthenticated} setDegreeAvg={setDegreeAvg} degreeAvg={degreeAvg} setIsAuthenticated={setIsAuthenticated}/>
        <Routes>
          <Route path="/" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Home setDegreeAvg={setDegreeAvg} degreeAvg={degreeAvg}/></ProtectedRoute>} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} isAuthenticated={isAuthenticated}/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/register/complete/:id" element={<CompleteRegistration setIsAuthenticated={setIsAuthenticated}/>} />
          <Route path="/verify/:id" element={<Verify/>} />
          <Route path="/profile" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Profile setDegreeAvg={setDegreeAvg} /></ProtectedRoute>} />
          <Route path="/password/change" element={<ProtectedRoute isAuthenticated={isAuthenticated}><PasswordChange /></ProtectedRoute>} />
          <Route path="/password/reset/email" element={<PasswordResetEmail/>} />
          <Route path="/password/reset/:token" element={<PasswordResetToken/>} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
    </>
  );
}

export default App;
