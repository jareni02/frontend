<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Navbar from "../components/Navbar.vue";

export default {
  components: { Navbar },
  setup() {
    const router = useRouter();
    const tipo_material = ref("");
    const marca = ref("");
    const modelo = ref("");
    const estatus = ref("");
    const errorMessage = ref("");
    const successMessage = ref("");
    const loading = ref(false);

    // Función para enviar los datos del formulario
    const submitForm = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      loading.value = true;
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/materials",
          {
            tipo_material: tipo_material.value,
            marca: marca.value,
            modelo: modelo.value,
            estatus: estatus.value,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        successMessage.value = "Material creado con éxito.";
        // Limpiar campos después de la creación
        tipo_material.value = "";
        marca.value = "";
        modelo.value = "";
        estatus.value = "";
      } catch (error) {
        errorMessage.value = "Error al crear el material.";
      } finally {
        loading.value = false;
      }
    };

    return {
      tipo_material,
      marca,
      modelo,
      estatus,
      errorMessage,
      successMessage,
      loading,
      submitForm,
    };
  },
};
</script>

<template>
  <div class="dashboard">
    <Navbar />

    <div class="container">
      <h1>Crear Nuevo Material</h1>
      <p class="subtitle">Ingresa los datos del material a crear</p>

      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="tipo_material">Tipo de Material</label>
          <select
            id="tipo_material"
            v-model="tipo_material"
            class="form-control"
            required
          >
            <option value="">Selecciona el tipo de material</option>
            <option value="CANON">CANON</option>
            <option value="COMPUTADORA">COMPUTADORA</option>
            <option value="EXTENSION">EXTENSION</option>
          </select>
        </div>

        <div class="form-group">
          <label for="marca">Marca</label>
          <input
            type="text"
            id="marca"
            v-model="marca"
            class="form-control"
            required
          />
        </div>

        <div class="form-group">
          <label for="modelo">Modelo</label>
          <input
            type="text"
            id="modelo"
            v-model="modelo"
            class="form-control"
            required
          />
        </div>

        <div class="form-group">
          <label for="estatus">Estatus</label>
          <select id="estatus" v-model="estatus" class="form-control" required>
            <option value="">Selecciona el estatus</option>
            <option value="DISPONIBLE">Disponible</option>
            <option value="PRESTADO">Prestado</option>
            <option value="EN_MANTENIMIENTO">En Mantenimiento</option>
          </select>
        </div>

        <button type="submit" class="btn btn-submit" :disabled="loading">Crear Material</button>
      </form>

      <!-- Mensajes de éxito o error -->
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
      <div v-if="successMessage" class="success">{{ successMessage }}</div>
    </div>
  </div>
</template>

<style>
/* Estilos generales */
.dashboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
}

.container {
  width: 80%;
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
}

h1 {
  font-size: 28px;
  font-weight: bold;
  color: #333;
}

.subtitle {
  color: #666;
  font-size: 16px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-size: 14px;
  margin-bottom: 5px;
  display: block;
}

input,
select {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Mensajes de éxito y error */
.success {
  color: green;
  font-size: 16px;
  margin-top: 10px;
}

.error {
  color: red;
  font-size: 16px;
  margin-top: 10px;
}
</style>
