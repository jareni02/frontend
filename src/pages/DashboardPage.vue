<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Navbar from "../components/Navbar.vue"; // Importamos la barra de navegación

export default {
  components: { Navbar },
  setup() {
    const router = useRouter();
    const loading = ref(true);
    const errorMessage = ref("");

    // Datos dinámicos desde la API
    const totalUsuarios = ref(0);
    const totalMateriales = ref(0);
    const totalPrestamos = ref(0);

    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      try {
        // Peticiones a la API
        const [usuariosRes, materialesRes, prestamosRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/users", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://127.0.0.1:8000/materials", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://127.0.0.1:8000/loans", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        totalUsuarios.value = usuariosRes.data.length;
        totalMateriales.value = materialesRes.data.length;
        totalPrestamos.value = prestamosRes.data.length;
      } catch (error) {
        errorMessage.value = "Error al obtener los datos.";
      } finally {
        loading.value = false;
      }
    };

    // Función para redirigir a la gestión de usuarios
    const goToManageUsers = () => {
      router.push("/manage-users");
    };

    // Función para redirigir a la gestión de materiales
    const goMateriales = () => {
      router.push("/materiales");
    };

    // Función para redirigir a la gestión de préstamos
    const goprestamos = () => {
      router.push("/prestamos");
    };

    onMounted(fetchDashboardData);

    return { totalUsuarios, totalMateriales, totalPrestamos, errorMessage, loading, goToManageUsers, goMateriales, goprestamos };
  },
};
</script>

<template>
  <div class="dashboard">
    <Navbar />

    <div class="container">
      <h1>Recursos</h1>
      <p class="subtitle">Administra los recursos de tu escuela</p>

      <div v-if="loading" class="loading">Cargando datos...</div>

      <div v-else>
        <!-- Sección de Resumen -->
        <section class="summary">
          <h2>Resumen</h2>
          <div class="cards">
            <div class="card">
              <p class="title">Usuarios</p>
              <p class="number">{{ totalUsuarios }}</p>
            </div>
            <div class="card">
              <p class="title">Materiales</p>
              <p class="number">{{ totalMateriales }}</p>
            </div>
            <div class="card">
              <p class="title">Préstamos</p>
              <p class="number">{{ totalPrestamos }}</p>
            </div>
          </div>
        </section>

        <!-- Sección de Gestión -->
        <section class="manage">
          <h2>Gestionar</h2>
          <div class="cards">
            <div class="card">
              <p class="title">Usuarios</p>
              <p class="number">{{ totalUsuarios }}</p>
              <button class="btn" @click="goToManageUsers">Gestionar</button> <!-- Redirige a /manage-users -->
            </div>
            <div class="card">
              <p class="title">Materiales</p>
              <p class="number">{{ totalMateriales }}</p>
              <button class="btn" @click="goMateriales">Gestionar</button>
            </div>
            <div class="card">
              <p class="title">Préstamos</p>
              <p class="number">{{ totalPrestamos }}</p>
              <button class="btn" @click="goprestamos">Gestionar</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style>
/* Estilos generales */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f4f7f6;
  margin: 0;
  padding: 0;
}

.dashboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
}

.container {
  width: 90%;
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
}

h1 {
  font-size: 32px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 10px;
}

.subtitle {
  color: #7f8c8d;
  font-size: 18px;
  margin-bottom: 30px;
}

.summary, .manage {
  margin-top: 40px;
}

h2 {
  font-size: 26px;
  font-weight: 600;
  color: #34495e;
  margin-bottom: 20px;
}

.cards {
  display: flex;
  gap: 20px;
  justify-content: space-between;
  flex-wrap: wrap;
}

.card {
  background: #ffffff;
  padding: 25px;
  flex: 1;
  text-align: center;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.title {
  font-size: 20px;
  font-weight: 600;
  color: #34495e;
}

.number {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin-top: 10px;
}

.btn {
  display: block;
  width: 100%;
  margin-top: 20px;
  padding: 12px;
  background-color: #3498db;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #2980b9;
}

.loading {
  text-align: center;
  font-size: 20px;
  color: #7f8c8d;
  margin-top: 50px;
}

/* Estilos responsivos */
@media (max-width: 768px) {
  .cards {
    flex-direction: column;
  }

  .card {
    margin-bottom: 20px;
  }

  h1 {
    font-size: 28px;
  }

  h2 {
    font-size: 24px;
  }

  .title {
    font-size: 18px;
  }

  .number {
    font-size: 24px;
  }

  .btn {
    font-size: 14px;
  }
}
</style>
