<template>
  <div class="chat-view">
    <!-- El chat se muestra automáticamente cuando groupId está disponible -->
    <ChatComponent
      v-if="groupId"
      :groupId="groupId"
      :groupName="group.name"
    />
  </div>
</template>

<script>
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import ChatComponent from "@/components/ChatComponent.vue";

export default {
  components: { ChatComponent },
  data() {
    return {
      group: {}, // Información del grupo
      groupId: "", // ID del grupo
    };
  },
  async created() {
    // Escuchar cambios en el estado de autenticación
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            this.groupId = userSnap.data().groupId;

            if (this.groupId) {
              const groupRef = doc(db, "groups", this.groupId);
              const groupSnap = await getDoc(groupRef);

              if (groupSnap.exists()) {
                this.group = groupSnap.data();
              } else {
                console.error("El grupo no existe.");
              }
            }
          } else {
            console.error("El usuario no tiene un grupo asignado.");
          }
        } catch (error) {
          console.error("Error al obtener los datos del grupo: " + error.message);
        }
      } else {
        // Si no hay usuario autenticado, redirigir al login
        this.$router.push("/login");
      }
    });
  },
  methods: {
    async handleLogout() {
      try {
        await signOut(auth);
        this.$router.push("/");
      } catch (error) {
        console.error("Error al cerrar sesión: " + error.message);
      }
    },
  },
};
</script>

<style scoped>
.chat-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 110%;
    max-height: 700px;
    margin-left: 300px;
    padding: 25px;
    opacity: 0.9;
    align-content: center;
}
</style>



  