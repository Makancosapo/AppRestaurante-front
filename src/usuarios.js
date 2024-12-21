import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Select,
  MenuItem,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Modal,
  IconButton,
} from "@mui/material";
import {
  Menu as MenuIcon,
  People as PeopleIcon,
  TableBar as TableIcon,
  RestaurantMenu as RestaurantMenuIcon,
  Inventory as ProductsIcon,
  AttachMoney as FinanceIcon,
  Kitchen as KitchenIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import UsuarioEdit from "./editarUsuario";
import CreateUsuario from "./crearUsuario";
import "./usuarios.css";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroRol, setFiltroRol] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user")) || { nombre: "Usuario", rol: "Admin" };
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch("http://localhost:8090/users");
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      alert("Hubo un problema al conectar con el servidor.");
    }
  };

  const handleEdit = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalContent(
      <UsuarioEdit usuario={usuario} onClose={handleCloseModal} />
    );
    setModalOpen(true);
  };

  const handleCreate = () => {
    setModalContent(<CreateUsuario onClose={handleCloseModal} />);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    fetchUsuarios();
  };

  const handleDelete = async (idusuario) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar este usuario?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:8090/users/${idusuario}`, {
          method: "DELETE",
        });
        if (response.ok) {
          alert("Usuario eliminado correctamente");
          fetchUsuarios();
        } else {
          alert("Hubo un problema al eliminar el usuario.");
        }
      } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        alert("Hubo un error al conectar con el servidor.");
      }
    }
  };

  const toggleDrawer = (open) => () => {
    setIsDrawerOpen(open);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const menuItemsByRole = {
    admin: [
      { text: "Usuarios", icon: <PeopleIcon />, route: "/usuarios" },
      { text: "Mesas", icon: <TableIcon />, route: "/mesas" },
      { text: "Menú", icon: <RestaurantMenuIcon />, route: "/menu-items" },
      { text: "Monitor de cocina", icon: <KitchenIcon />, route: "/cocina" },
      { text: "Productos", icon: <ProductsIcon />, route: "/productos" },
      { text: "Finanzas", icon: <FinanceIcon />, route: "/finanzas" },
    ],
    cliente: [{ text: "Menú", icon: <RestaurantMenuIcon />, route: "/menu-items" }],
    cheff: [
      { text: "Mesas", icon: <TableIcon />, route: "/mesas" },
      { text: "Menú", icon: <RestaurantMenuIcon />, route: "/menu-items" },
      { text: "Monitor de cocina", icon: <KitchenIcon />, route: "/cocina" },
    ],
  };

  const menuItems = menuItemsByRole[user?.rol] || [];

  const filteredUsuarios = usuarios.filter((usuario) => {
    const fullName = `${usuario.nombre} ${usuario.apellido}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());
    const matchesRol = filtroRol ? usuario.rol === filtroRol : true;
    return matchesSearch && matchesRol;
  });

  const formatFecha = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript empiezan en 0
    const anio = date.getFullYear();
    return `${dia}-${mes}-${anio}`;
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Gestión de Usuarios
          </Typography>
          <Avatar sx={{ bgcolor: "secondary.main", mr: 1 }}>
            {user?.nombre.charAt(0).toUpperCase()}
          </Avatar>
            <Typography sx={{ mr: 2 }}>
              {user?.nombre} ({user?.rol})
            </Typography>
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
          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            fullWidth
            sx={{ mt: "auto", p: 2 }}
            onClick={handleLogout}
          >
            Cerrar Sesión
          </Button>
        </Box>
      </Drawer>

      <div className="container">
        <div className="header">
          <div className="filters">
            <TextField
              label="Buscar"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-field"
            />
            <Select
              value={filtroRol}
              onChange={(e) => setFiltroRol(e.target.value)}
              displayEmpty
              variant="outlined"
              size="small"
              className="filter-select"
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="admin">Administrador</MenuItem>
              <MenuItem value="cliente">Cliente</MenuItem>
              <MenuItem value="cheff">Cheff</MenuItem>
              <MenuItem value="Mesero">Mesero</MenuItem>
            </Select>
          </div>
          <div className="actions">
            <Button variant="contained" color="success" onClick={handleCreate}>
              Crear Usuario
            </Button>
          </div>
        </div>

        <div className="table-container">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="table-header">Nombre</TableCell>
                <TableCell className="table-header">Apellido</TableCell>
                <TableCell className="table-header">Correo</TableCell>
                <TableCell className="table-header">Rol</TableCell>
                <TableCell className="table-header">Fecha Creación</TableCell>
                <TableCell className="table-header">Fecha Edición</TableCell>
                <TableCell className="table-header">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsuarios.map((usuario) => (
                <TableRow key={usuario.idusuario}>
                  <TableCell>{usuario.nombre}</TableCell>
                  <TableCell>{usuario.apellido}</TableCell>
                  <TableCell>{usuario.correo}</TableCell>
                  <TableCell>{usuario.rol}</TableCell>
                  <TableCell>{formatFecha(usuario.fechacreacion)}</TableCell>
                  <TableCell>{formatFecha(usuario.fechamodificacion)}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="warning"
                      size="small"
                      onClick={() => handleEdit(usuario)}
                      sx={{ marginRight: 1 }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(usuario.idusuario)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Modal open={modalOpen} onClose={handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              p: 4,
              borderRadius: 2,
              width: "80%",
              maxWidth: "600px",
            }}
          >
            {modalContent}
          </Box>
        </Modal>
      </div>
    </>
  );
};

export default Usuarios;
