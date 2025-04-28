import { createRouter, createWebHistory } from "vue-router";
import LoginForm from "../components/LoginForm.vue";
import RegisterPage from "../pages/RegisterPage.vue";
import DashboardPage from "../pages/DashboardPage.vue";
import ManageUsers from "../pages/ManageUsers.vue";
import EditUser from "../pages/EditUser.vue";
import ManageMateriales from "../pages/ManageMateriales.vue";
import InsertMaterial from "../pages/InsertMaterial.vue";
import EditMaterial from "../pages/EditMaterial.vue";
import ManagePrestamos from "../pages/ManagePrestamos.vue"; // Nueva importación
import insertprestamo from "../pages/insertprestamo.vue";
import editloan from "../pages/editloan.vue";
const routes = [
  { path: "/", component: LoginForm },
  { path: "/register", component: RegisterPage },
  {
    path: "/dashboard",
    component: DashboardPage,
    meta: { requiresAuth: true }, // ✅ Ruta protegida
  },
  {
    path: "/manage-users",
    component: ManageUsers,
    meta: { requiresAuth: true }, // ✅ Ruta protegida
  },
  {
    path: "/edit-user/:id",
    component: EditUser,
    meta: { requiresAuth: true }, // ✅ Ruta protegida
  },
  {
    path: "/materiales", // ✅ Ruta para gestionar materiales
    component: ManageMateriales,
    meta: { requiresAuth: true }, // ✅ Ruta protegida
  },
  {
    path: '/insertMaterial', component: InsertMaterial,
    meta: { requiresAuth: true }, // ✅ Ruta protegida
  },
  {
    path: '/edit-material/:id', component: EditMaterial,
    meta: { requiresAuth: true }, // ✅ Ruta protegida
  },
  {
    path: "/prestamos", // ✅ Ruta para gestionar préstamos
    component: ManagePrestamos,
    meta: { requiresAuth: true }, // ✅ Ruta protegida
  },
  {
    path: "/insertLoan", // ✅ Ruta para gestionar préstamos
    component: insertprestamo,
    meta: { requiresAuth: true }, // ✅ Ruta protegida
  },
  {
    path: "/edit-loan/:id", // ✅ Ruta para gestionar préstamos
    component: editloan,
    meta: { requiresAuth: true }, // ✅ Ruta protegida
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ✅ Middleware para proteger rutas
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  if (to.meta.requiresAuth && !token) {
    next("/"); // Si no hay token, redirigir al login
  } else {
    next();
  }
});

export default router;
