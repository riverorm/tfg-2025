import { isSameDay } from '@/utils/isSameDay.js'

export const getTasksInDay = (date, tasks) => {
  console.log('Buscando tareas para la fecha:', date)
  const tasksInDay = tasks.filter(task => isSameDay(date, new Date(task.date)))
  console.log('Tareas encontradas:', tasksInDay)
  return tasksInDay
}
