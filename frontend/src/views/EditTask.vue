<template>
  <div class="tasks-container">
    <h2>Editar Tarea</h2>

    <form @submit.prevent="updateTask" class="task-form">
      <input v-model="title" type="text" placeholder="Título" required />
      <textarea v-model="description" placeholder="Descripción" required></textarea>
      <div class="task-form-buttons">
        <button type="submit" class="btn-primary">Guardar</button>
        <button type="button" class="btn-delete" @click="cancel">Cancelar</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/useUser";

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

const title = ref('');
const description = ref('');
const taskId = route.params.id;

// Fetch datos de la tarea
const fetchTask = async () => {
  const res = await fetch(`/api/tasks/${taskId}`, {
    headers: { Authorization: `Bearer ${userStore.token}` }
  });
  const data = await res.json();
  title.value = data.title;
  description.value = data.description;
};

// Actualizar tarea
const updateTask = async () => {
  const res = await fetch(`/api/tasks/${taskId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userStore.token}` },
    body: JSON.stringify({ title: title.value, description: description.value })
  });
  if (res.ok) router.push('/tasks');
};

// Cancelar edición
const cancel = () => {
  router.push('/tasks');
};

onMounted(fetchTask);
</script>

<style src="../assets/styles.css"></style>
