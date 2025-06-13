<template>
  <div class="list-task-done">
    <h1 class="title">Tareas terminadas</h1>
    <ul>
      <li v-for="task in tasksDone" :key="task.id">
        <div class="task">
          <h3 class="subtitle">
            <strong> Tarea:</strong> {{ task.task }}
          </h3>
          <div class="data">
            <p><strong> Fecha:</strong> {{ task.date }}</p>
          </div>
        </div>
        <button class="botton-undone" @click="markAsUndone(task.id)">Sin hacer</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { onAuthStateChanged } from 'firebase/auth' // Escucha cambios de sesión de usuario
import { auth, db } from '../firebaseConfig' // Configuración Firebase
import { collection, doc, getDoc, onSnapshot, orderBy, query, where } from 'firebase/firestore' // Firestore
import { markTaskAsUndone } from '@/utils/markTaskAsUndone.js' // Función para desmarcar tarea

export default {
  name: 'DoneList',

  data() {
    return {
      tasksDone: [], // Array de tareas completadas
    }
  },

  methods: {
    markAsUndone(taskId) {
      markTaskAsUndone(taskId)
    },
  },

  mounted() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        getDoc(doc(db, 'users', user.uid)).then((userDoc) => {
          if (!userDoc.exists()) {
            console.error('El usuario no pertenece a ningún grupo.')
            return
          }

          const groupId = userDoc.data().groupId

          const tasksRef = collection(db, 'taskAssignments')
          const tasksQuery = query(
            tasksRef,
            where('groupId', '==', groupId),
            where('isDone', '==', true),
            where('userId', '==', user.uid),  // Filtro para traer solo tareas del usuario
            orderBy('date')
          )

          onSnapshot(tasksQuery, (snapshot) => {
            this.tasksDone = snapshot.docs.map(doc => {
              const data = doc.data()
              return {
                id: doc.id,
                task: data.task,
                date: data.date,
              }
            })
            console.log('Historial de tareas terminadas:', this.tasksDone)
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
.list-task-done {
  width: 45%;
  height: 500px;
  display: flex;
  flex-direction: column;
  background-color: rgba(252, 160, 132, 0.445);
  border-radius: 12px;
  padding: 16px;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.list-task-done:hover {
  transform: translateY(-2px);
}

/* Estiliza la barra de desplazamiento */

.title {
  font-size: 25px;
    font-weight: 800;
    color: rgb(31, 30, 30);
    margin-bottom: 12px;
    margin-left: 9%;
    text-align: center;
    text-transform: uppercase;
  }
  
  .subtitle {
    font-size: 20px;
    font-weight: 500;
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
  height: 100%;
  overflow-y: auto;
}

  
  /* Estiliza la barra de desplazamiento */
  ul::-webkit-scrollbar {
    width: 5px; /* Ancho de la barra de desplazamiento */
  }
  
  ul::-webkit-scrollbar-thumb {
    background: #78777796; /* Color del "pulgar" de la barra */
    border-radius: 4px;
  }
  
  ul::-webkit-scrollbar-thumb:hover {
    background: #4b4646ad; /* Color del "pulgar" cuando el usuario pasa el cursor */
  }
  
  ul::-webkit-scrollbar-track {
    background: #a1a0a053; /* Fondo de la pista de la barra */
  }
  
  li {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 97%;
    padding: 12px;
    border-bottom: 1px solid rgba(64, 102, 64, 0.432);
    gap: 15px;
    align-items: center;
  }
  
  li:last-child {
    border-bottom: none;
  }
  
  .task {
    width: calc(100% - 70px);
    color: rgb(32, 87, 133);
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
    background-color: rgba(237, 150, 150, 0.395);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease; /* Transición más suave para los efectos */
    box-shadow:
      0 4px 8px rgba(0, 0, 0, 0.15),
      0 2px 16px rgba(0, 0, 0, 0.1); /* Sombra más intensa */
  }
  
  button:hover {
    background-color: rgba(255, 255, 255, 0.384);
    border: 2px solid rgba(43, 41, 41, 0.573);
    color: rgb(18, 18, 18);
    box-shadow:
      0 6px 12px rgba(0, 0, 0, 0.2),
      0 4px 24px rgba(0, 0, 0, 0.15); /* Sombra más pronunciada */
    transform: translateY(-2px); /* Efecto de desplazamiento para más profundidad */
  }
  
  button:active {
    background-color: rgba(234, 95, 95, 0.793); /* Vuelve al color original cuando se hace clic */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Sombra más ligera al hacer clic */
    transform: translateY(1px); /* Efecto de "presionar" al hacer clic */
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