import React, { useState, useEffect } from "react";
import "./crearUsuario.css"; // Archivo CSS para el diseño

const CreateUsuario = ({ onClose }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    username: "",
    rol: "",
    password: "",
  });

  // Actualiza automáticamente el username basado en nombre y apellido
  useEffect(() => {
    if (formData.nombre && formData.apellido) {
      const username = `${formData.nombre.charAt(0).toLowerCase()}${formData.apellido.toLowerCase()}`;
      setFormData((prevData) => ({ ...prevData, username }));
    } else {
      // Si nombre o apellido están vacíos, limpia el username
      setFormData((prevData) => ({ ...prevData, username: "" }));
    }
  }, [formData.nombre, formData.apellido]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita el comportamiento predeterminado del formulario

    try {
      const response = await fetch("http://localhost:8090/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Usuario creado correctamente");
        setFormData({
          nombre: "",
          apellido: "",
          correo: "",
          username: "",
          rol: "",
          password: "",
        }); // Reinicia el formulario
        if (onClose) onClose(); // Cierra el formulario si se pasó la función onClose
      } else {
        const errorData = await response.json();
        alert(`Error al crear el usuario: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      alert("Hubo un problema al conectar con el servidor.");
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Crear Nuevo Usuario</h2>
      <form className="create-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Nombre:</label>
          <input
            className="form-input"
            type="text"
            name="nombre"
            value={formData.nombre}
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
            value={formData.apellido}
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
            value={formData.correo}
            onChange={handleChange}
            placeholder="Ingrese el correo del usuario"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Username:</label>
          <input
            className="form-input"
            type="text"
            name="username"
            value={formData.username}
            readOnly // El usuario no podrá editar el campo directamente
            placeholder="Nombre Usuario"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Rol:</label>
          <select
            className="form-input"
            name="rol"
            value={formData.rol}
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
        <div className="form-group">
          <label className="form-label">Contraseña:</label>
          <input
            className="form-input"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Ingrese la contraseña del usuario"
            required
          />
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

export default CreateUsuario;
