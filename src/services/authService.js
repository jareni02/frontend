import axios from "axios";

const API_URL = "http://127.0.0.1:8000"; // URL del backend en FastAPI

// ✅ Función para iniciar sesión (login)
export const login = async (username, email, phone, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      email,
      phone,
      password,
    });
    localStorage.setItem("token", response.data.access_token);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Error al iniciar sesión");
  }
};

// ✅ Función para registrar usuarios
export const register = async (nombre, primer_apellido, segundo_apellido, tipo_usuario, nombre_usuario, correo_electronico, contrasena, numero_telefono, estatus = "ACTIVO") => {
  try {
    const response = await axios.post(`${API_URL}/users`, {
      nombre,
      primer_apellido,
      segundo_apellido,
      tipo_usuario,
      nombre_usuario,
      correo_electronico,
      contrasena,
      numero_telefono,
      estatus
    });

    localStorage.setItem("token", response.data.access_token); // Guardar el token en localStorage
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Error al registrarse");
  }
};
