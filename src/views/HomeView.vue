<script setup>
import CalendarComponent from '@/components/CalendarComponent.vue';
import DoneList from '@/components/DoneList.vue';
import TaskTabs from '@/components/TaskTabs.vue';
import UndoneList from '@/components/UndoneList.vue';
</script>

<template>
  <div class="container animate-appear">
    <div class="calendar-container">
      <CalendarComponent />
    </div>
    
    <div class="lists-container">
      <TaskTabs />
    </div>
  </div>
</template>

  
  
  
<style scoped>
.container {
  width: calc(100% - 250px);
  height: 100vh;               /* Altura total del viewport */
  display: flex;
  flex-direction: column;
  padding: 10px;
}

/* El calendario fijo o sticky arriba */
.calendar-container {
  margin-top: 2rem; /* o más, según necesidad */
  padding-top: 1.5rem;
  max-width: 1000px;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  font-family: 'Segoe UI', sans-serif;
  /* Asegurarse que no tenga overflow oculto */
  overflow: visible;
}

/* El área scrollable con las tareas */
.lists-container {
  width: 100%;
  max-width: 900px;
  margin: auto;
  background-color: #ffffff7a;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}


  </style>

