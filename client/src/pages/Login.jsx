import { useState} from 'react';
import {TextField, Box, Button, Paper } from '@mui/material';
import PasswordInput from '../components/PasswordInput';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Cookies from 'universal-cookie';
import Spinner from '../components/Spinner.jsx';
import { addDays } from '../utils/generalFunctions.js';

function Login({ setIsAuthenticated, isAuthenticated}) {

  const [userData, setUserData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const cookies = new Cookies();


    const handleChange = (e) => {
      setUserData({...userData, [e.target.name]: e.target.value});
    }

    if(isAuthenticated) {
      navigate('/');
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
          const response = await fetch(`/api/user/login`, { headers: {"Content-type": "application/json"} ,method: 'POST', body: JSON.stringify(userData)})
        const data = await response.json();
        if (!data.success) {          
            toast.error(data.message);
        } else {
            let date30 = addDays(new Date(), 30);
            cookies.set('userToken', data.user.token, { path: '/', expires: date30 });
            cookies.set('user', JSON.stringify(data.user), { path: '/', expires: date30 });
            setIsAuthenticated(true);
            navigate('/');
        }
        } catch(err) {
          toast.error('Internal Server Error')
        }
        setIsLoading(false);
    }

    if (isLoading) {
        return <Spinner />;
    }

  return (
    <main>
    <h1>Login</h1>
      <Box className='box-container' sx={{width: "60%"}} component={Paper}>
          <form className='box-container' style={{textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '15px'}} onSubmit={handleSubmit} >
              <TextField fullWidth id="email" label="email" name='email' type="email" required variant="outlined" onChange={handleChange} />
              <PasswordInput name="password" label="password" id="password" onChange={handleChange} />
            {/*<Link to="/password/reset/email">forgot password?</Link>*/}
            <Link to="/register">don't have an account?</Link>
            <div>
            <Button id='btn-primary' variant="contained" color="primary" type="submit" >login</Button>
            </div>
          </form>
      </Box>
  </main>
  )
}

export default Login