import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import i18next from 'i18next';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useLocation } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import LockIcon from '@mui/icons-material/Lock';
import PersonalDetails from '../components/PersonalDetails';
import Degree from '../components/Degree';
import DegreeChange from '../components/DegreeChange';



function Profile({ isAuthenticated, setDegreeAvg }) {

  const { hash } = useLocation();
  const [tab, setTab] = useState(hash ? hash.replace('#', '') : 0);
  const [open, setOpen] = useState(false);

  const [user, setUser] = useState({
    name: "",
    email: "",
    degree: {_id: "", name: "", school: ""}
  });
  const [degrees, setDegrees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [degree, setDegree] = useState({name: "", school: "", _id: ""});

  const cookies = new Cookies();
  const { t } = useTranslation('translation', { keyPrefix: 'Profile' });
  const navigate = useNavigate();


  const getUser = async () => {
    setIsLoading(true);
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/`, { headers: {
            authorization: `Bearer ${cookies.get('userToken')}`,
            "Content-type": "application/json"
        } ,method: 'GET'})
        const data = await response.json();
        if (!data.success) {
            toast.error(data.message);
        } else {
            setUser(data.user);
            setDegrees(data.degrees);
        }
        setIsLoading(false);
    } catch (err) {
        toast.error('Internal Server Error');
        console.log(err);
    }
  }

  const handleUserSubmit = async () => {
    setIsLoading(true);
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/`, { headers: {
            authorization: `Bearer ${cookies.get('userToken')}`,
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
    } catch (err) {
        toast.error('Internal Server Error');
        console.log(err);
    }
    setIsLoading(false);
  }

  const handleDegreeSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/degree`, { headers: {
          authorization: `Bearer ${cookies.get('userToken')}`,
          "Content-type": "application/json"
      } ,method: 'PUT', body: JSON.stringify({id: user.degree._id})})
      const data = await response.json();
      if (!data.success) {
          toast.error(data.message);
      } else {
          if(data.specialMessage) {
            toast.info(data.specialMessage);
          }
          cookies.set('user', data.user);
          toast.success(t('degreeUpdated'));
          setDegreeAvg(0);
      }
  } catch (err) {
      toast.error('Internal Server Error');
      console.log(err);
  }
  setIsLoading(false);
}

const handleDeleteDegreeSubmit = async () => {
  setIsLoading(true);
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/degree/${degree._id}`, { headers: {
        authorization: `Bearer ${cookies.get('userToken')}`,
        "Content-type": "application/json"
    } ,method: 'DELETE'})
    const data = await response.json();
    if (!data.success) {
        toast.error(data.message);
    } else {
        if(data.specialMessage) {
          toast.info(data.specialMessage);
        }
        cookies.set('user', data.user);
        setUser(data.user);
        toast.success(t('degreeDeleted'));
        setDegreeAvg(0);
        setDegrees([...degrees.filter(deg => deg._id !== degree._id)]);
        handleClose();
    }
} catch (err) {
    toast.error('Internal Server Error');
    console.log(err);
}
setIsLoading(false);
}

const newDegreeSubmit = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/degree`, { headers: {
        authorization: `Bearer ${cookies.get('userToken')}`,
        "Content-type": "application/json"
    } ,method: 'POST', body: JSON.stringify(degree)})
    const data = await response.json();
    if (!data.success) {
        toast.error(data.message);
    } else {
        if(data.specialMessage) {
          toast.info(data.specialMessage);
        }
        toast.success(t('degreeUpdated'));
        setDegrees([...degrees, data.degree]);
        setDegree({name: "", school: "", _id: ""});
        backButton();
    }
  } catch (err) {
      toast.error('Internal Server Error');
      console.log(err);
  }
}

const updateDegreeSubmit = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/degree/${degree._id}`, { headers: {
        authorization: `Bearer ${cookies.get('userToken')}`,
        "Content-type": "application/json"
    } ,method: 'PUT', body: JSON.stringify(degree)})
    const data = await response.json();
    if (!data.success) {
        toast.error(data.message);
    } else {
        if(data.specialMessage) {
          toast.info(data.specialMessage);
        }
        toast.success(t('degreeUpdated'));
        setDegrees([...degrees.filter(deg => deg._id !== degree._id), data.degree]);
        setDegree({name: "", school: "", _id: ""});
        backButton();
    }
  } catch (err) {
      toast.error('Internal Server Error');
      console.log(err);
  }
}

const handleChangeDegreeSubmit = async () => {
  setIsLoading(true);
  if (degree.name === "" || degree.school === "") {
    toast.error(t('degreeInvalid'));
    setIsLoading(false);
    return;
  }
  if (degree._id === "") {
    await newDegreeSubmit();
  }
  else {
    await updateDegreeSubmit();
  }
  setIsLoading(false);
  }

  const handleChange = (e) => {
    setUser({...user, [e.target.name]: e.target.value});
  }

  const handleSelectChange = (e) => {
    setUser({...user, degree: {_id: e.target.value}});
  }

  const handleDegreeChange = (e) => {
    setDegree({...degree, [e.target.name]: e.target.value});
  }

  const gotoPasswordChange = () => {
    navigate('/password/change');
  }

  const backButton = () => {
    switch (tab) {
      case 0:
        navigate('/');
        break;
      case 'degreeChange':
        setTab('degree');
        navigate(`#degree`);
        break;
      default:
        setTab(0);
        navigate(`#`);
        break;
    }
  }

  const changeTab = (tab, degree) => {
    setTab(tab);
    if (degree){
      setDegree(degree);
    } else {
      setDegree({name: "", school: "", _id: ""});
    }
    navigate(`#${tab}`);
  }

  const openDeleteDialog = (degree) => {
    setOpen(true);
    setDegree(degree);
  }

  const handleClose = () => {
    setOpen(false);
    setDegree({name: "", school: "", _id: ""});
  }

  if(!isAuthenticated) {
    navigate('/login');
  }

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (hash) {
      setTab(hash.replace('#', ''));
    }
    else{
      setTab(0);
    }
  }, [hash]);


  if(isLoading) {
    return <Spinner />;
  }

  const listItems = [{name: t('personalDetails'), icon: AccountCircleIcon, click: () => changeTab('profile')}, {name: t('degrees')
    , icon: SchoolIcon, click: () => changeTab('degree')}, {name: t('changePassword'), icon: LockIcon, click: gotoPasswordChange}];

  return (
    <main>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t('deleteDegree?')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t('deleting')+ " " + degree.name + ' (' + degree.school + '). '}
            {t('deleteDegreeMessage')}
          </DialogContentText>
          <div className='space' style={{ margin: '10px'}}>
            <Button aria-label="save" id='btn-primary' variant="contained" color="primary" onClick={handleClose}  >{t("cancel")}</Button>
            <Button aria-label="cancel" variant="outlined" color="error" onClick={handleDeleteDegreeSubmit} >{t("delete")}</Button>
            </div>
        </DialogContent>
      </Dialog>
      <div className='space' style={{width: "100%", alignItems: "center"}}>
        <IconButton sx={{height: "fit-content"}} onClick={backButton}>
          {i18next.dir(i18next.language) === 'ltr' ? <ArrowBackIcon/> :<ArrowForwardIcon />}
        </IconButton>
        <h1>{(tab === 'degree' || tab === 'degreeChange') ? t('degrees') : t("profile")}</h1>
        <Box sx={{width: "1.5rem"}}></Box>
      </div>
      {tab === 0 && <Box className='box-container' component={Paper} >
        <List>
          {listItems.map((item, index) => <ListItem disablePadding key={index}>
            <ListItemButton onClick={item.click}>
              <ListItemIcon>
                <item.icon />
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>)}
        </List>
      </Box>}
      {tab === 'profile' && <PersonalDetails user={user} handleChange={handleChange} handleUserSubmit={handleUserSubmit} t={t} />}
      {tab === 'degree' && <Degree dialog={openDeleteDialog} user={user} degrees={degrees} handleDegreeSubmit={handleDegreeSubmit} handleSelectChange={handleSelectChange} changeTab={changeTab} t={t} />}
      {tab === 'degreeChange' && <DegreeChange degree={degree} handleChange={handleDegreeChange} handleChangeSubmit={handleChangeDegreeSubmit} changeTab={changeTab} t={t} />}
    </main>
  )
}

export default Profile