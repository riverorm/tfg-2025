import { isSameDay } from '@/utils/isSameDay.js'

export const getTasksInDay = (date, tasks) => {
  const tasksInDay = []

  tasks.forEach((task) => {
    const dateTask = new Date(task.date)

    if (isSameDay(date, dateTask)) {
      tasksInDay.push(task)
    }
  })

  return tasksInDay
}