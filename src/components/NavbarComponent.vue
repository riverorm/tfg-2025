<template>
  <nav>
    <div class="nav-center">
      <RouterLink to="/home" id="home" class="button-link">
        <i class="fa-solid fa-house"></i>
        <span>Inicio</span>
      </RouterLink>

      <RouterLink to="/roulette" class="button-link">
        <i class="fa-regular fa-compass"></i>
        <span>Ruleta</span>
      </RouterLink>

      <RouterLink to="/chat" id="chat" class="button-link">
        <i class="fa-regular fa-comments"></i>
        <span>Chat grupal</span>
      </RouterLink>

      <RouterLink to="/profile" id="profile" class="button-link">
        <i class="fa-solid fa-user"></i>
        <span>Perfil</span>
      </RouterLink>

        <RouterLink to="/upload" id="upload" class="button-link">
          <i class="fa-solid fa-file-upload"></i>
          <span>Documentos</span>
        </RouterLink>

    </div>

    <div class="nav-footer">
      <button @click="handleLogout" id="logout" class="button-link logout-button">
        <i class="fa-solid fa-right-from-bracket"></i>
        <span>Salir</span>
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

.nav-center,
.nav-footer {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px;
}

/* Estilo común para los botones visuales */
.button-link {
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
  text-decoration: none;
  font-size: 18px;
  font-weight: 600;
}

.button-link:hover {
  background-color: rgba(228, 183, 142, 0.76);
  transform: translateY(-3px);
  color: rgba(29, 28, 28, 0.733);
}

.button-link i {
  margin-right: 8px;
  font-size: 20px;
}

.button-link span {
  color: rgba(44, 43, 43, 0.671);
}

.button-link span:hover {
  color: rgba(255, 136, 0, 0.685);
}

/* Botón especial para logout */
.logout-button {
  justify-content: flex-start;
}

/* Responsive */
@media (max-width: 768px) {
  nav {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: auto;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding: 10px 0;
    box-shadow: 0 -1px 10px rgba(37, 36, 36, 0.089);
    z-index: 1000;
  }

  .nav-center,
  .nav-footer {
    flex-direction: row;
    width: auto;
    gap: 10px;
  }

  .button-link {
    justify-content: center;
    padding-left: 0;
    width: auto;
    height: auto;
    padding: 10px 15px;
    border-radius: 15px;
  }

  .button-link span {
    display: none;
  }

  .button-link i {
    margin: 0;
    font-size: 20px;
  }
}
</style>