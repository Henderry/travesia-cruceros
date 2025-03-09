import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';


const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
  boxShadow: theme.shadows[4],
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(0, 1),
  fontWeight: 600,
  textTransform: "uppercase",
  transition: theme.transitions.create(["background", "transform"], {
    duration: theme.transitions.duration.short,
  }),
  "&:hover": {
    backgroundColor: theme.palette.secondary.light,
    transform: "scale(1.05)",
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

export default function Header() {
  // Estados y handlers
  const [anchorElUser, setAnchorEl] = useState(null);
  const [mobileOpcionesAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [anchorElPrincipal, setAnchorElPrincipal] = useState(null);

  const isMobileOpcionesMenuOpen = Boolean(mobileOpcionesAnchorEl);

  // Handlers
  const handleUserMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleUserMenuClose = () => {
    setAnchorEl(null);
    handleOpcionesMenuClose();
  };
  const handleOpenPrincipalMenu = (event) => setAnchorElPrincipal(event.currentTarget);
  const handleClosePrincipalMenu = () => setAnchorElPrincipal(null);
  const handleOpcionesMenuOpen = (event) => setMobileMoreAnchorEl(event.currentTarget);
  const handleOpcionesMenuClose = () => setMobileMoreAnchorEl(null);
  const handleMantenimientoOpen = (event) => setAnchorElMantenimiento(event.currentTarget);
  const handleMantenimientoClose = () => setAnchorElMantenimiento(null);
  // Datos
  const mantenimientoItems = [
    { name: "Habitaciones", link: "/habitacion-table" },
    { name: "Barcos", link: "/barco-table" },
    { name: "Cruceros", link: "/crucero-table" },
    { name: "Complementos", link: "/complemento-table" }
  ];
  
  const userItems = [
    { name: "Login", link: "/user/login", login: false },
    { name: "Registrarse", link: "/user/create", login: false },
    { name: "Logout", link: "/user/logout", login: true },
  ];

  const navItems = [
    { name: "Habitaciones", link: "/habitacion", roles: null },    
    { name: "Barcos", link: "/barco", roles: null },
    { name: "Cruceros", link: "/crucero", roles: null },
       { name: "Reservas", link: "/reserva", roles: null },
       { 
        name: "Mantenimiento", 
        subItems: mantenimientoItems}
  ];
  const [anchorElMantenimiento, setAnchorElMantenimiento] = useState(null);
  const isMantenimientoOpen = Boolean(anchorElMantenimiento);
  const [mobileSubMenuOpen, setMobileSubMenuOpen] = useState(null);
  // Componentes de menú
  const menuPrincipalMobile = navItems.map((page, index) => (
    page.subItems ? (
      <div key={index}>
        <MenuItem onClick={() => setMobileSubMenuOpen(index)}>
          <Typography>{page.name}</Typography>
          <ArrowDropDownIcon />
        </MenuItem>
        {mobileSubMenuOpen === index && (
          <Box sx={{ pl: 2 }}>
            {page.subItems.map((subItem, subIndex) => (
              <MenuItem 
                key={subIndex} 
                component={Link} 
                to={subItem.link}
                onClick={handleClosePrincipalMenu}
              >
                {subItem.name}
              </MenuItem>
            ))}
          </Box>
        )}
      </div>
    ) : (
      <MenuItem 
        key={index} 
        component={Link} 
        to={page.link} 
        onClick={handleClosePrincipalMenu}
      >
        <Typography>{page.name}</Typography>
      </MenuItem>
    )
  ));

  const userMenu = (
    <Menu
      sx={{ mt: "45px" }}
      anchorEl={anchorElUser}
      open={Boolean(anchorElUser)}
      onClose={handleUserMenuClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <MenuItem>
        <Typography variant="subtitle1">Email usuario</Typography>
      </MenuItem>
      {userItems.map((item, index) => (
        <MenuItem key={index} component={Link} to={item.link}>
          <Typography textAlign="center">{item.name}</Typography>
        </MenuItem>
      ))}
    </Menu>
  );

  const menuOpcionesMobile = (
    <Menu
      anchorEl={mobileOpcionesAnchorEl}
      open={isMobileOpcionesMenuOpen}
      onClose={handleOpcionesMenuClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <MenuItem>
        <IconButton component={Link} to="/rental/crear/" size="large" color="inherit">
          <StyledBadge badgeContent="0" color="secondary">
            <ShoppingCartIcon />
          </StyledBadge>
        </IconButton>
        <Typography>Compras</Typography>
      </MenuItem>
      <MenuItem>
        <IconButton size="large" color="inherit">
          <StyledBadge badgeContent={17} color="error">
            <NotificationsIcon />
          </StyledBadge>
        </IconButton>
        <Typography>Notificaciones</Typography>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <StyledAppBar position="static">
        <Toolbar sx={{ padding: 2 }}>
          {/* Menú móvil */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            onClick={handleOpenPrincipalMenu}
            sx={{ display: { md: "none" }, mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Tooltip title="Inicio">
            <IconButton
              component={Link}
              to="/"
              color="inherit"
              sx={{ 
                mr: 2,
                '&:hover': { transform: 'scale(1.1)' },
                transition: 'transform 0.3s ease'
              }}
            >
              <LiveTvIcon sx={{ fontSize: 32 }} />
            </IconButton>
          </Tooltip>

          {/* Menú principal desktop */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: 'center' }}>
  {navItems.map((item, index) => (
    item.subItems ? (
      <Box key={index} sx={{ position: 'relative' }}>
        <StyledButton
          onClick={handleMantenimientoOpen}
          endIcon={<ArrowDropDownIcon />}
          sx={{ '&:hover': { backgroundColor: 'secondary.dark' } }}
        >
          {item.name}
        </StyledButton>
        
        <Menu
          anchorEl={anchorElMantenimiento}
          open={isMantenimientoOpen}
          onClose={handleMantenimientoClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          {item.subItems.map((subItem, subIndex) => (
            <MenuItem 
              key={subIndex} 
              component={Link} 
              to={subItem.link}
              onClick={handleMantenimientoClose}
            >
              {subItem.name}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    ) : (
      <StyledButton
        key={index}
        component={Link}
        to={item.link}
        color="inherit"
      >
        {item.name}
      </StyledButton>
    )
  ))}
</Box>
          {/* Iconos derecha */}
          
          {/* Menú móvil - Más opciones */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              color="inherit"
              onClick={handleOpcionesMenuOpen}
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </StyledAppBar>

      {/* Menús desplegables */}
      <Menu
        id="menu-principal-mobile"
        anchorEl={anchorElPrincipal}
        open={Boolean(anchorElPrincipal)}
        onClose={handleClosePrincipalMenu}
        sx={{ display: { md: "none" } }}
      >
        {menuPrincipalMobile}
      </Menu>
      
      {userMenu}
      {menuOpcionesMobile}
    </Box>
  );
}