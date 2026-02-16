<template>
  <div class="form-container">
    <h2>Registro</h2>
    <form @submit.prevent="register">
      <div v-if="error" class="error">{{ error }}</div>

      <input v-model="nombre" type="text" placeholder="Nombre" required />
      <input v-model="apellido" type="text" placeholder="Apellido" required />
      <input v-model="correo" type="email" placeholder="Correo" required />
      <input v-model="contraseña" type="password" placeholder="Contraseña" required />
      <select v-model="rol" required>
        <option disabled value="">Selecciona un rol</option>
        <option>admin</option>
        <option>user</option>
      </select>

      <button type="submit">Registrarse</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const nombre = ref('');
const apellido = ref('');
const correo = ref('');
const contraseña = ref('');
const rol = ref('');
const error = ref('');

const register = async () => {
  try {
    error.value = '';
    const res = await fetch('/api/register', {   // <-- proxy de Vite
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: nombre.value,
        apellido: apellido.value,
        correo: correo.value,
        contraseña: contraseña.value,
        rol: rol.value
      })
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Error al registrar');
    }

    const data = await res.json();
    alert(`Usuario ${data.nombre} registrado!`);

    // Limpiar formulario
    nombre.value = '';
    apellido.value = '';
    correo.value = '';
    contraseña.value = '';
    rol.value = '';

    // Redirigir al login
    router.push('/login');

  } catch (err) {
    error.value = err.message;
  }
};
</script>

<style src="../assets/styles.css"></style>
