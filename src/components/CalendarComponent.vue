<template>
  <div class="calendar-container">
    <div class="calendar-header">
      <button class="nav-button" @click="prevWeek">←</button>
      <span class="week-range">{{ formattedWeekRange }}</span>
      <button class="nav-button" @click="nextWeek">→</button>
    </div>

    <div class="calendar-days">
      <div 
        v-for="(day, index) in weekDays" 
        :key="index" 
        class="calendar-day"
        :class = "{ 'today': day.isSame(today, 'day') }"
      >
        <div class="day-name">{{ day.format('ddd') }}</div>
        <div class="day-date">{{ day.format('DD') }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import dayjs from 'dayjs'

const currentDate = ref(dayjs())
const today = dayjs()

const weekDays = computed(() => {
  const startOfWeek = currentDate.value.startOf('week')
  return Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, 'day'))
})

const nextWeek = () => {
  currentDate.value = currentDate.value.add(7, 'day')
}

const prevWeek = () => {
  currentDate.value = currentDate.value.subtract(7, 'day')
}

const formattedWeekRange = computed(() => {
  const first = weekDays.value[0].format('DD MMM')
  const last = weekDays.value[6].format('DD MMM YYYY')
  return `${first} - ${last}`
})
</script>

<style scoped>
.calendar-container {
  max-width: 1000px;
  width: 90%;
  margin: 2rem auto;
  padding: 1.5rem;
  background: #eeededc0;
  border-radius: 5px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.295);
  font-family: 'Segoe UI', sans-serif;
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
}

.calendar-day {
  background-color: #fafafa;
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  box-shadow: inset 0 0 0 1px #e0e0e0;
  transition: transform 0.2s;
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
</style>
