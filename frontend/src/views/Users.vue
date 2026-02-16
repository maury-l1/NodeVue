<template>
    <div class="users-container">
        <h2>Usuarios</h2>
        <ul class="user-list">
            <li v-for="user in users" :key="user.id" class="user-item">
                <span class="user-info">
                    <strong>{{ user.nombre }} {{ user.apellido }}</strong> - {{ user.correo }} ({{ user.rol }})
                </span>
                <button class="btn-delete" @click="deleteUser(user.id)">Eliminar</button>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/useUser";

const userStore = useUserStore();
const users = ref([]);
const error = ref('');

// Fetch todos los usuarios
const fetchUsers = async () => {
    try {
        const res = await fetch('/api/users', {
            headers: { Authorization: `Bearer ${userStore.token}` }
        });

        if (!res.ok) throw new Error('Error al obtener usuarios');

        users.value = await res.json();
    } catch (err) {
        error.value = err.message;
    }
};

// Eliminar usuario
const deleteUser = async (id) => {
    if (!confirm('¿Seguro que quieres eliminar este usuario?')) return;

    try {
        const res = await fetch(`/api/users/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${userStore.token}` }
        });

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Error al eliminar usuario');
        }

        // Quitar usuario de la lista local
        users.value = users.value.filter(u => u.id !== id);

    } catch (err) {
        alert(err.message);
    }
};

onMounted(fetchUsers);
</script>

<style src="../assets/styles.css"></style>
