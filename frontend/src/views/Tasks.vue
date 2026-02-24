<template>
  <div class="tasks-container">
    <h2>Tareas</h2>

    <!-- Botón para crear nueva tarea -->
    <button class="btn-primary" @click="showForm = !showForm">
      {{ showForm ? 'Cancelar' : 'Crear Nueva Tarea' }}
    </button>

    <!-- Formulario para nueva tarea -->
    <form v-if="showForm" @submit.prevent="createTask" class="task-form">
      <input v-model="title" type="text" placeholder="Título" required />
      <textarea v-model="description" placeholder="Descripción" required></textarea>
      <button type="submit" class="btn-primary">Guardar Tarea</button>
    </form>

    <!-- Lista de tareas -->
    <ul class="task-list">
      <li v-for="task in tasks" :key="task.id" class="task-item">
        <span class="task-info">
          <strong>{{ task.title }}</strong> - {{ task.description }}
        </span>
        <div class="task-buttons">
          <button class="btn-primary" @click="goToEdit(task.id)">Editar</button>
          <button class="btn-delete" @click="deleteTask(task.id)">Eliminar</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/useUser";
const userStore = useUserStore();
const router = useRouter();

const tasks = ref([]);
const showForm = ref(false);
const title = ref('');
const description = ref('');

// Fetch tareas
const fetchTasks = async () => {
  const res = await fetch('/api/tasks', {
    headers: { Authorization: `Bearer ${userStore.token}` },
  });
  tasks.value = await res.json();
};

// Crear tarea
const createTask = async () => {
  const res = await fetch('/api/createTask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userStore.token}` },
    body: JSON.stringify({ title: title.value, description: description.value })
  });
  const newTask = await res.json();
  tasks.value.push(newTask);
  title.value = '';
  description.value = '';
  showForm.value = false;
};

// Redirigir a EditTask.vue
const goToEdit = (id) => {
  console.log(userStore.token)
  router.push(`/tasks/edit/${id}`);
};

// Eliminar tarea
const deleteTask = async (id) => {
  if (!confirm('¿Seguro que quieres eliminar esta tarea?')) return;
  const res = await fetch(`/api/tasks/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${userStore.token}` }
  });
  if (res.ok) tasks.value = tasks.value.filter(t => t.id !== id);
};

onMounted(fetchTasks);
</script>

<style src="../assets/styles.css"></style>
