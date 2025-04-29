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
    <main :class="!hideNavBar ? 'papi' : ''">
      <NavBar v-if="!hideNavBar" />
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.papi {
  display: flex;
  align-items: stretch;
  flex-direction: row;
  flex-wrap: nowrap;
}
</style>

  