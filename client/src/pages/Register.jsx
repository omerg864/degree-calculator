import React from 'react';
import { TextField, Box, Button, Paper } from '@mui/material';
import PasswordInput from '../components/PasswordInput';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { email_regex, password_regex} from '../utils/consts.js';
import Spinner from '../components/Spinner';
import PasswordRules from '../components/PasswordRules';
import { useTranslation } from 'react-i18next';

function Register({ isAuthenticated}) {
    const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: "", name: "", degree: "", school: "" });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const { t } = useTranslation('translation', { keyPrefix: 'Register' });


    const handleSubmit = async (e) => {
      e.preventDefault();
      if (formData.password !== formData.confirmPassword) {
          toast.error(t('passwordsNotMatch'));
          return;
      }
      if (!password_regex.test(formData.password)) {
          toast.error(t('passwordInvalid'));
          return;
      }
      if (!email_regex.test(formData.email)) {
          toast.error(t('emailInvalid'));
          return;
      }
      setIsLoading(true);
      try {
          const response = await fetch(`/api/user/register`, { headers: {"Content-type": "application/json"} ,method: 'POST', body: JSON.stringify(formData)})
          const data = await response.json();
          if (!data.success) {
              toast.error(data.message);
          } else {
              toast.success(t('registerSuccess'));
              if(data.specialMessage) {
                toast.info(data.specialMessage);
              }
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
        <h1>{t("register")}</h1>
        <Link to="/login">{t('already')}</Link>
        <Box className='box-container' component={Paper} sx={{width: "60%"}}>
            <form className='box-container' style={{textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '15px'}} onSubmit={handleSubmit}>
            <TextField fullWidth id="name" value={formData.name} label={t('name')} name='name' required variant="outlined" onChange={handleChange} />
            <TextField fullWidth id="email"  value={formData.email} label={t('email')} name='email' type="email" required variant="outlined" onChange={handleChange} />
            <TextField fullWidth id="degree"  value={formData.degree} label={t('degree')} name='degree' required variant="outlined" onChange={handleChange} />
            <TextField fullWidth id="school"  value={formData.school} label={t('school')} name='school' required variant="outlined" onChange={handleChange} />
            <PasswordInput id="password"  value={formData.password} label={t('password')} name="password" onChange={handleChange}/>
            <PasswordRules />
            <PasswordInput id="confirmPassword"  value={formData.confirmPassword} label={t('confirmPassword')} name="confirmPassword" onChange={handleChange}/>
            <Button id='btn-primary' variant="contained" color="primary" type="submit" >{t('register')}</Button>
            </form>
        </Box>
    </main>
  )
}

export default Register