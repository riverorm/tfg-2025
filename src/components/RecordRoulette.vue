<template>
  <div class="history-container">
    <h3 class="title">Historial de tareas</h3>
    <hr />

    <input
      type="text"
      v-model="searchQuery"
      placeholder="Filtrar por usuario o tarea..."
      class="filter-input"
    />

    <div class="history-list" v-if="filteredHistory.length > 0">
      <div class="task-card" v-for="(item, index) in filteredHistory" :key="index">
        <p class="task"><strong>{{ item.task }}</strong></p>
        <p class="info">🗓 {{ item.date }} &mdash; 👤 {{ item.user }}</p>
      </div>
    </div>

    <div class="empty" v-else>
      <div class="loader"></div>
      <p class="message">No hay tareas que coincidan<span class="dots-blink">...</span></p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    history: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      searchQuery: '',
    };
  },
  computed: {
    filteredHistory() {
      if (!this.searchQuery.trim()) return this.history;

      const query = this.searchQuery.toLowerCase();

      return this.history.filter(item => {
        return (
          item.task.toLowerCase().includes(query) ||
          item.user.toLowerCase().includes(query)
        );
      });
    }
  }
};
</script>

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

hr {
  border: 0;
  width: 70%;
  height: 1px;
  background: #080808;
  margin-bottom: 20px;
}

.filter-input {
  width: 80%;
  padding: 8px 12px;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 0.95rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}
.filter-input:focus {
  outline: none;
  border-color: #f79577;
  box-shadow: 0 0 4px rgba(247, 149, 119, 0.6);
}

.history-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
  flex-grow: 1;
  overflow-y: auto;
}

.task-card {
  width: 80%;
  background-color: #f8deb675;
  padding: 0.75rem;
  border-radius: 8px;
  transition: 0.3s ease;
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

