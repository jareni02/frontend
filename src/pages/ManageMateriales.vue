<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Navbar from "../components/Navbar.vue";

export default {
  components: { Navbar },
  setup() {
    const router = useRouter();
    const materiales = ref([]);
    const loading = ref(true);
    const errorMessage = ref("");

    const fetchMaterials = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/materials", {
          headers: { Authorization: `Bearer ${token}` },
        });
        materiales.value = response.data;
      } catch (error) {
        errorMessage.value = "Error al obtener los materiales.";
      } finally {
        loading.value = false;
      }
    };

    const deleteMaterial = async (id) => {
      const token = localStorage.getItem("token");
      if (confirm("¿Estás seguro de eliminar este material?")) {
        try {
          await axios.delete(`http://127.0.0.1:8000/materials/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          materiales.value = materiales.value.filter(material => material.id !== id);
        } catch (error) {
          alert("Error al eliminar el material.");
        }
      }
    };

    const editMaterial = (id) => {
      router.push(`/edit-material/${id}`);
    };

    // Función para redirigir a la vista de inserción de material
    const goToInsertMaterial = () => {
      router.push("/insertMaterial");
    };

    onMounted(fetchMaterials);

    return { materiales, errorMessage, loading, deleteMaterial, editMaterial, goToInsertMaterial };
  },
};
</script>
<template>
  <div class="dashboard">
    <Navbar />

    <div class="container">
      <h1>Gestión de Materiales</h1>
      <p class="subtitle">Administra los materiales disponibles en el sistema</p>

      <button class="btn btn-add" @click="goToInsertMaterial">Agregar Material</button>

      <div v-if="loading" class="loading">Cargando materiales...</div>
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

      <div v-else>
        <table class="material-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo de Material</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Estatus</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="material in materiales" :key="material.id">
              <td>{{ material.id }}</td>
              <td>{{ material.tipo_material }}</td>
              <td>{{ material.marca }}</td>
              <td>{{ material.modelo }}</td>
              <td>{{ material.estatus }}</td>
              <td>
                <button class="btn btn-edit" @click="editMaterial(material.id)">Editar</button>
                <button class="btn btn-delete" @click="deleteMaterial(material.id)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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
  max-width: 1200px;
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

/* Botón para agregar material */
.btn-add {
  display: block;
  margin-bottom: 15px;
  padding: 10px 15px;
  background-color: #28a745;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-add:hover {
  background-color: #218838;
}

/* Tabla de materiales */
.material-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}

.material-table th, .material-table td {
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

.material-table th {
  background: #f2f2f2;
  font-weight: bold;
}

.material-table tr:hover {
  background: #f5f5f5;
}

/* Botones */
.btn {
  padding: 8px 12px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  margin: 5px;
}

.btn-edit {
  background: #007bff;
  color: white;
}

.btn-delete {
  background: #dc3545;
  color: white;
}

.btn-edit:hover {
  background: #0056b3;
}

.btn-delete:hover {
  background: #c82333;
}

.loading {
  text-align: center;
  font-size: 18px;
  color: #666;
}

.error {
  text-align: center;
  color: red;
  font-size: 16px;
}
</style>
