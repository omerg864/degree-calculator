import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import { useTranslation } from "react-i18next";
import i18n from 'i18next';

function Header({isAuthenticated, setIsAuthenticated}) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const cookies = new Cookies();
  const navigate = useNavigate();

  const { t }= useTranslation('translation', { keyPrefix: 'Header' });

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const authenticationAction = () => {
    if(isAuthenticated) {
        // logout
        setIsAuthenticated(false);
        cookies.remove('userToken');
        cookies.remove('user');
    }
    navigate('/login');
  }

  const gotoHome = () => {
    handleCloseNavMenu();
    navigate('/');
  }

  const changeLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'he' : 'en');
  }

  const pages = [{name: "change Language", func: changeLanguage}];



  return (
    <AppBar position="static" sx={{backgroundColor: "#5C6F68"}}>
      <Container sx={{margin: 0, maxWidth: "100% !important", width: '100%'}}>
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {t("title")}
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={page.func}>
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Calculator
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={page.func}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title={isAuthenticated ? "Logout" : "Login"}>
              <IconButton onClick={authenticationAction} sx={{ p: 0 }}>
                {isAuthenticated ? <LogoutIcon sx={{color: "white"}}/> : <LoginIcon sx={{color: "white"}}/>}
              </IconButton>
              </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;