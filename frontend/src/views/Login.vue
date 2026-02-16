<template>
  <div class="form-container">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div v-if="error" class="error">{{ error }}</div>

      <input v-model="correo" type="email" placeholder="Correo" required />
      <input v-model="contraseña" type="password" placeholder="Contraseña" required />

      <button type="submit">Ingresar</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/useUser";

const router = useRouter();
const userStore = useUserStore();

const correo = ref('');
const contraseña = ref('');
const error = ref('');

const login = async () => {
  try {
    error.value = '';
    const res = await fetch('/api/login', {  // <-- usando proxy de Vite
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: correo.value, contraseña: contraseña.value })
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Credenciales incorrectas');
    }

    const data = await res.json();

    // Guardar user y token en Pinia
    userStore.setUser(data.user, data.token);

    // Redirigir a tareas
    router.push('/tasks');

  } catch (err) {
    error.value = err.message;
  }
};
</script>

<style src="../assets/styles.css"></style>
