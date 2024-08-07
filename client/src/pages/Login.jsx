import { useState} from 'react';
import {TextField, Box, Button, Paper } from '@mui/material';
import PasswordInput from '../components/PasswordInput';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Cookies from 'universal-cookie';
import Spinner from '../components/Spinner.jsx';
import { addDays } from '../utils/generalFunctions.js';
import { useTranslation } from 'react-i18next';
import GoogleLogin from '../components/GoogleLogin.jsx';

function Login({ setIsAuthenticated, isAuthenticated}) {

  const [userData, setUserData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const cookies = new Cookies();

    const { t } = useTranslation('translation', { keyPrefix: 'Login' });


    const handleChange = (e) => {
      setUserData({...userData, [e.target.name]: e.target.value});
    }

    if(isAuthenticated) {
      navigate('/');
    }

    const responseGoogle = async (authResult) => {
      console.log(authResult);
      if (authResult["code"]) {
        setIsLoading(true);
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/google`, { headers: {"Content-type": "application/json"} ,method: 'POST', body: JSON.stringify({
            code: authResult.code
          })})
        const data = await response.json();
        if (!data.success) {          
            toast.error(data.message);
        } else {
            if (data.completeRegistration) {
              navigate(`/register/complete/${data.id}`);
            } else {
              let date30 = addDays(new Date(), 30);
              cookies.set('userToken', data.user.token, { path: '/', secure: true, expires: date30 });
              cookies.set('user', JSON.stringify(data.user), { path: '/', secure: true, expires: date30 });
              setIsAuthenticated(true);
              navigate('/');
          }
        }
        } catch(err) {
          toast.error('Internal Server Error');
          console.log(err);
        }
      }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/login`, { headers: {"Content-type": "application/json"} ,method: 'POST', body: JSON.stringify(userData)})
        const data = await response.json();
        if (!data.success) {          
            toast.error(data.message);
        } else {
            if(data.specialMessage) {
              toast.info(data.specialMessage);
            }
            if (data.completeRegistration) {
              navigate(`/register/complete/${data.id}`);
            } else {
              let date30 = addDays(new Date(), 30);
              cookies.set('userToken', data.user.token, { path: '/', secure: true, expires: date30 });
              cookies.set('user', JSON.stringify(data.user), { path: '/', secure: true, expires: date30 });
              setIsAuthenticated(true);
              navigate('/');
            }
        }
        } catch(err) {
          toast.error('Internal Server Error');
          console.log(err);
        }
        setIsLoading(false);
    }

    if (isLoading) {
        return <Spinner />;
    }

  return (
    <main>
    <h1>{t('login')}</h1>
      <Box className='box-container' sx={{xs: {width: "100%"}, md: {width: "60%"}}} component={Paper}>
          <form style={{textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '15px'}} onSubmit={handleSubmit} >
              <TextField fullWidth id="email" value={userData.email} label={t('email')} name='email' type="email" required variant="outlined" onChange={handleChange} />
              <PasswordInput name="password" value={userData.password} label={t('password')} id="password" onChange={handleChange} />
              <GoogleLogin authResponse={responseGoogle} />
            <Link to="/password/reset/email">{t('forgot')}</Link>
            <Link to="/register">{t('noAccount')}</Link>
            <div>
            <Button aria-label="login" id='btn-primary' variant="contained" color="primary" type="submit" >{t('login')}</Button>
            </div>
          </form>
      </Box>
  </main>
  )
}

export default Login