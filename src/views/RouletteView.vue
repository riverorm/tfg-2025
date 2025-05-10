<script setup>
onMounted(() => {
  fetchHistory();
});

import { ref, onMounted } from 'vue';
import { getAuth } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, getDocs, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

import RouletteComponent from '@/components/RouletteComponent.vue';
import RecordRoulette from '@/components/RecordRoulette.vue';
import ModalRouletteComponent from '@/components/ModalRouletteComponent.vue';

const history = ref([]);
const showAlert = ref(false);
const currentTask = ref('');

function onRouletteSelection(task) {
  currentTask.value = task;
  showAlert.value = true;
}

function acceptDate(date) {
  saveTaskToFirebase(currentTask.value, date);
  showAlert.value = false;
}

async function saveTaskToFirebase(task, date) {
  if (!task || !date) {
    alert("Por favor, selecciona una fecha.");
    return;
  }

  const user = getAuth().currentUser;
  if (!user) {
    alert("Usuario no autenticado.");
    return;
  }

  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (!userDoc.exists()) {
    alert("No se encontró el grupo del usuario.");
    return;
  }

  const groupId = userDoc.data().groupId;

  try {
    const taskData = {
      username: user.displayName || "Usuario",
      task,
      date,
      isDone: false,
      time: serverTimestamp(),
      userId: user.uid,
      groupId,
    };

    await addDoc(collection(db, "taskAssignments"), taskData);
    console.log("Tarea guardada exitosamente.");

    await fetchHistory(); // Refrescar historial tras guardar
  } catch (error) {
    console.error("Error al guardar la tarea:", error);
  }
}

// 🔁 Recuperar historial al cargar
async function fetchHistory() {
  const user = getAuth().currentUser;
  if (!user) return;

  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (!userDoc.exists()) return;

  const groupId = userDoc.data().groupId;

  const q = query(
    collection(db, "taskAssignments"),
    where("groupId", "==", groupId),
    orderBy("time", "desc")
  );

  try {
    const querySnapshot = await getDocs(q);
    history.value = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        task: data.task,
        date: data.date,
        user: data.username,
      };
    });
  } catch (error) {
    console.error("Error al obtener historial:", error);
  }
}

// ⏳ Cargar historial al montar componente
onMounted(() => {
  fetchHistory();
});
</script>



<template>
  <main class="container animate-appear">
    <div class="roulette-container">
      <div>
        <h2 class="roulette-title">Ruleta de la "suerte"</h2>
        <p>Puedes cambiar la tarea de cada quesito tú mismo</p>
      </div>
      <div class="box-container">
        <div>
          <RouletteComponent @success="onRouletteSelection" />
        </div>
      </div>
    </div>

    <div class="box-RecordRoulette">
      <RecordRoulette :history="history" />
    </div>

    <ModalRouletteComponent v-show="showAlert" @acceptDate="acceptDate" @close="showAlert = false"/>

  </main>
</template>

<style>
.container {
  display: flex;
  flex-direction: row;
  width: calc(100% - 250px);
  gap: 1.5rem;
  padding: 0.5rem;
}

.roulette-container {
  width: 110%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
}

.roulette-title {
  font-size: 2rem;
  text-align: center;
  width: 100%;
}

.box-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 20rem;
  justify-content: space-between;
}

.box-RecordRoulette {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: flex-end;
  align-items: flex-start;
}
</style>
  