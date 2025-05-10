<script>
export default {
  props: {
    history: {
      type: Array,
      required: true,
    },
  },
}
</script>

<template>
  <div class="history-container">
    <h3 class="title">Historial de tareas</h3>
    <hr></hr>

    <div class="history-list" v-if="history.length > 0">
      <div class="task-card" v-for="(item, index) in history" :key="index">
        <p class="task"><strong>{{ item.task }}</strong></p>
        <p class="info">🗓 {{ item.date }} &mdash; 👤 {{ item.user }}</p>
      </div>
    </div>

    <div class="empty" v-else>
      <div class="loader"></div>
      <p class="message">Esperando tareas<span class="dots-blink">...</span></p>
    </div>
  </div>
</template>

<style scoped>
.history-container {
  width: 100%;
  height: 100%;
  padding: 1rem;
  box-sizing: border-box;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.445);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
}

.history-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex-grow: 1; /* <- hace que tome todo el espacio disponible */
  overflow-y: auto; /* solo si es necesario */
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center; /* Centra las tarjetas horizontalmente */
  width: 100%;
}



hr {
  border: 0;
  width: 70%;
  height: 1px;
  background: #080808;
  margin-bottom: 20px;
}

.task-card {
  width: 80%;
  background-color: #f8deb675;
  padding: 0.75rem;
  border-radius: 8px;
  transition:  0.3s ease;
}
.task-card:hover {
  background: #f1f5f9;
}
.task {
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
}
.info {
  font-size: 0.85rem;
  color: #555;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.message {
  font-size: 1rem;
  padding-top: 1rem;
  font-weight: 500;
  color: #666;
}

.dots-blink {
  animation: blink 1s linear infinite;
}

@keyframes blink {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}

.loader {
  position: relative;
  width: 60px;
  height: 80px;
  background: rgba(128, 128, 128, 0.555);
  border-radius: 4px;
}
.loader:before {
  content: '';
  position: absolute;
  width: 30px;
  height: 15px;
  left: 50%;
  top: 0;
  background-size: 12px 12px, 100% auto;
  background-repeat: no-repeat;
  background-position: center top;
  transform: translate(-50%, -65%);
  box-shadow: 0 -3px rgba(0, 0, 0, 0.25) inset;
}
.loader:after {
  content: '';
  position: absolute;
  left: 50%;
  top: 20%;
  transform: translateX(-50%);
  width: 66%;
  height: 60%;
  background: linear-gradient(to bottom, #f79577 30%, #0000 31%);
  background-size: 100% 16px;
  animation: writeDown 2s ease-out infinite;
}

@keyframes writeDown {
  0% { height: 0%; opacity: 0; }
  20% { height: 0%; opacity: 1; }
  80% { height: 65%; opacity: 1; }
  100% { height: 65%; opacity: 0; }
}
</style>
