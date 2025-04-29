<template>
    <div class="group">
      <h1>Elige la mejor opción para empezar</h1>
      <hr />
      <div>
        <h2>Únete a un grupo ya existente</h2>
        <form @submit.prevent="joinGroup">
          <label for="group-id">ID del Grupo</label>
          <input type="text" v-model="groupIdToJoin" id="group-id" required />
          <button type="submit">Unirse</button>
        </form>
      </div>
  
      <div>
        <h2 class="divisor">ó</h2>
        <h2>Crea un nuevo grupo</h2>
        <form @submit.prevent="createGroup">
          <label for="new-group-name">Nombre del Grupo</label>
          <input type="text" v-model="newGroupName" id="new-group-name" required />
          <label for="new-group-id">ID del Grupo</label>
          <input type="text" v-model="newGroupId" id="new-group-id" required />
          <button type="submit">Crear</button>
        </form>
      </div>
    </div>
</template>

<script>
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export default {
  data() {
    return {
      groupIdToJoin: "",
      newGroupName: "",
      newGroupId: "",
    };
  },
  methods: {
    async joinGroup() {
try {
  const groupRef = doc(db, "groups", this.groupIdToJoin);
  const groupSnap = await getDoc(groupRef);

  if (groupSnap.exists()) {
    const userRef = doc(db, "users", auth.currentUser.uid);

    // Agregar el usuario a la lista de miembros del grupo
    await updateDoc(groupRef, {
      members: arrayUnion(auth.currentUser.uid),  // Agrega el UID del usuario al grupo
    });

    // Actualizar el grupo del usuario
    await updateDoc(userRef, { groupId: this.groupIdToJoin });

    this.$router.push("/home");
  } else {
    alert("El grupo no existe.");
  }
} catch (error) {
  alert("Error al unirse al grupo: " + error.message);
}
},
    async createGroup() {
      try {
        const groupRef = doc(db, "groups", this.newGroupId);
        await setDoc(groupRef, {
          name: this.newGroupName,
          members: [auth.currentUser.uid],
        });

        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, { groupId: this.newGroupId });

        this.$router.push("/home");
      } catch (error) {
        alert("Error al crear el grupo: " + error.message);
      }
    },
  },
};
</script>

<style scoped>
.group {
  max-width: 600px;
  margin: 50px auto;
  padding: 30px;
  border-radius: 6px;
  background: linear-gradient(to bottom, #ffffff, #f1f5f9);
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.192);
  font-family: 'Arial', sans-serif;
}

h1 {
  font-size: 1.8rem;
  font-weight: bold;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 20px;
}

h2 {
  font-size: 1.4rem;
  font-weight: bold;
  color: #34495e;
  margin-bottom: 15px;
  text-align: center;
}

.divisor {
  font-size: 1.4rem;
  color: #34495e;
  margin: 20px 0;
  text-align: center;
}

form {
  margin-bottom: 30px;
}

hr {
  border: 0;
  height: 1px;
  background: #ccc;
  margin-bottom: 20px;
}


form label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #34495e;
  font-size: 0.9rem;
}

input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ccd1d9;
  border-radius: 6px;
  background-color: #ecf0f1;
  font-size: 1rem;
  color: #2c3e50;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  margin-bottom: 15px;
}

input:focus {
  border-color: #007bff;
  box-shadow: 0 0 4px rgba(0, 123, 255, 0.5);
  outline: none;
}

button {
  width: 100%;
  padding: 12px;
  background: #eb8633;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

button:hover {
  background-color: #f5600a;
  transform: translateY(-1px);
}

button:active {
  background-color: #004085;
}
</style>