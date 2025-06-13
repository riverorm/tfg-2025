<template>
  <div class="calendar-container">
    <div class="calendar-header">
      <button class="nav-button" @click="prevWeek">← Semana anterior</button>
      <div class="week-range">{{ formattedWeekRange }}</div>
      <button class="nav-button" @click="nextWeek">Semana siguiente →</button>
    </div>

    <div v-if="loading">Cargando tareas...</div>

    <div class="calendar-days">
      <div v-for="day in weekDays" :key="day.id" class="calendar-day"
        :class="{ today: dayjs().isSame(day.date, 'day') }">
        <div class="day-name">{{ day.date.format('dddd') }}</div>
        <div class="day-date">{{ day.date.format('D') }}</div>

        <div class="day-tasks">
          <div v-for="task in day.tasks" :key="task.id" class="task-title" :class="{
            'task-title__done': task.isDone,
            'task-title__overdue': task.isOverdue
          }">
            <input type="checkbox" class="isdone-checkbox" :checked="task.isDone"
              @change="() => toggleTaskCompletion(task)" 
              :aria-label="`Marcar tarea '${task.task}' como completada`" />
            <span class="task-name">{{ task.task }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import { listenTasksAssignments } from '@/utils/listenTasksAssignments'
import { getTasksInDay } from '@/utils/getTasksInDay'
import { markTaskAsDone } from '@/utils/markTaskAsDone'
import { markTaskAsUndone } from '@/utils/markTaskAsUndone'

const currentDate = ref(dayjs())
const tasks = ref([])
const loading = ref(true)


onMounted(() => {
  listenTasksAssignments((tasksFromDatabase) => {
    console.log('Tareas recibidas:', tasksFromDatabase)
    tasks.value = tasksFromDatabase
    loading.value = false
  })
})

const weekDays = computed(() => {
  const startOfWeek = currentDate.value.startOf('week') // Lunes
  return Array.from({ length: 7 }, (_, i) => {
    const date = startOfWeek.add(i, 'day')
    const dateTasks = getTasksInDay(date.toDate(), tasks.value)

    const tasksWithOverdueFlag = dateTasks.map(task => ({
      ...task,
      isOverdue: !task.isDone && dayjs(task.date.toDate ? task.date.toDate() : task.date).isBefore(dayjs(), 'day'),
    }))

    return {
      id: date.toISOString(),
      date,
      day: date.format('DD'),
      month: date.format('MM'),
      year: date.format('YYYY'),
      tasks: tasksWithOverdueFlag,
      isDone: tasksWithOverdueFlag.length > 0 && tasksWithOverdueFlag.every(t => t.isDone),
    }
  })
})


const nextWeek = () => currentDate.value = currentDate.value.add(7, 'day')
const prevWeek = () => currentDate.value = currentDate.value.subtract(7, 'day')

const formattedWeekRange = computed(() => {
  const first = weekDays.value[0].date.format('DD MMM')
  const last = weekDays.value[6].date.format('DD MMM YYYY')
  return `${first} - ${last}`
})

function toggleTaskCompletion(task) {
  task.isDone ? markTaskAsUndone(task.id) : markTaskAsDone(task.id)
}
</script>

<style scoped>
.calendar-container {
  margin-top: 2rem; /* o más, según necesidad */
  padding-top: 1.5rem;
  max-width: 1000px;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  background: #eeededc0;
  border-radius: 5px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.295);
  font-family: 'Segoe UI', sans-serif;
  /* Asegurarse que no tenga overflow oculto */
  overflow: visible;
}



.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.week-range {
  font-weight: 600;
  font-size: 1.1rem;
  color: #333;
}

.calendar-day.today {
  border: 2px solid #da880f;
  background-color: #fff7e9;
}

.nav-button {
  background-color: #f0f0f0;
  border: none;
  font-size: 1.2rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.nav-button:hover {
  background-color: #e0e0e0;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  justify-items: center;      /* Centra cada día */
  justify-content: center;    /* Centra el grid completo */
}

.calendar-day {
  background-color: #fafafa;
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  box-shadow: inset 0 0 0 1px #e0e0e0;
  transition: transform 0.2s;
  width: 100%;
  max-width: 150px;    /* Para que no se estire en móviles */
}

.calendar-day:hover {
  transform: translateY(-3px);
  background-color: #f5f5f5;
}

.day-name {
  font-weight: 600;
  color: #555;
  margin-bottom: 0.25rem;
}

.day-date {
  font-size: 1.4rem;
  font-weight: bold;
  color: #222;
}

.day-tasks {
  margin-top: 0.5rem;
  max-height: 150px;
  overflow-y: hidden; /* Elimina el scroll */
}

.task-title {
  position: relative;
  font-size: 0.95rem;
  margin: 0.25rem 0;
  padding: 0 0.5rem;
  text-align: left;
  display: flex;
  align-items: center;
}

.task-title__done {
  text-decoration: line-through;
  color: #888;
}

.isdone-checkbox {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid gray;
  border-radius: 50%;
  outline: none;
  cursor: pointer;
  margin-right: 10px;
  background-color: white;
}

.isdone-checkbox:checked {
  background-color: rgba(72, 214, 72, 0.793);
  border-color: green;
}

.isdone-checkbox:checked::after {
  content: '✓';
  color: white;
  font-weight: bold;
  display: block;
  text-align: center;
  font-size: 14px;
}

.task-title__overdue {
  color: rgb(194, 45, 45);
  font-weight: bold;
}

.task-title__overdue .task-name::after {
  content: ' ⚠️';
}

/* Responsive */
@media (max-width: 1024px) {
  .calendar-days {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 768px) {
  .calendar-header {
    flex-direction: column;
    gap: 1rem;
  }

  .calendar-days {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .calendar-days {
    grid-template-columns: 1fr;
  }

  .calendar-day {
    padding: 0.75rem;
  }

  .nav-button {
    font-size: 1rem;
    padding: 0.4rem 0.8rem;
  }

  .week-range {
    font-size: 1rem;
  }
}


</style>
