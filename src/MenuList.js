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
  Modal,
  TextField,
  Select,
  MenuItem,
  InputAdornment,
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
import EditarMenu from './EditarMenu';



const MenuList = () => {
  const [user, setUser] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [foodItems, setFoodItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    Nombre: '',
    Precio: '',
    categoria: '',
    descripcion: '',
    imgdir: '',
    Tiempopreparacion: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      navigate('/');
    } else {
      setUser(userData);
    }
    fetchMenuItems();
    }, [navigate]);

    const fetchMenuItems = async () => {
      try {
        const response = await fetch('http://localhost:8090/menu-items');
        if (!response.ok) {
          throw new Error(`Error en el servidor: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setFoodItems(data);
        const uniqueCategories = [...new Set(data.map((item) => item.categoria))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();


  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const toggleDrawer = (open) => () => {
    setIsDrawerOpen(open);
  };

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleAddItem = async () => {
    try {
      const response = await fetch('http://localhost:8090/newmenu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) {
        throw new Error('Error al agregar el ítem.');
      }

      alert('Ítem agregado exitosamente.');
      setIsModalOpen(false);
      setNewItem({ Nombre: '', Precio: '', categoria: '', descripcion: '', imgdir: '', Tiempopreparacion: '' });

      const fetchMenuItems = async () => {
        try {
          const response = await fetch('http://localhost:8090/menu-items');
          if (!response.ok) {
            throw new Error(`Error en el servidor: ${response.status} ${response.statusText}`);
          }
          const data = await response.json();
          setFoodItems(data);
          const uniqueCategories = [...new Set(data.map((item) => item.categoria))];
          setCategories(uniqueCategories);
        } catch (error) {
          console.error('Error fetching menu items:', error);
        }
      };

      fetchMenuItems();
    } catch (error) {
      console.error('Error al agregar el ítem:', error);
      alert('Hubo un problema al agregar el ítem.');
    }
  };

  const handleDeleteItem = async (idMenu) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este ítem del menú?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8090/menu/${idMenu}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el ítem del menú.');
      }

      alert('Ítem eliminado exitosamente.');
      fetchMenuItems()
      setFoodItems((prevItems) => prevItems.filter((item) => item.idMenu !== idMenu));
    } catch (error) {
      console.error('Error al eliminar el ítem:', error);
      alert('Hubo un problema al eliminar el ítem.');
    }
  };

  const menuItemsByRole = {
    admin: [
      { text: 'Usuarios', icon: <PeopleIcon />, route: '/usuarios' },
      { text: 'Mesas', icon: <TableIcon />, route: '/mesas' },
      { text: 'Menú', icon: <RestaurantMenuIcon />, route: '/menu-items' },
      { text: 'Monitor de cocina', icon: <KitchenIcon />, route: '/cocina' },
      { text: 'Productos', icon: <ProductsIcon />, route: '/productos' },
      { text: 'Finanzas', icon: <FinanceIcon />, route: '/finanzas' },
    ],
    cliente: [
      { text: 'Menú', icon: <RestaurantMenuIcon />, route: '/menu-items' },
    ],
    cheff: [
      { text: 'Mesas', icon: <TableIcon />, route: '/mesas' },
      { text: 'Menú', icon: <RestaurantMenuIcon />, route: '/menu-items' },
      { text: 'Monitor de cocina', icon: <KitchenIcon />, route: '/cocina' },
    ],
    Mesero: [
      { text: 'Mesas', icon: <TableIcon />, route: '/mesas' },
      { text: 'Menú', icon: <RestaurantMenuIcon />, route: '/menu-items' },
    ],
  };


  const openEditModal = (item) => {
    setItemToEdit(item); // Establece el ítem a editar
    setIsEditModalOpen(true); // Abre el modal
  };
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  
  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setItemToEdit((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`http://localhost:8090/menu/${itemToEdit.idMenu}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemToEdit),
        Tiempopreparacion: parseInt(itemToEdit.Tiempopreparacion, 10) || 0,
      });
  
      if (!response.ok) {
        throw new Error('Error al guardar los cambios.');
      }
  
      alert('Cambios guardados exitosamente.');
      setIsEditModalOpen(false);
      setItemToEdit(null);
      fetchMenuItems(); // Recarga la lista de ítems
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
      alert('Hubo un problema al guardar los cambios.');
    }
  };
  

  const menuItems = menuItemsByRole[user?.rol] || [];
  
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
            .filter((item) => item.categoria === categories[selectedCategory])
            .map((food, index) => (
              <Card key={index} sx={{ width: 200 }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={food.imgdir}
                  alt={food.Nombre}
                />
                <CardContent>
                  <Typography variant="h6" component="div">
                    {food.Nombre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {food.Precio}
                  </Typography>
                  {user?.rol === 'cliente' && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {food.descripcion}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  {user?.rol === 'admin' ? (
                    <>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => openEditModal(food)} // Implementa lógica para editar

                        
                      >
                        Editar
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDeleteItem(food.IdMenu)}
                      >
                        Eliminar
                      </Button>
                    </>
                  ) : user?.rol === 'cliente' ? (
                    <Button
                      size="small"
                      color="success"
                      onClick={() => console.log(`Agregar al carrito: ${food.Nombre}`)} // Implementa lógica para agregar al carrito
                    >
                      Agregar al carrito
                    </Button>
                  ) : null}
                </CardActions>
              </Card>
            ))}
        </Box>
  
        {user?.rol === 'admin' && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsModalOpen(true)}
            sx={{ mt: 3 }}
          >
            Agregar Ítem
          </Button>
        )}
      </Box>
  
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Agregar Nuevo Ítem
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Nombre"
            name="Nombre"
            value={newItem.Nombre}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Precio"
            name="Precio"
            value={newItem.Precio}
            onChange={handleInputChange}
          />
          <Select
            fullWidth
            margin="normal"
            name="categoria"
            value={newItem.categoria}
            onChange={handleInputChange}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Selecciona una categoría
            </MenuItem>
            {categories.map((category, index) => (
              <MenuItem key={index} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
          <TextField
            fullWidth
            margin="normal"
            label="Descripción"
            name="descripcion"
            value={newItem.descripcion}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="URL de Imagen"
            name="imgdir"
            value={newItem.imgdir}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Tiempo de Preparación"
            name="Tiempopreparacion"
            type="number"
            value={newItem.Tiempopreparacion}
            onChange={handleInputChange}
            InputProps={{
              endAdornment: <InputAdornment position="end">minutos</InputAdornment>,
            }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleAddItem}
            sx={{ mt: 2 }}
          >
            Guardar
          </Button>
        </Box>
      </Modal>
      <EditarMenu
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)} // Cierra el modal
          itemToEdit={itemToEdit} // Pasa el ítem que se está editando
          categories={categories} // Pasa las categorías disponibles
          onEditChange={handleEditChange} // Función para manejar cambios en el ítem
          onSave={handleSaveEdit} // Función para guardar los cambios
        />

    </>
  );
  

};

export default MenuList;

