<script setup>

</script>


<template>
  <div class="papi-modal">
    <div class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Perfil editado!</h2>
          <label for="modal-toggle" class="modal-close" @click="$emit('acceptDate')">&times;</label>
        </div>
        <div class="modal-body">
          <p>El perfil ha sido editado con éxito.</p>
        </div>
        <div class="modal-footer">
          <button @click="$emit('acceptDate')" class="btn">Aceptar</button>
        </div>
      </div>
    </div>
  </div>
</template>


<style>
.papi-modal {
  background-color: #f3f4f6;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  z-index: 9999;
}

/* Estilos del botón */
.btn {
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn:hover {
  background-color: #1d4ed8;
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
  border-radius: 0.5rem;
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