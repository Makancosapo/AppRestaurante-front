import React, { useState, useEffect } from 'react';
import "./editarUsuario.css"; // Archivo CSS adaptado para el diseño

const UsuarioEdit = ({ usuario, onClose }) => {
  const [formData, setFormData] = useState(usuario);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8090/users/${usuario.idusuario}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Usuario actualizado correctamente");
        onClose(); // Cierra la vista de edición
      } else {
        alert("Error al actualizar el usuario");
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      alert("Hubo un problema al actualizar el usuario.");
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Editar Usuario</h2>
      <form className="edit-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Nombre:</label>
          <input
            className="form-input"
            type="text"
            name="nombre"
            value={formData.nombre || ""}
            onChange={handleChange}
            placeholder="Ingrese el nombre del usuario"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Apellido:</label>
          <input
            className="form-input"
            type="text"
            name="apellido"
            value={formData.apellido || ""}
            onChange={handleChange}
            placeholder="Ingrese el apellido del usuario"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Correo Electrónico:</label>
          <input
            className="form-input"
            type="email"
            name="correo"
            value={formData.correo || ""}
            onChange={handleChange}
            placeholder="Ingrese el correo electrónico"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Rol:</label>
          <select
            className="form-input"
            name="rol"
            value={formData.rol || ""}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Seleccione un rol
            </option>
            <option value="admin">Administrador</option>
            <option value="cliente">Cliente</option>
            <option value="cheff">Cheff</option>
            <option value="Mesero">Mesero</option>
          </select>
        </div>
        <div className="form-actions">
          <button className="form-button save" type="submit">
            Guardar
          </button>
          <button className="form-button cancel" type="button" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default UsuarioEdit;
