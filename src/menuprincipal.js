import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Tabs,
  Tab,
  Card,
  CardMedia,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  Menu as MenuIcon,
  People as PeopleIcon,
  TableBar as TableIcon,
  RestaurantMenu as RestaurantMenuIcon,
  Inventory as ProductsIcon,
  AttachMoney as FinanceIcon,
  Kitchen as KitchenIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';


const MainMenu = () => {
  const [user, setUser] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      navigate('/'); 
    } else {
      setUser(userData);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const toggleDrawer = (open) => () => {
    setIsDrawerOpen(open);
  };

  const menuItemsByRole = {
    admin: [
      { text: 'Usuarios', icon: <PeopleIcon />, route: '/usuarios' },
      { text: 'Mesas', icon: <TableIcon />, route: '/mesas' },
      { text: 'Menú', icon: <RestaurantMenuIcon />, route: '/menu-items' },
      { text: 'Monitor de cocina', icon: <KitchenIcon />, route: '/cocina' },
      { text: 'Productos', icon: <ProductsIcon />, route: '/productos' },
      { text: 'Proveedores', icon: <ProductsIcon />, route: '/productos' },
      { text: 'Finanzas', icon: <FinanceIcon />, route: '/finanzas' },
    ],
    cliente: [
      { text: 'Menú', icon: <RestaurantMenuIcon />, route: '/menu-items' },
      { text: 'Datos Personales', icon: <PeopleIcon />, route: '/menu-items' },
    ],
    cheff: [
      { text: 'Mesas', icon: <TableIcon />, route: '/mesas' },
      { text: 'Menú', icon: <RestaurantMenuIcon />, route: '/menu-items' },
      { text: 'Monitor de cocina', icon: <KitchenIcon />, route: '/cocina' },
      { text: 'Productos', icon: <ProductsIcon />, route: '/productos' },
    ],
    Mesero: [
      
      { text: 'Mesas', icon: <TableIcon />, route: '/mesas' },
      { text: 'Menú', icon: <RestaurantMenuIcon />, route: '/menu-items' },
       
     
    ],


    
  };

  const menuItems = menuItemsByRole[user?.rol] || [];

  const foodItems = [
    { category: 'Entradas', name: 'Empanadas', price: '$5.000', image: '/assets/images/empanadas.jpg' },
    { category: 'Entradas', name: 'Ceviche', price: '$6.500', image: '/assets/images/cevicheo.jpg' },
    { category: 'Platos Principales', name: 'Lomo Saltado', price: '$12.000', image: '/assets/images/lomosaltado.jpg' },
    { category: 'Platos Principales', name: 'Asado', price: '$15.000', image: '/assets/images/asado.jpg' },
    { category: 'Postres', name: 'Torta de Tres Leches', price: '$4.000', image: '/assets/images/torta_tres_leches.jpg' },
    { category: 'Postres', name: 'Helado Artesanal', price: '$3.500', image: '/assets/images/Helado.jpg' },
    {category: 'Bebidas', name: 'Inca-Cola', price: '$3.500', image: '/assets/images/incacola.jpg'},
    {category: 'Bebidas', name: 'Jugo Natural', price: '$3.500', image: '/assets/images/Jugonatural.jpg'}
  ];

  const categories = ['Entradas', 'Platos Principales', 'Postres','Bebidas'];

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Restaurante
          </Typography>
          <Box display="flex" alignItems="center">
            <Avatar sx={{ bgcolor: 'secondary.main', mr: 1 }}>
              {user?.nombre.charAt(0).toUpperCase()}
            </Avatar>
            <Typography sx={{ mr: 2 }}>
              {user?.nombre} ({user?.rol})
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Typography variant="h6" sx={{ p: 2 }}>
            Menú Principal
          </Typography>
          <Divider />
          <List>
            {menuItems.map((item, index) => (
              <ListItem button key={index} onClick={() => navigate(item.route)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <Box sx={{ mt: 'auto', p: 2 }}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              fullWidth
              onClick={handleLogout}
            >
              Cerrar Sesión
            </Button>
          </Box>
        </Box>
      </Drawer>

      <Box sx={{ p: 2 }}>
        <Tabs
          value={selectedCategory}
          onChange={handleCategoryChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          {categories.map((category, index) => (
            <Tab key={index} label={category} />
          ))}
        </Tabs>

        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {foodItems
            .filter((item) => item.category === categories[selectedCategory])
            .map((food, index) => (
              <Card key={index} sx={{ width: 200 }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={food.image}
                  alt={food.name}
                />
                <CardContent>
                  <Typography variant="h6" component="div">
                    {food.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {food.price}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    Seleccionar
                  </Button>
                </CardActions>
              </Card>
            ))}
        </Box>
      </Box>
    </>
  );
};

export default MainMenu;

