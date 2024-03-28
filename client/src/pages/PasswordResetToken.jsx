import { Box, Button, Paper } from '@mui/material';
import PasswordInput from '../components/PasswordInput';
import PasswordRules from '../components/PasswordRules';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { password_regex } from '../utils/consts';
import Spinner from '../components/Spinner';
import { useNavigate, useParams } from 'react-router-dom';



function PasswordResetToken() {
    const [formData, setFormData] = useState({ password: '', confirmPassword: "" });
    const { t } = useTranslation('translation', { keyPrefix: 'PasswordResetToken' });
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    let { token } = useParams();

    const handleSubmit = async (e) => {
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
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/reset-password/${token}`, { headers: {
                "Content-type": "application/json",
            } ,method: 'PUT', body: JSON.stringify({password: formData.password})})
            const data = await response.json();
            if (!data.success) {
                toast.error(data.message);
            } else {
                toast.success(t('passwordChanged'));
                navigate('/login');
            }
        } catch (err) {
            toast.error('Internal Server Error')
        }
        setIsLoading(false);
    }

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    if(isLoading) {
        return <Spinner />
    }

  return (
    <main>
      <h1>{t("reset")}</h1>
        <Box className='box-container' component={Paper} >
            <form className='box-container' style={{textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '15px'}} onSubmit={handleSubmit}>
              <PasswordInput id="password"  value={formData.password} label={t('newPassword')} name="password" onChange={handleChange}/>
              <PasswordRules />
              <PasswordInput id="confirmPassword"  value={formData.confirmPassword} label={t('confirmPassword')} name="confirmPassword" onChange={handleChange}/>
              <div className='center'>
                <Button id='btn-primary' variant="contained" color="primary" type="submit" >{t("reset")}</Button>
              </div>
            </form>
        </Box>
    </main>
  )
}

export default PasswordResetToken