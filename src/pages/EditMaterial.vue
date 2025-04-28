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
    const material = ref({
      tipo_material: "",
      marca: "",
      modelo: "",
      estatus: "",
    });
    const errorMessage = ref("");
    const successMessage = ref("");

    // Obtener los datos del material
    const fetchMaterial = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await axios.get(`http://127.0.0.1:8000/materials/${route.params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        material.value = response.data;
      } catch (error) {
        errorMessage.value = "Error al obtener los datos del material.";
      }
    };

    // Actualizar el material
    const updateMaterial = async () => {
      const token = localStorage.getItem("token");
      successMessage.value = "";
      errorMessage.value = "";

      try {
        await axios.put(`http://127.0.0.1:8000/materials/${route.params.id}`, material.value, {
          headers: { Authorization: `Bearer ${token}` },
        });
        successMessage.value = "Material actualizado correctamente.";
        setTimeout(() => router.push("/manage-materials"), 1500); // Redirige después de 1.5s
      } catch (error) {
        errorMessage.value = "Error al actualizar el material.";
      }
    };

    onMounted(fetchMaterial);

    return { material, errorMessage, successMessage, updateMaterial };
  },
};
</script>

<template>
  <div class="dashboard">
    <Navbar />

    <div class="container">
      <h1>Editar Material</h1>

      <p v-if="successMessage" class="success">{{ successMessage }}</p>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

      <form @submit.prevent="updateMaterial">
        <label>Tipo de Material:</label>
        <select v-model="material.tipo_material" required>
          <option value="">Selecciona el tipo de material</option>
          <option value="CANON">CANON</option>
          <option value="COMPUTADORA">COMPUTADORA</option>
          <option value="EXTENSION">EXTENSION</option>
        </select>

        <label>Marca:</label>
        <input type="text" v-model="material.marca" required />

        <label>Modelo:</label>
        <input type="text" v-model="material.modelo" required />

        <label>Estado:</label>
        <select v-model="material.estatus" required>
            <option value="">Selecciona el estatus</option>
            <option value="DISPONIBLE">Disponible</option>
            <option value="PRESTADO">Prestado</option>
            <option value="EN_MANTENIMIENTO">En Mantenimiento</option>
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
