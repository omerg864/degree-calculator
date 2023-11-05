import React from 'react';
import { FormControl, TextField, FormHelperText, Box, Button, Paper } from '@mui/material';
import PasswordInput from '../components/PasswordInput';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { email_regex, password_regex} from '../utils/consts.js';
import Spinner from '../components/Spinner';
import PasswordRules from '../components/PasswordRules';

function Register({ isAuthenticated}) {
    const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: "", name: "", degree: "", school: "" });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
      e.preventDefault();
      if (formData.password !== formData.confirmPassword) {
          toast.error('סיסמאות לא תואמות');
          return;
      }
      if (!password_regex.test(formData.password)) {
          toast.error('סיסמה לא תקינה');
          return;
      }
      if (!email_regex.test(formData.email)) {
          toast.error('אימייל לא תקין');
          return;
      }
      setIsLoading(true);
      try {
          const response = await fetch(`/api/user/register`, { headers: {"Content-type": "application/json"} ,method: 'POST', body: JSON.stringify(formData)})
          const data = await response.json();
          if (!data.success) {
              toast.error(data.message);
          } else {
              navigate('/login');
          }
          setIsLoading(false);
      } catch (err) {
          toast.error('Internal Server Error')
      }
  }



    const handleChange = (e) => {
      setFormData({...formData, [e.target.name]: e.target.value});
    }

    if(isAuthenticated) {
      navigate('/');
    }

    if(isLoading) {
      return <Spinner/>;
    }

  return (
    <main>
        <h1>Register</h1>
        <Box className='box-container' component={Paper} sx={{width: "60%"}}>
            <form className='box-container' style={{textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '15px'}} onSubmit={handleSubmit}>
            <TextField fullWidth id="name" label="Name" name='name' required variant="outlined" onChange={handleChange} />
            <TextField fullWidth id="email" label="Email" name='email' type="email" required variant="outlined" onChange={handleChange} />
            <TextField fullWidth id="degree" label="Degree" name='degree' required variant="outlined" onChange={handleChange} />
            <TextField fullWidth id="school" label="School" name='school' required variant="outlined" onChange={handleChange} />
            <PasswordInput id="password" label="Password" name="password" onChange={handleChange}/>
            <PasswordRules />
            <PasswordInput id="confirmPassword" label="Confirm Password" name="confirmPassword" onChange={handleChange}/>
            <Button id='btn-primary' variant="contained" color="primary" type="submit" >Register</Button>
            </form>
        </Box>
    </main>
  )
}

export default Register