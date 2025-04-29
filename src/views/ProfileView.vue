<script setup>
import { ref, onMounted } from "vue";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import ModalEditComponent from "@/components/ModalEditComponent.vue";

// Referencias para datos del usuario
const userName = ref("Cargando...");
const userGroup = ref("Sin grupo");
const isEditing = ref(false); // Indica si se está editando el nombre de usuario
const showAlert = ref(false); // Controla la visibilidad del modal

// Función para cargar datos del usuario
const loadUserData = async () => {
  const user = auth.currentUser;

  if (user) {
    userName.value = user.displayName || "Usuario desconocido";

    // Obtener datos adicionales de Firestore (si es necesario)
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      userGroup.value = userDoc.data().groupId || "Sin grupo";
    }
  } else {
    console.error("No hay un usuario autenticado.");
  }
};

// Función para habilitar la edición
const enableEditing = () => {
  isEditing.value = true;
};

// Función para guardar los cambios
const saveChanges = async () => {
  const user = auth.currentUser;

  if (user) {
    try {
      // Actualizar nombre en Firebase Authentication
      await updateProfile(user, {
        displayName: userName.value,
      });

      // Actualizar nombre en Firestore (si es necesario)
      await updateDoc(doc(db, "users", user.uid), {
        name: userName.value,
      });

      // Mostrar el modal al guardar con éxito
      isEditing.value = false;
      showAlert.value = true;
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      alert("Error al guardar los cambios.");
    }
  }
};

// Función para manejar la aceptación del modal
const handleModalClose = () => {
  showAlert.value = false; // Cerrar el modal
};

// Cargar datos al montar el componente
onMounted(loadUserData);
</script>

<template>
  <div class="container">
    <div class="card-profile">
      <div class="card-header">
        <div class="profile-photo">
          <img src="https://cdn.pixabay.com/photo/2015/10/09/00/55/lotus-978659_640.jpg" alt="Foto de perfil de {{ userName }}">
        </div>
      </div>
      <div class="card-body">
        <div class="name-profile">
          <h3>Nombre de usuario</h3>
          <!-- Campo editable si está en modo edición -->
          <input
            type="text"
            v-model="userName"
            :readonly="!isEditing"
            :class="{ editable: isEditing }"
          />
        </div>
        <div class="houses-profile">
          <h3>Grupo</h3>
          <!-- Grupo no editable -->
          <input type="text" :placeholder="userGroup" readonly />
        </div>
      </div>
      <div class="card-footer">
        <!-- Botón para habilitar edición -->
        <button class="edit-button" @click="enableEditing" v-if="!isEditing">Editar</button>
        <!-- Botón para guardar cambios -->
        <button class="save" @click="saveChanges" :disabled="!isEditing">Guardar</button>
      </div>
    </div>
  </div>
  <!-- Modal para mostrar mensaje de éxito -->
  <ModalEditComponent v-if="showAlert" @acceptDate="handleModalClose" />
</template>


<style scoped>
/* Contenedor principal */
.container {
  display: flex;
  width: calc(100% - 250px);
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 10px;
  font-family: 'Roboto', sans-serif;
  box-sizing: border-box;
}

.card-profile {
  width: 100%;
  max-width: 400px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.card-profile:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .container {
    padding: 10px;
  }

  .card-profile {
    padding: 20px;
  }
}

/* Estilo de inputs */
input {
  width: 95%;
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  background-color: #f7fafc;
  color: #2d3748;
  font-size: 1rem;
  margin-bottom: 25px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input:focus {
  border-color: #3182ce;
  box-shadow: 0 0 6px rgba(49, 130, 206, 0.5);
  outline: none;
}

input[readonly] {
  background-color: #edf2f7;
  color: #718096;
  cursor: not-allowed;
}

input.editable {
  background-color: #eaf4fc;
  border: 2px solid #63b3ed;
  box-shadow: 0 0 6px rgba(99, 179, 237, 0.3);
}

/* Pie de la tarjeta */
.card-footer {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 20px;
}

/* Botones */
button {
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

button:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}

/* Botón de edición */
.edit-button {
  background-color: #38a169;
  color: #ffffff;
}

.edit-button:hover {
  background-color: #2f855a;
  transform: translateY(-2px);
}

/* Botón de guardar */
.save {
  background-color: #3182ce;
  color: #ffffff;
}

.save:hover {
  background-color: #2b6cb0;
  transform: translateY(-2px);
}

/* Espaciado entre botones */
.card-footer button + button {
  margin-left: 10px;
}

/* Títulos */
h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #2c5282;
}
</style>



  