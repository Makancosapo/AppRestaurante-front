import React from 'react';
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';

const EditarMenu = ({
  isOpen,
  onClose,
  itemToEdit,
  categories,
  onEditChange,
  onSave,
}) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
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
          Editar Ítem
        </Typography>
        {itemToEdit && (
          <>
            <TextField
              fullWidth
              margin="normal"
              label="Nombre"
              name="Nombre"
              value={itemToEdit.Nombre}
              onChange={onEditChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Precio"
              name="Precio"
              value={itemToEdit.Precio}
              onChange={onEditChange}
            />
            <Select
              fullWidth
              margin="normal"
              name="categoria"
              value={itemToEdit.categoria}
              onChange={onEditChange}
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
              value={itemToEdit.descripcion}
              onChange={onEditChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="URL de Imagen"
              name="imgdir"
              value={itemToEdit.imgdir}
              onChange={onEditChange}
            />
        <TextField
              fullWidth
              margin="normal"
              label="Tiempo de Preparación"
              name="Tiempopreparacion" 
              type="number"
              value={itemToEdit.Tiempopreparacion || 0} 
              onChange={(e) =>
                onEditChange({
                  target: {
                    name: 'Tiempopreparacion',
                    value: parseInt(e.target.value, 10) || 0, // Convertir a número o usar 0
                  },
                })
              }
              InputProps={{
                endAdornment: <InputAdornment position="end">minutos</InputAdornment>,
              }}
            />

            
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={onSave}
              sx={{ mt: 2 }}
            >
              Guardar Cambios
            </Button>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default EditarMenu;
