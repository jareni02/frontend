<script>
import { ref } from "vue";
import { register } from "../services/authService";
import { useRouter } from "vue-router";

export default {
  setup() {
    // ✅ Ahora capturamos TODOS los datos requeridos
    const nombre = ref("");
    const primer_apellido = ref("");
    const segundo_apellido = ref("");
    const tipo_usuario = ref("ADMINISTRATIVO");
    const nombre_usuario = ref("");
    const correo_electronico = ref("");
    const contrasena = ref("");
    const numero_telefono = ref("");
    const estatus = ref("ACTIVO"); // Valor predeterminado

    const errorMessage = ref("");
    const successMessage = ref("");
    const router = useRouter();

    const handleRegister = async () => {
      errorMessage.value = "";
      successMessage.value = "";
      try {
        const response = await register(
          nombre.value,
          primer_apellido.value,
          segundo_apellido.value,
          tipo_usuario.value,
          nombre_usuario.value,
          correo_electronico.value,
          contrasena.value,
          numero_telefono.value,
          estatus.value
        );
        successMessage.value = "Registro exitoso. Redirigiendo...";
        console.log("Token:", response.access_token);
        setTimeout(() => router.push("/"), 2000);
      } catch (error) {
        errorMessage.value = error.message;
      }
    };

    return { nombre, primer_apellido, segundo_apellido, tipo_usuario, nombre_usuario, correo_electronico, contrasena, numero_telefono, estatus, handleRegister, errorMessage, successMessage };
  },
};
</script>

<template>
  <div class="register-container">
    <h2>Registro de Usuario</h2>
    <form @submit.prevent="handleRegister">
      <input type="text" v-model="nombre" placeholder="Nombre" required />
      <input type="text" v-model="primer_apellido" placeholder="Primer Apellido" required />
      <input type="text" v-model="segundo_apellido" placeholder="Segundo Apellido" />
      <select v-model="tipo_usuario">
        <option value="ADMINISTRATIVO">Administrativo</option>
        <option value="ALUMNO">alumno</option>
        <option value="PROFESOR">profesor</option>
      </select>
      <input type="text" v-model="nombre_usuario" placeholder="Nombre de usuario" required />
      <input type="email" v-model="correo_electronico" placeholder="Correo electrónico" required />
      <input type="text" v-model="numero_telefono" placeholder="Teléfono" required />
      <input type="password" v-model="contrasena" placeholder="Contraseña" required />
      <button type="submit">Registrarse</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
    <button class="login-button" @click="router.push('/')">Ya tengo cuenta, Iniciar sesión</button>
  </div>
</template>

<style>
.register-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  text-align: center;
}
input, select {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 10px;
}
button {
  background: green;
  color: white;
  padding: 10px;
  width: 100%;
  margin-top: 10px;
}
.login-button {
  background: blue;
  margin-top: 10px;
}
.error {
  color: red;
}
.success {
  color: green;
}
</style>
