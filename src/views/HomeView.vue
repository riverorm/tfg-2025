<script setup>
import CalendarComponent from '@/components/CalendarComponent.vue';
import DoneList from '@/components/DoneList.vue';
import TaskTabs from '@/components/TaskTabs.vue';
import UndoneList from '@/components/UndoneList.vue';
</script>

<template>
    <div class="container animate-appear">
      <CalendarComponent />
  
    <div class="lists">
      <TaskTabs />
    </div>
  </div>
</template>
  
  
  
<style scoped>
.container {
  width: calc(100% - 250px);
  max-height: 100dvh;
  display: flex;
  flex-direction: column;
  padding: 10px;
  overflow-y: auto;
}

.lists {
  height: auto;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1rem;
  padding-top: 10px;
}
  </style>

