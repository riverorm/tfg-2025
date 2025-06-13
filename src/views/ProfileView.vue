<script setup>
import { ref, onMounted } from "vue";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import ModalEditComponent from "@/components/ModalEditComponent.vue";

// Variables reactivas
const userName = ref("Cargando...");
const userGroup = ref("Sin grupo");
const userPhotoUrl = ref("");
const defaultPhoto = "https://cdn.pixabay.com/photo/2015/10/09/00/55/lotus-978659_640.jpg";
const isEditing = ref(false);
const showAlert = ref(false);

// Cargar datos del usuario
const loadUserData = async () => {
  const user = auth.currentUser;

  if (user) {
    userName.value = user.displayName || "Usuario desconocido";
    userPhotoUrl.value = user.photoURL || defaultPhoto;

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      userGroup.value = userDoc.data().groupId || "Sin grupo";
      if (userDoc.data().photoURL) {
        userPhotoUrl.value = userDoc.data().photoURL;
      }
    }
  } else {
    console.error("No hay un usuario autenticado.");
  }
};

// Permitir editar el nombre
const enableEditing = () => {
  isEditing.value = true;
};

// Guardar cambios (nombre y foto)
const saveChanges = async () => {
  const user = auth.currentUser;

  if (user) {
    try {
      // Actualizar nombre en Firebase Authentication
      await updateProfile(user, {
        displayName: userName.value,
        photoURL: userPhotoUrl.value || null,
      });

      // Actualizar datos en Firestore
      await updateDoc(doc(db, "users", user.uid), {
        name: userName.value,
        photoURL: userPhotoUrl.value || null,
      });

      isEditing.value = false;
      showAlert.value = true;
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      alert("Error al guardar los cambios.");
    }
  }
};

// Subir imagen a Cloudinary
const uploadImage = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "mi_preset_web"); // Cambia aquí
  // No es necesario enviar cloud_name en el body, va en la URL

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dpyhtq8af/image/upload`, // Cambia aquí
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    userPhotoUrl.value = data.secure_url;

    // Actualizar foto en perfil Firebase (opcional guardar inmediato)
    const user = auth.currentUser;
    if (user) {
      await updateProfile(user, { photoURL: userPhotoUrl.value });
      await updateDoc(doc(db, "users", user.uid), { photoURL: userPhotoUrl.value });
    }
  } catch (error) {
    console.error("Error subiendo la imagen a Cloudinary:", error);
    alert("Error subiendo la imagen.");
  }
};

// Cerrar modal
const handleModalClose = () => {
  showAlert.value = false;
};

// Carga inicial
onMounted(loadUserData);
</script>

<template>
  <div class="container">
    <div class="card-profile">
      <div class="card-header">
        <label class="profile-photo">
          <img :src="userPhotoUrl || defaultPhoto" :alt="`Foto de perfil de ${userName}`" />
          <div class="edit-overlay">
            <i class="fa-solid fa-pencil"></i>
          </div>
          <input type="file" @change="uploadImage" accept="image/*" hidden />
        </label>
      </div>
      <div class="card-body">
        <div class="name-profile">
          <h3>Nombre de usuario</h3>
          <input type="text" v-model="userName" :readonly="!isEditing" :class="{ editable: isEditing }" />
        </div>
        <div class="houses-profile">
          <h3>Grupo</h3>
          <input type="text" :placeholder="userGroup" readonly />
        </div>
      </div>
      <div class="card-footer">
        <button class="edit-button" @click="enableEditing" v-if="!isEditing">Editar</button>
        <button class="save" @click="saveChanges" :disabled="!isEditing">Guardar</button>
      </div>
    </div>
  </div>

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
  padding: 20px;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.card-profile:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.profile-photo {
  position: relative;
  width: 192px;
  height: 192px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  display: inline-block;
  border: 4px solid #e2e8f0;
  margin-bottom: 20px;
}

.profile-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.edit-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: opacity 0.3s ease;
}

.profile-photo:hover .edit-overlay {
  opacity: 1;
}

i {
  font-size: 1.8rem;
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
.card-footer button+button {
  margin-left: 10px;
}

/* Títulos */
h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #2c5282;
}
</style>