import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainMenu from './menuprincipal';
import Usuarios from './usuarios';
import Login from './login';
import Register from './registro';
import MenuList from './MenuList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/menuprincipal" element={<MainMenu />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu-items" element={<MenuList />} />
      </Routes>
    </Router>
  );
}

export default App;
