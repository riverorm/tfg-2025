<template>
  <div class="list-task-undone">
    <h1 class="title">Tareas por hacer</h1>
    <ul>
      <li v-for="task in tasksUndone" :key="task.id">
        <div class="task" :class="{ 'task-overdue': task.isOverdue }">
          <h3 class="subtitle">
            <strong> Tarea:</strong> {{ task.task }}
            <span v-if="task.isOverdue" class="overdue-warning">⚠️ Vencida</span>
          </h3>
          <div class="data">
            <p><strong> Fecha:</strong> {{ task.date }}</p>
          </div>
        </div>
        <button class="botton-done" @click="markAsDone(task.id)">Hecho</button>
      </li>

    </ul>
  </div>
</template>

<script>
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../firebaseConfig'
import { collection, doc, getDoc, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { markTaskAsDone } from '@/utils/markTaskAsDone.js'
import dayjs from 'dayjs'

export default {
  name: 'UndoneList',
  data() {
    return {
      tasksUndone: [],
    }
  },

  methods: {
    markAsDone(taskId) {
      markTaskAsDone(taskId)
    },
  },

  mounted() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('Usuario autenticado:', user)

        // Obtener el groupId del usuario actual
        getDoc(doc(db, 'users', user.uid)).then((userDoc) => {
          if (!userDoc.exists()) {
            console.error('El usuario no pertenece a ningún grupo.')
            return
          }

          const groupId = userDoc.data().groupId

          // Escuchar cambios en tiempo real
          const tasksRef = collection(db, 'taskAssignments')
          const tasksQuery = query(
            tasksRef,
            where('groupId', '==', groupId),
            where('userId', '==', user.uid),
            orderBy('date'),
          )

          onSnapshot(tasksQuery, (snapshot) => {
            this.tasksUndone = snapshot.docs
              .map((doc) => {
                const data = doc.data()

                // Convertir correctamente la fecha a objeto dayjs
                const taskDate = dayjs(data.date?.toDate ? data.date.toDate() : data.date)

                // Marcar si la tarea está vencida
                const isOverdue = !data.isDone && taskDate.isBefore(dayjs(), 'day')

                return {
                  id: doc.id,
                  ...data,
                  isOverdue,
                }
              })
              .filter((task) => !task.isDone)
            console.log('Historial actualizado:', this.tasksUndone)
          })
        })
      } else {
        console.error('Usuario no autenticado.')
      }
    })
  },
}
</script>

<style scoped>
.list-task-undone {
  width: 45%;
  background-color: rgba(252, 160, 132, 0.445);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  /* Sombra sutil */
}

.list-task-undone:hover {
  transform: translateY(-2px);
}

/* Estiliza la barra de desplazamiento */

.title {
  font-size: 25px;
  font-weight: 800;
  color: rgb(38, 36, 36);
  margin-bottom: 12px;
  margin-left: 5%;
  text-align: center;
  text-transform: uppercase;
}

.subtitle {
  font-size: 20px;
  font-weight: 400;
  color: black;
  text-align: left;
  margin-bottom: 8px;
}

ul {
  width: 100%;
  padding: 0;
  margin: 0;
  list-style-type: none;
  flex-grow: 1;
  max-height: calc(100% - 60px);
  overflow-y: auto;
}

/* Estiliza la barra de desplazamiento */
ul::-webkit-scrollbar {
  width: 5px;
  /* Ancho de la barra de desplazamiento */
}

ul::-webkit-scrollbar-thumb {
  background: #78777796;
  /* Color del "pulgar" de la barra */
  border-radius: 4px;
}

ul::-webkit-scrollbar-thumb:hover {
  background: #4b4646ad;
  /* Color del "pulgar" cuando el usuario pasa el cursor */
}

ul::-webkit-scrollbar-track {
  background: #a1a0a053;
  /* Fondo de la pista de la barra */
}

li {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 97%;
  padding: 12px;
  border-bottom: 1px solid rgba(253, 149, 149, 0.689);
  gap: 15px;
  align-items: center;
}

li:last-child {
  border-bottom: none;
}

.task {
  width: calc(100% - 70px);
  word-wrap: break-word;
}

.data {
  display: flex;
  flex-direction: column;
  font-size: 20px;
  color: black;
  margin-bottom: 8px;
}

.data p {
  margin: 5px 0;
}

button {
  height: 45px;
  width: 120px;
  background-color: rgba(127, 124, 124, 0.319);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

button:hover {
  background-color: rgba(85, 83, 78, 0.401);
  border: 2px solid rgba(0, 0, 0, 0.225);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.task-overdue {
  border: 1px solid rgba(255, 0, 0, 0.459);
  background-color: #ffe5e580;
  width: 80%;
}

.overdue-warning {
  color: rgb(250, 38, 38);
  margin-left: 8px;
  font-weight: bold;
}


@media (max-width: 480px) {
  .list-task-undone {
    width: 90%;
    margin: 0 auto;
    height: 350px;
  }

  .title {
    font-size: 24px;
    margin-bottom: 10px;
  }

  .subtitle {
    font-size: 18px;
    margin-bottom: 8px;
  }

  .data {
    font-size: 14px;
  }

  button {
    width: 80%;
    height: 40px;
    font-size: 12px;
  }
}
</style>