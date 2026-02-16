<template>
  <nav class="navbar">
    <ul class="nav-list">
      <!-- No logueado -->
      <template v-if="!userStore.user">
        <li><router-link to="/register">Register</router-link></li>
        <li><router-link to="/login">Login</router-link></li>
      </template>

      <!-- Logueado -->
      <template v-else>
        <li><router-link to="/tasks">Tareas</router-link></li>
        <li v-if="userStore.user.rol === 'admin'"><router-link to="/users">Usuarios</router-link></li>
        <li><button @click="handleLogout">Logout</button></li>
      </template>
    </ul>
  </nav>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/useUser"; // tu Pinia store

const router = useRouter();
const userStore = useUserStore();

// Cargar user desde localStorage al iniciar
onMounted(() => {
  userStore.loadUser();
});

const handleLogout = () => {
  userStore.logout();
  router.push("/login");
};
</script>

<style scoped>
/* Navbar general */
.navbar {
  display: flex;
  justify-content: center; /* enlaces centrados */
  align-items: center;
  padding: 1rem 2rem;
  background-color: #1c1c1c; /* color oscuro profundo */
  color: white;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  position: sticky;
  top: 0;
  z-index: 100;
}

/* Lista de enlaces */
.navbar ul {
  list-style: none;
  display: flex;
  gap: 2rem; /* espacio entre enlaces */
  padding: 0;
  margin: 0;
}

/* Enlaces */
.navbar a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s, color 0.2s;
}

.navbar a:hover {
  background-color: #3498db; /* azul brillante al pasar el mouse */
  color: white;
}

/* Enlaces activos */
.navbar a.active {
  background-color: #e67e22; /* naranja destacado para la página activa */
  color: white;
}

</style>
