import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import { useTranslation } from "react-i18next";
import i18n from 'i18next';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SchoolIcon from '@mui/icons-material/School';

function Header({isAuthenticated, setIsAuthenticated, setDegreeAvg, degreeAvg}) {
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const cookies = new Cookies();
  const navigate = useNavigate();

  const { t }= useTranslation('translation', { keyPrefix: 'Header' });


  const authenticationAction = () => {
    handleCloseUserMenu();
    if(isAuthenticated) {
        // logout
        setIsAuthenticated(false);
        cookies.remove('userToken');
        cookies.remove('user');
        setDegreeAvg(0);
    }
    navigate('/login');
  }

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const gotoProfile = () => {
    handleCloseUserMenu();
    navigate('/profile');
  }

  const changeLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'he' : 'en');
  }

  const settings = [{name: t("profile"), func: gotoProfile},  {name: `${t("switchLan")} ${i18n.language === 'en' ? 'Hebrew' : 'לאנגלית'}`, func: changeLanguage}, {name: t("logout"), func:authenticationAction}];



  return (
    <AppBar position="static">
      <Container maxWidth="xl" sx={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
          <Box>
          <SchoolIcon sx={{ display: 'flex', mr: 1 }} />
          </Box>
          <Box>
          <Typography
            variant="h6"
            noWrap
            component="a"
            id="site-title"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {degreeAvg ? <React.Fragment>{t("degreeAvg")}: {degreeAvg}</React.Fragment> : <React.Fragment>{t("title")}</React.Fragment>}
          </Typography>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {degreeAvg ? <React.Fragment>{t("degreeAvg")}: {degreeAvg}</React.Fragment> : <React.Fragment>{t("title")}</React.Fragment>}
          </Typography>
          </Box>

          {isAuthenticated ? <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu}>
                <AccountCircleIcon fontSize="large" sx={{color: "white"}} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting.name} onClick={setting.func}>
                  <Typography textAlign="center">{setting.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box> : <Box sx={{flexGrow: 1}}></Box>}
      </Container>
    </AppBar>
  );
}
export default Header;