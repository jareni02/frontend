<script>
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();

    const logout = () => {
      localStorage.removeItem("token");
      router.push("/");
    };

    return { logout };
  },
};
</script>

<template>
  <nav class="navbar">
    <div class="navbar-logo">
      <h1>Sistema de gestión de recursos para escuelas</h1>
    </div>
    <button class="logout" @click="logout">
      <i class="fa fa-sign-out-alt"></i> Cerrar sesión
    </button>
  </nav>
</template>

<style scoped>
/* Navbar */
.navbar {
  width: 100%;
  background: #2c3e50;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.navbar-logo h1 {
  font-size: 22px;
  font-weight: 600;
  color: #ecf0f1;
  margin: 0;
}

.logout {
  background: #e74c3c;
  color: white;
  font-size: 16px;
  padding: 10px 20px;
  border: none;
  margin-right: 50px;
  margin-left: 200px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.logout i {
  margin-right: 8px;
}

.logout:hover {
  background: #c0392b;
}

.logout:focus {
  outline: none;
}
</style>
