<template> 
  <div class="insert-prestamo">
    <Navbar />

    <div class="container">
      <h1>Nuevo Préstamo</h1>
      <p class="subtitle">Ingresa los detalles para crear un nuevo préstamo</p>

      <form @submit.prevent="submitLoan">
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
          <input type="datetime-local" v-model="loan.fecha_prestamo" required />
        </div>

        <div class="form-group">
          <label for="fecha_devolucion">Fecha de Devolución:</label>
          <input type="datetime-local" v-model="loan.fecha_devolucion" required />
        </div>

        <div class="form-group">
          <label for="estatus_prestamo">Estatus:</label>
          <select v-model="loan.estatus_prestamo" required>
            <option value="ACTIVO">Activo</option>
            <option value="DEVUELTO">Devuelto</option>
            <option value="VENCIDO">Vencido</option>
          </select>
        </div>

        <button type="submit" class="btn btn-submit">Crear Préstamo</button>
      </form>

      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, toRaw } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import Navbar from "../components/Navbar.vue";

export default {
  components: { Navbar },
  setup() {
    const router = useRouter();
    const materiales = ref([]);
    const usuarios = ref([]); // Lista de usuarios
    const loan = ref({
      id_material: "",
      id_usuario: "", // Ahora se elige manualmente
      fecha_prestamo: "",
      fecha_devolucion: "",
      estatus_prestamo: "ACTIVO",
    });
    const errorMessage = ref("");

    const fetchMaterials = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/"); // Redirige si no hay token
        return;
      }

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
      if (!token) {
        router.push("/"); // Redirige si no hay token
        return;
      }

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

    const submitLoan = async () => {
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
      const plainLoan = {
        ...toRaw(loan.value),
        fecha_prestamo: formatDateTime(loan.value.fecha_prestamo),
        fecha_devolucion: formatDateTime(loan.value.fecha_devolucion),
      };

      console.log("Datos enviados:", plainLoan);

      try {
        await axios.post("http://127.0.0.1:8000/loans", plainLoan, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Préstamo creado exitosamente.");
        router.push("/prestamos"); // Redirigir a la lista de préstamos
      } catch (error) {
        console.error("Error en la API:", error.response?.data || error);
        errorMessage.value = "Error al crear el préstamo.";
      }
    };

    onMounted(() => {
      fetchMaterials();
      fetchUsers();
    });

    return {
      materiales,
      usuarios,
      loan,
      errorMessage,
      submitLoan,
    };
  },
};
</script>

<style scoped>
.insert-prestamo {
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
  background-color: #28a745;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #218838;
}

.error {
  color: red;
  font-size: 16px;
  margin-top: 20px;
}
</style>
