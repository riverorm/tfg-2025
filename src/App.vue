<script setup>
import { RouterView, useRoute } from 'vue-router';
import NavBar from './components/NavbarComponent.vue';
import { computed } from 'vue';

const route = useRoute()
const hideNavbarRoutes = ['Login', 'Register', 'Group'];
const hideNavBar = computed (() => hideNavbarRoutes.includes(route.name));
</script>

<template>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">

  <div id="app">
    <main :class="!hideNavBar ? 'with-layout' : ''">
      <NavBar v-if="!hideNavBar" />
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
main.with-layout {
  display: flex;
  align-items: stretch;
  flex-direction: row;
  flex-wrap: nowrap;
  padding: 0 1.5rem;
  box-sizing: border-box;
  min-height: 100vh; /* CAMBIO CLAVE */
  overflow-y: auto;  /* PERMITE scroll si necesario */
}

main.with-layout > *:not(nav) {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 1.5rem;
}

</style>


  