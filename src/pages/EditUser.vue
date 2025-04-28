<script>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import Navbar from "../components/Navbar.vue";

export default {
  components: { Navbar },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const user = ref({
      nombre: "",
      primer_apellido: "",
      segundo_apellido: "",
      tipo_usuario: "",
      nombre_usuario: "",
      correo_electronico: "",
      contrasena: "",
      numero_telefono: "",
      estatus: "",
    });
    const errorMessage = ref("");
    const successMessage = ref("");

    // Obtener los datos del usuario
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      try {
        const response = await axios.get(`http://127.0.0.1:8000/users/${route.params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        user.value = response.data;
      } catch (error) {
        errorMessage.value = "Error al obtener los datos del usuario.";
      }
    };

    // Actualizar el usuario
    const updateUser = async () => {
      const token = localStorage.getItem("token");
      successMessage.value = "";
      errorMessage.value = "";

      try {
        await axios.put(`http://127.0.0.1:8000/users/${route.params.id}`, user.value, {
          headers: { Authorization: `Bearer ${token}` },
        });
        successMessage.value = "Usuario actualizado correctamente.";
        setTimeout(() => router.push("/manage-users"), 1500); // Redirige después de 1.5s
      } catch (error) {
        errorMessage.value = "Error al actualizar el usuario.";
      }
    };

    onMounted(fetchUser);

    return { user, errorMessage, successMessage, updateUser };
  },
};
</script>

<template>
  <div class="dashboard">
    <Navbar />

    <div class="container">
      <h1>Editar Usuario</h1>

      <p v-if="successMessage" class="success">{{ successMessage }}</p>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

      <form @submit.prevent="updateUser">
        <label>Nombre:</label>
        <input type="text" v-model="user.nombre" required />

        <label>Primer Apellido:</label>
        <input type="text" v-model="user.primer_apellido" required />

        <label>Segundo Apellido:</label>
        <input type="text" v-model="user.segundo_apellido" required />

        <label>Tipo de Usuario:</label>
        <input type="text" v-model="user.tipo_usuario" required />

        <label>Nombre de Usuario:</label>
        <input type="text" v-model="user.nombre_usuario" required />

        <label>Correo Electrónico:</label>
        <input type="email" v-model="user.correo_electronico" required />

        <label>Contraseña:</label>
        <input type="password" v-model="user.contrasena" placeholder="Deja vacío para no cambiarla" />

        <label>Teléfono:</label>
        <input type="text" v-model="user.numero_telefono" required />

        <label>Estatus:</label>
        <select v-model="user.estatus">
          <option value="ACTIVO">ACTIVO</option>
          <option value="INACTIVO">INACTIVO</option>
        </select>

        <button type="submit" class="btn btn-save">Guardar Cambios</button>
      </form>
    </div>
  </div>
</template>

<style>
.container {
  width: 50%;
  margin: auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #333;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

input, select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.btn-save {
  background: #28a745;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.success {
  color: green;
  text-align: center;
}

.error {
  color: red;
  text-align: center;
}
</style>
