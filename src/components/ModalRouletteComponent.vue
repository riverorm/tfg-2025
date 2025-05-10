<script setup>
import { ref, defineEmits, defineProps } from 'vue'

const emit = defineEmits(['acceptDate', 'close'])

const dateSelected = ref("")
const today = ref(new Date().toISOString().split("T")[0])

function acceptDate() {
  emit('acceptDate', dateSelected.value)
}

function closeModal() {
  emit('close')
}
</script>

<template>
  <div class="modal-container">
    <div class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Fecha de la tarea</h2>
          <span class="modal-close" @click="closeModal">&times;</span>
        </div>
        <div class="modal-body">
          <p>Selecciona la fecha donde quieres la tarea.</p>
          <input type="date" :min="today" id="date" v-model="dateSelected" />
        </div>
        <div class="modal-footer">
          <button @click="acceptDate" class="btn">Aceptar</button>
        </div>
      </div>
    </div>
  </div>
</template>




<style>
.modal-container {
  background-color: #f3f4f6;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  z-index: 9999;
  font-family: Arial, Helvetica, sans-serif;
}

/* Estilos del botón */
.btn {
  background-color: #ec8e41;
  color: rgb(250, 247, 247);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  box-shadow: 0 2px 10px rgba(37, 36, 36, 0.089);

}

.btn:hover {
  background-color: #b46320;
}

/* Estilos del modal */
.modal {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: white;
  padding: 1.5rem;
  border-radius: 30px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  max-width: 28rem;
  width: 100%;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
}

.modal-body {
  margin-bottom: 1.5rem;
}

#date {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  margin-top: 20px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

/* Checkbox para controlar el modal */
#modal-toggle {
  display: none;
}

#modal-toggle:checked~.modal {
  display: flex;
}

/* Animación del modal */
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

#modal-toggle:checked~.modal {
  animation: fadeIn 0.3s ease-out;
}
</style>