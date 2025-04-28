<template>
    <div class="edit-loan">
      <Navbar />
  
      <div class="container">
        <h1>Editar Préstamo</h1>
        <p class="subtitle">Modifica los datos del préstamo y guarda los cambios</p>
  
        <form @submit.prevent="updateLoan">
          <div class="form-group">
            <label for="material">Material:</label>
            <select v-model="loan.id_material" required>
              <option v-for="material in materiales" :key="material.id" :value="material.id">
                {{ material.tipo_material }} - {{ material.marca }} - {{ material.modelo }}
              </option>
            </select>
          </div>
  
          <div class="form-group">
            <label for="id_usuario">Usuario:</label>
            <select v-model="loan.id_usuario" required>
              <option v-for="usuario in usuarios" :key="usuario.id" :value="usuario.id">
                {{ usuario.nombre }} (ID: {{ usuario.id }})
              </option>
            </select>
          </div>
  
          <div class="form-group">
            <label for="fecha_prestamo">Fecha de Préstamo:</label>
            <input type="datetime-local" v-model="loan.fecha_prestamo"  />
          </div>
  
          <div class="form-group">
            <label for="fecha_devolucion">Fecha de Devolución:</label>
            <input type="datetime-local" v-model="loan.fecha_devolucion"  />
          </div>
  
          <div class="form-group">
            <label for="estatus_prestamo">Estatus:</label>
            <select v-model="loan.estatus_prestamo" required>
              <option value="ACTIVO">Activo</option>
              <option value="DEVUELTO">Devuelto</option>
              <option value="VENCIDO">Vencido</option>
            </select>
          </div>
  
          <button type="submit" class="btn btn-submit">Guardar Cambios</button>
        </form>
  
        <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, toRaw } from "vue";
  import axios from "axios";
  import { useRouter, useRoute } from "vue-router";
  import Navbar from "../components/Navbar.vue";
  
  export default {
    components: { Navbar },
    setup() {
      const router = useRouter();
      const route = useRoute();
      const loanId = route.params.id; // Obtener ID del préstamo desde la URL
      const materiales = ref([]);
      const usuarios = ref([]);
      const loan = ref({
        id_material: "",
        id_usuario: "",
        fecha_prestamo: "",
        fecha_devolucion: "",
        estatus_prestamo: "ACTIVO",
      });
      const errorMessage = ref("");
  
      const fetchLoanDetails = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/"); // Redirige si no hay token
          return;
        }
  
        try {
          const response = await axios.get(`http://127.0.0.1:8000/loans/${loanId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          loan.value = response.data;
        } catch (error) {
          errorMessage.value = "Error al obtener los detalles del préstamo.";
        }
      };
  
      const fetchMaterials = async () => {
        const token = localStorage.getItem("token");
        try {
          const response = await axios.get("http://127.0.0.1:8000/materials", {
            headers: { Authorization: `Bearer ${token}` },
          });
          materiales.value = response.data;
        } catch (error) {
          errorMessage.value = "Error al obtener los materiales.";
        }
      };
  
      const fetchUsers = async () => {
        const token = localStorage.getItem("token");
        try {
          const response = await axios.get("http://127.0.0.1:8000/users", {
            headers: { Authorization: `Bearer ${token}` },
          });
          usuarios.value = response.data;
        } catch (error) {
          errorMessage.value = "Error al obtener los usuarios.";
        }
      };
  
      const formatDateTime = (dateTime) => {
        return dateTime.replace("T", " ") + ":00"; // Convertir a formato compatible con MySQL
      };
  
      const updateLoan = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/"); // Redirige si no hay token
          return;
        }
  
        if (!loan.value.id_usuario) {
          errorMessage.value = "Debes seleccionar un usuario.";
          return;
        }
  
        // Convertir fechas a formato compatible con MySQL
        const updatedLoan = {
          ...toRaw(loan.value),
          fecha_prestamo: formatDateTime(loan.value.fecha_prestamo),
          fecha_devolucion: formatDateTime(loan.value.fecha_devolucion),
        };
  
        try {
          await axios.put(`http://127.0.0.1:8000/loans/${loanId}`, updatedLoan, {
            headers: { Authorization: `Bearer ${token}` },
          });
          alert("Préstamo actualizado exitosamente.");
          router.push("/prestamos");
        } catch (error) {
          console.error("Error en la API:", error.response?.data || error);
          errorMessage.value = "Error al actualizar el préstamo.";
        }
      };
  
      onMounted(() => {
        fetchLoanDetails();
        fetchMaterials();
        fetchUsers();
      });
  
      return {
        loan,
        materiales,
        usuarios,
        errorMessage,
        updateLoan,
      };
    },
  };
  </script>
  
  <style scoped>
  .edit-loan {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
  }
  
  .container {
    width: 80%;
    max-width: 800px;
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
    font-size: 16px;
    color: #333;
    display: block;
  }
  
  select, input {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border-radius: 5px;
    border: 1px solid #ddd;
  }
  
  button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  
  .error {
    color: red;
    font-size: 16px;
    margin-top: 20px;
  }
  </style>
  