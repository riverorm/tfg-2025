<template>
  <nav>
    <div class="nav-center">
      <button>
        <RouterLink to="/home" id="home" class="css-routerLink">
          <h3><i class="fa-solid fa-house"></i> Inicio</h3>
        </RouterLink>
      </button>
      <button>
        <RouterLink to="/roulette" class="css-routerLink">
          <h3><i class="fa-regular fa-compass"></i> Ruleta</h3>
        </RouterLink>
      </button>
      <button>
        <RouterLink to="/chat" id="chat" class="css-routerLink">
          <h3><i class="fa-regular fa-comments"></i> Chat grupal</h3>
        </RouterLink>
      </button>
      <button>
        <RouterLink to="/profile" id="profile" class="css-routerLink">
          <h3><i class="fa-solid fa-user"></i> Perfil</h3>
        </RouterLink>
      </button>
    </div>
    <div class="nav-footer">
      <button @click="handleLogout" id="logout" class="css-routerLink">
        <h3><i class="fa-solid fa-right-from-bracket"></i> Salir</h3>
      </button>
    </div>
  </nav>
</template>


<script>
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";

export default {
  methods: {
    async handleLogout() {
      try {
        await signOut(auth); // Cerrar sesión
        this.$router.push("/"); // Redirigir al login
      } catch (error) {
        alert("Error al cerrar sesión: " + error.message);
      }
    }
  },
}; 
</script>



<style scoped>
nav {
  width: 17%;
  height: 100dvh;
  background-color: #eeededc0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-family: Questrial, sans-serif;
  gap: 60px;
  box-shadow: 1px 0 10px rgba(37, 36, 36, 0.089);
  overflow-y: auto;
}

.nav-header,
.nav-center,
.nav-footer {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px;
}

button {
  width: 85%;
  height: 60px;
  background-color: transparent;
  color: rgb(102, 99, 99);
  cursor: pointer;
  border: 2px solid rgba(80, 79, 79, 0.192);
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding-left: 32px;
  border-radius: 30px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

button:hover {
  background-color: rgba(228, 183, 142, 0.76);
  transform: translateY(-3px);
}

h3{
  color: rgba(44, 43, 43, 0.671);
}

h3:hover{
  color: rgba(255, 136, 0, 0.685);
}

i{
  margin-right: 8px; 
}
.css-routerLink {
  display: flex;
  flex-direction: row;
  align-items: center;
  color: white;
  text-decoration: none;
  gap: 20px;
  transition: color 0.3s ease;
}

.css-routerLink:hover {
  color: var(--rojoclaro);
}

.css-routerLink h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}


button:hover img {
  transform: scale(1.1);
}

</style>