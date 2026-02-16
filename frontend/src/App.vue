<script setup>
import NavBar from './views/NavBar.vue';
import { RouterLink } from 'vue-router';
import { RouterView } from 'vue-router';
fetch('/api/saludo')
  .then(res => res.json())
  .then(data => console.log(data.mensaje))
  </script>

<template>
  <NavBar></NavBar>

  <div>
    <RouterView></RouterView>
  </div>

</template>

<style scoped></style>
