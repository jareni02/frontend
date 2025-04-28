<script>
import { ref } from "vue";
import { login } from "../services/authService";
import { useRouter } from "vue-router"; // Importar Vue Router para navegación

export default {
  setup() {
    const username = ref("");
    const email = ref("");
    const phone = ref("");
    const password = ref("");
    const errorMessage = ref("");
    const successMessage = ref("");
    const router = useRouter(); // Instancia del router

    const handleLogin = async () => {
      errorMessage.value = "";
      successMessage.value = "";
      try {
        const response = await login(username.value, email.value, phone.value, password.value);

        if (response.access_token) {
          localStorage.setItem("token", response.access_token); // ✅ Guardamos el token
          successMessage.value = "Inicio de sesión exitoso. Redirigiendo...";
          console.log("Token guardado:", response.access_token);

          setTimeout(() => {
            router.push("/dashboard"); // ✅ Redirigir al Dashboard después de iniciar sesión
          }, 1500);
        } else {
          errorMessage.value = "No se recibió un token válido.";
        }
      } catch (error) {
        errorMessage.value = error.message;
      }
    };

    const goToRegister = () => {
      router.push("/register"); // Redirigir a la página de registro
    };

    return { username, email, phone, password, handleLogin, errorMessage, successMessage, goToRegister };
  },
};
</script>

<template>
  <div class="login-container">
    <h2>Iniciar Sesión</h2>
    <form @submit.prevent="handleLogin">
      <input type="text" v-model="username" placeholder="Nombre de usuario" required />
      <input type="email" v-model="email" placeholder="Correo electrónico" required />
      <input type="text" v-model="phone" placeholder="Teléfono" required />
      <input type="password" v-model="password" placeholder="Contraseña" required />
      <button type="submit">Iniciar sesión</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>

    <!-- Botón para ir a la página de registro -->
    <button class="register-button" @click="goToRegister">¿No tienes cuenta? Regístrate</button>
  </div>
</template>

<style>
/* Estilos para el contenedor del login */
.login-container {
  max-width: 450px;
  margin: auto;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* Títulos */
h2 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

/* Estilos para los campos de entrada */
input {
  display: block;
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #fff;
  transition: border 0.3s ease;
}

input:focus {
  border-color: #007bff;
  outline: none;
}

/* Estilo para el botón de inicio de sesión */
button {
  background: #007bff;
  color: white;
  padding: 12px;
  width: 100%;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background: #0056b3;
}

/* Estilo para el botón de registro */
.register-button {
  background: #28a745;
  color: white;
  padding: 12px;
  width: 100%;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 10px;
}

.register-button:hover {
  background: #218838;
}

/* Estilos para los mensajes de error y éxito */
.error {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 15px;
}

.success {
  color: #2ecc71;
  font-size: 14px;
  margin-top: 15px;
}

/* Efecto de transición en el formulario */
form {
  transition: opacity 0.3s ease;
}

</style>
