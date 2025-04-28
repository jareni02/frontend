<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Navbar from "../components/Navbar.vue";

export default {
  components: { Navbar },
  setup() {
    const router = useRouter();
    const users = ref([]);
    const loading = ref(true);
    const errorMessage = ref("");
    
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        users.value = response.data;
      } catch (error) {
        errorMessage.value = "Error al obtener los usuarios.";
      } finally {
        loading.value = false;
      }
    };

    const deleteUser = async (id) => {
      const token = localStorage.getItem("token");
      if (confirm("¿Estás seguro de eliminar este usuario?")) {
        try {
          await axios.delete(`http://127.0.0.1:8000/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          users.value = users.value.filter(user => user.id !== id);
        } catch (error) {
          alert("Error al eliminar el usuario.");
        }
      }
    };

    const editUser = (id) => {
      router.push(`/edit-user/${id}`);
    };

    onMounted(fetchUsers);

    return { users, errorMessage, loading, deleteUser, editUser };
  },
};
</script>

<template>
  <div class="dashboard">
    <Navbar />

    <div class="container">
      <h1>Gestión de Usuarios</h1>
      <p class="subtitle">Administra los usuarios registrados en el sistema</p>

      <div v-if="loading" class="loading">Cargando usuarios...</div>
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

      <div v-else>
        <table class="user-table">
  <thead>
    <tr>
      <th>ID</th>
      <th>Nombre</th>
      <th>Primer Apellido</th>
      <th>Segundo Apellido</th>
      <th>Tipo de Usuario</th>
      <th>Nombre de Usuario</th>
      <th>Email</th>
      <th>Teléfono</th>
      <th>Estatus</th>
      <th>Acciones</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="user in users" :key="user.id">
      <td>{{ user.id }}</td>
      <td>{{ user.nombre }}</td>
      <td>{{ user.primer_apellido }}</td>
      <td>{{ user.segundo_apellido }}</td>
      <td>{{ user.tipo_usuario }}</td>
      <td>{{ user.nombre_usuario }}</td>
      <td>{{ user.correo_electronico }}</td>
      <td>{{ user.numero_telefono }}</td>
      <td>{{ user.estatus }}</td>
      <td>
        <button class="btn btn-edit" @click="editUser(user.id)">Editar</button>
        <button class="btn btn-delete" @click="deleteUser(user.id)">Eliminar</button>
      </td>
    </tr>
  </tbody>
</table>

      </div>
    </div>
  </div>
</template>

<style>
/* Contenedor principal */
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

/* Tabla de usuarios */
.user-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}

.user-table th, .user-table td {
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

.user-table th {
  background: #f2f2f2;
  font-weight: bold;
}

.user-table tr:hover {
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
