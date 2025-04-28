<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Navbar from "../components/Navbar.vue";

export default {
  components: { Navbar },
  setup() {
    const router = useRouter();
    const prestamos = ref([]);
    const loading = ref(true);
    const errorMessage = ref("");

    const fetchLoans = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/loans", {
          headers: { Authorization: `Bearer ${token}` },
        });
        prestamos.value = response.data;
      } catch (error) {
        errorMessage.value = "Error al obtener los préstamos.";
      } finally {
        loading.value = false;
      }
    };

    const deleteLoan = async (id) => {
      const token = localStorage.getItem("token");
      if (confirm("¿Estás seguro de eliminar este préstamo?")) {
        try {
          await axios.delete(`http://127.0.0.1:8000/loans/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          prestamos.value = prestamos.value.filter(prestamo => prestamo.id !== id);
        } catch (error) {
          alert("Error al eliminar el préstamo.");
        }
      }
    };

    const editLoan = (id) => {
      router.push(`/edit-loan/${id}`);
    };

    // Función para redirigir a la vista de inserción de préstamo
    const goToInsertLoan = () => {
      router.push("/insertLoan");
    };

    onMounted(fetchLoans);

    return { prestamos, errorMessage, loading, deleteLoan, editLoan, goToInsertLoan };
  },
};
</script>

<template>
  <div class="dashboard">
    <Navbar />

    <div class="container">
      <h1>Gestión de Préstamos</h1>
      <p class="subtitle">Administra los préstamos de materiales</p>

      <button class="btn btn-add" @click="goToInsertLoan">Agregar Préstamo</button>

      <div v-if="loading" class="loading">Cargando préstamos...</div>
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

      <div v-else>
        <table class="loan-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>ID Usuario</th>
              <th>ID Material</th>
              <th>Fecha Préstamo</th>
              <th>Fecha Devolución</th>
              <th>Estatus</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="prestamo in prestamos" :key="prestamo.id">
              <td>{{ prestamo.id }}</td>
              <td>{{ prestamo.id_usuario }}</td>
              <td>{{ prestamo.id_material }}</td>
              <td>{{ prestamo.fecha_prestamo }}</td>
              <td>{{ prestamo.fecha_devolucion }}</td>
              <td>{{ prestamo.estatus_prestamo }}</td>
              <td>
                <button class="btn btn-edit" @click="editLoan(prestamo.id)">Editar</button>
                <button class="btn btn-delete" @click="deleteLoan(prestamo.id)">Eliminar</button>
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

/* Botón para agregar préstamo */
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

/* Tabla de préstamos */
.loan-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}

.loan-table th, .loan-table td {
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

.loan-table th {
  background: #f2f2f2;
  font-weight: bold;
}

.loan-table tr:hover {
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
