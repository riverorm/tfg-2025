<template>
  <div class="task-tabs-container">
    <div class="tabs">
      <button
        :class="{ active: selectedTab === 'undone' }"
        @click="selectedTab = 'undone'"
      >
        Tareas por hacer
      </button>
      <button
        :class="{ active: selectedTab === 'done' }"
        @click="selectedTab = 'done'"
      >
        Tareas terminadas
      </button>
    </div>

    <div class="tab-content">
      <ul v-if="selectedTab === 'undone'">
        <li v-for="task in tasksUndone" :key="task.id">
          <div class="task" :class="{ 'task-overdue': task.isOverdue }">
            <h3>
              <strong>Tarea:</strong> {{ task.task }}
              <span v-if="task.isOverdue" class="overdue-warning">⚠️ Vencida</span>
            </h3>
            <p><strong>Fecha:</strong> {{ task.date }}</p>
          </div>
          <button @click="markAsDone(task.id)">Hecho</button>
        </li>
      </ul>

      <ul v-if="selectedTab === 'done'">
        <li v-for="task in tasksDone" :key="task.id">
          <div class="task">
            <h3><strong>Tarea:</strong> {{ task.task }}</h3>
            <p><strong>Usuario:</strong> {{ task.user }}</p>
            <p><strong>Fecha:</strong> {{ task.date }}</p>
          </div>
          <button @click="markAsUndone(task.id)">Sin hacer</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '@/firebaseConfig'
import { markTaskAsDone } from '@/utils/markTaskAsDone'
import { markTaskAsUndone } from '@/utils/markTaskAsUndone'
import dayjs from 'dayjs'

export default {
  name: 'TaskTabs',
  data() {
    return {
      selectedTab: 'undone',
      tasksUndone: [],
      tasksDone: [],
    }
  },
  methods: {
    markAsDone(taskId) {
      markTaskAsDone(taskId)
    },
    markAsUndone(taskId) {
      markTaskAsUndone(taskId)
    },
    cargarTareas(user, groupId) {
      const tasksRef = collection(db, 'taskAssignments')
      const tasksQuery = query(
        tasksRef,
        where('groupId', '==', groupId),
        where('userId', '==', user.uid),
        orderBy('date')
      )

      onSnapshot(tasksQuery, (snapshot) => {
        const tareas = snapshot.docs.map((doc) => {
          const data = doc.data()
          const fecha = dayjs(data.date?.toDate ? data.date.toDate() : data.date)
          const isOverdue = !data.isDone && fecha.isBefore(dayjs(), 'day')

          return {
            id: doc.id,
            ...data,
            isOverdue,
          }
        })

        this.tasksUndone = tareas.filter((t) => !t.isDone)
        this.tasksDone = tareas.filter((t) => t.isDone)
      })
    },
  },
  mounted() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        getDoc(doc(db, 'users', user.uid)).then((userDoc) => {
          if (userDoc.exists()) {
            const groupId = userDoc.data().groupId
            this.cargarTareas(user, groupId)
          } else {
            console.error('El usuario no pertenece a ningún grupo.')
          }
        })
      } else {
        console.error('Usuario no autenticado.')
      }
    })
  },
}
</script>

<style scoped>
.task-tabs-container {
  width: 100%;
  max-width: 900px;
  margin: auto;
  background-color: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
  gap: 8px;
}

.tabs button {
  padding: 12px 24px;
  background-color: #eee;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
}

.tabs button.active {
  background-color: #fab65e;
  color: #000;
}

.tab-content ul {
  list-style: none;
  padding: 0;
}

.tab-content li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.task {
  max-width: 70%;
}

.task-overdue {
  background-color: #ffe5e5;
  border: 1px solid red;
}

.overdue-warning {
  color: red;
  margin-left: 8px;
  font-weight: bold;
}

button {
  background-color: rgba(100, 100, 100, 0.3);
  border: none;
  border-radius: 8px;
  padding: 10px;
  font-weight: bold;
  color: rgb(20, 20, 20);
  cursor: pointer;
}

button:hover {
  background-color: rgba(88, 88, 88, 0.555);
}
</style>
