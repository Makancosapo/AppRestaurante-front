import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, CssBaseline, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8090/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo, password }),
      });

      if (response.ok) {
        const data = await response.json();

        // Guardar token y datos del usuario en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.usuario));

        // Redirigir al menú principal
        navigate('/menuprincipal');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error en el inicio de sesión.');
      }
    } catch (err) {
      setError('Hubo un problema al conectarse con el servidor.');
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register'); // Redirige al componente de registro
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Iniciar Sesión
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="correo"
            label="Correo Electrónico"
            name="correo"
            autoComplete="email"
            autoFocus
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Iniciar Sesión
          </Button>
          <Typography align="center" sx={{ mt: 2 }}>
            ¿No tienes una cuenta?{' '}
            <Link onClick={handleRegisterRedirect} sx={{ cursor: 'pointer' }}>
              Regístrate aquí
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
