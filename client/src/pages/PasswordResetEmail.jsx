import {useState} from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { email_regex } from '../utils/consts';
import Spinner from '../components/Spinner';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Paper, TextField } from '@mui/material';

function PasswordResetEmail() {

    const [formData, setFormData] = useState({ email: '', });
    const { t } = useTranslation('translation', { keyPrefix: 'PasswordResetEmail' });
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);


    const handleSubmit = async (e) => {
        if (!email_regex.test(formData.email)) {
            toast.error(t('emailInvalid'));
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/reset-password`, { headers: {
                "Content-type": "application/json",
            } ,method: 'POST', body: JSON.stringify(formData)})
            const data = await response.json();
            if (!data.success) {
                toast.error(data.message || t('resetFail'));
            } else {
                toast.success(t('resetSuccess'));
                navigate('/');
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
      <Box className='box-container' component={Paper}>
            <form className='box-container' style={{textAlign: 'center', width: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: '15px'}} onSubmit={handleSubmit}>
                <TextField fullWidth id="email" value={formData.email} label={t('email')} name='email' type="email" required variant="outlined" onChange={handleChange} />
                <div className='center'>
                    <Button id='btn-primary' variant="contained" color="primary" type="submit" >{t("reset")}</Button>
                </div>
          </form>
      </Box>
  </main>
  )
}

export default PasswordResetEmail