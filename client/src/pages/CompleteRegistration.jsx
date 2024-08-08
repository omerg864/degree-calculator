import { Box, Button, Paper, TextField } from '@mui/material';
import React from 'react'
import { useTranslation } from 'react-i18next';
import Spinner from '../components/Spinner';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Cookies from 'universal-cookie';
import { addDays } from '../utils/generalFunctions';

function CompleteRegistration({ setIsAuthenticated }) {

    const { t } = useTranslation('translation', { keyPrefix: 'CompleteRegistration' });
    const [isLoading, setIsLoading] = React.useState(false);
    const [formData, setFormData] = React.useState({degree: '', school: ''});
    const navigate = useNavigate();
    const cookies = new Cookies();
    const { id } = useParams();

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }
    const handleSubmit = async (e) => {
        if (!formData.degree || !formData.school) {
            toast.error('Please fill all the fields');
            return;
        }
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/complete-registration/${id}`, { headers: {"Content-type": "application/json"} ,method: 'POST', body: JSON.stringify(formData)})
            const data = await response.json();
            if (!data.success) {          
                toast.error(data.message);
            } else {
                let date30 = addDays(new Date(), 30);
                cookies.set('userToken', data.user.token, { path: '/', secure: true, expires: date30 });
                cookies.set('user', JSON.stringify(data.user), { path: '/', secure: true, expires: date30 });
                setIsAuthenticated(true);
                navigate('/');
            }
        } catch(err) {
            toast.error('Internal Server Error');
            console.log(err);
        }
        setIsLoading(false);
    }

    if (isLoading) {
        return <Spinner />
    }

  return (
    <main>
        <h1>{t('completeRegistration')}</h1>
        <Box className='box-container' component={Paper} sx={{xs: {width: "100%"}, md: {width: "60%"}}}>
            <form style={{textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '15px'}} onSubmit={handleSubmit}>
                <TextField fullWidth id="degree"  value={formData.degree} label={t('degree')} name='degree' required variant="outlined" onChange={handleChange} />
                <TextField fullWidth id="school"  value={formData.school} label={t('school')} name='school' required variant="outlined" onChange={handleChange} />
                <Button aria-label="register" id='btn-primary' variant="contained" color="primary" type="submit" >{t('completeAndLogin')}</Button>
            </form>
        </Box>
    </main>
  )
}

export default CompleteRegistration