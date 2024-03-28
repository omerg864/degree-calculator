import { Box, Button, Paper } from '@mui/material';
import PasswordInput from '../components/PasswordInput';
import PasswordRules from '../components/PasswordRules';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { password_regex } from '../utils/consts';
import Spinner from '../components/Spinner';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

function PasswordChange({ isAuthenticated}) {

  const [formData, setFormData] = useState({ password: '', confirmPassword: "" });
  const { t } = useTranslation('translation', { keyPrefix: 'PasswordChange' });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const cookie = new Cookies();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password_regex.test(formData.password)) {
      toast.error(t('passwordInvalid'));
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error(t('passwordsNotMatch'));
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/password`, { headers: {
        authorization: `Bearer ${cookie.getItem('userToken')}`,
        "Content-type": "application/json"
      } ,method: 'PUT', body: JSON.stringify({password: formData.password})})
      const data = await response.json();
      if (!data.success) {
          toast.error(data.message);
      } else {
          toast.success(t('passwordChanged'));
          navigate('/profile');
      }
    } catch (err) {
      toast.error('Internal Server Error')
    }
    setIsLoading(false);
  }

  const gotoProfile = () => {
    navigate('/profile');
  }

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  }

  if(!isAuthenticated) {
    navigate('/login');
  }

  if(isLoading){
    return <Spinner />;
  }


  return (
    <main>
      <h1>{t("passwordChange")}</h1>
        <Box className='box-container' component={Paper} >
            <form className='box-container' style={{textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '15px'}} onSubmit={handleSubmit}>
              <PasswordInput id="password"  value={formData.password} label={t('newPassword')} name="password" onChange={handleChange}/>
              <PasswordRules />
              <PasswordInput id="confirmPassword"  value={formData.confirmPassword} label={t('confirmPassword')} name="confirmPassword" onChange={handleChange}/>
              <div className='space'>
              <Button variant="outlined" color="error" onClick={gotoProfile} >{t("cancel")}</Button>
                <Button id='btn-primary' variant="contained" color="primary" type="submit" >{t("save")}</Button>
              </div>
            </form>
        </Box>
    </main>
  )
}

export default PasswordChange