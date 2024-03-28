import { Box, Button, IconButton, Paper, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import i18next from 'i18next';


function Profile({ isAuthenticated}) {

  const [user, setUser] = useState({
    name: "",
    email: "",
    school: "",
    degree: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const cookies = new Cookies();
  const { t } = useTranslation('translation', { keyPrefix: 'Profile' });
  const navigate = useNavigate();


  const getUser = async () => {
    setIsLoading(true);
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/`, { headers: {
            "Content-type": "application/json"
        } ,method: 'GET'})
        const data = await response.json();
        if (!data.success) {
            toast.error(data.message);
        } else {
            setUser(data.user);
        }
        setIsLoading(false);
    } catch (err) {
        toast.error('Internal Server Error')
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/`, { headers: {
            "Content-type": "application/json"
        } ,method: 'PUT', body: JSON.stringify(user)})
        const data = await response.json();
        if (!data.success) {
            toast.error(data.message);
        } else {
            if(data.specialMessage) {
              toast.info(data.specialMessage);
            }
            cookies.set('user', data.user);
            toast.success(t('userUpdated'));
        }
        setIsLoading(false);
    } catch (err) {
        toast.error('Internal Server Error')
    }
  }

  const handleChange = (e) => {
    setUser({...user, [e.target.name]: e.target.value});
  }

  const gotoPasswordChange = () => {
    navigate('/password/change');
  }

  const gotoHome = () => {
    navigate('/');
  }

  if(!isAuthenticated) {
    navigate('/login');
  }

  useEffect(() => {
    getUser();
  }, [])

  if(isLoading) {
    return <Spinner />;
  }

  return (
    <main>
      <div className='space' style={{width: "100%", alignItems: "center"}}>
        <IconButton sx={{height: "fit-content"}} onClick={gotoHome}>
          {i18next.dir(i18next.language) === 'ltr' ? <ArrowBackIcon/> :<ArrowForwardIcon />}
        </IconButton>
        <h1>{t("profile")}</h1>
        <Box sx={{width: "1.5rem"}}></Box>
      </div>
        <Box className='box-container' component={Paper} >
            <form style={{textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '15px'}} onSubmit={handleSubmit}>
              <TextField fullWidth id="name" value={user.name} label={t('name')} name='name' required variant="outlined" onChange={handleChange} />
              <TextField fullWidth id="email" value={user.email} label={t('email')} name='email' type="email" required variant="outlined" onChange={handleChange} />
              <TextField fullWidth id="degree" value={user.degree} label={t('degree')} name='degree' required variant="outlined" onChange={handleChange} />
              <TextField fullWidth id="school" value={user.school} label={t('school')} name='school' required variant="outlined" onChange={handleChange} />
              <div className='space'>
                <Button variant="contained" color="primary" onClick={gotoPasswordChange} >{t("changePassword")}</Button>
                <Button id='btn-primary' variant="contained" color="primary" type="submit" >{t("save")}</Button>
              </div>
            </form>
        </Box>
    </main>
  )
}

export default Profile