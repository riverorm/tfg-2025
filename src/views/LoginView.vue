<template>
  <div class="login">

    <h1>Inicia Sesión</h1>
    <hr></hr>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="email">Correo electrónico</label>
        <input type="email" v-model="email" id="email" required />
      </div>
      <div>
        <label for="password">Contraseña</label>
        <input type="password" v-model="password" id="password" required />
      </div>
      <button type="submit" class="login-button">Iniciar Sesión</button>
    </form>
    <p>¿No tienes cuenta? <RouterLink to="/register">Regístrate aquí</RouterLink>.</p>
  </div>
</template>

<script>
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default {
  
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
    // Intentar iniciar sesión con Firebase
    const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
    const user = userCredential.user;

    if (user) {
      // Si el usuario está autenticado, redirigir al Home
      this.$router.push("/home");
    }
  } catch (error) {
    // Manejo de errores
    alert("Error al iniciar sesión: " + error.message);
      }
    },
  },
};
</script>

<style scoped>
.login {
  max-width: 450px;
  margin: 50px auto;
  padding: 30px;
  border-radius: 12px;
  background: linear-gradient(to bottom, #ffffff, #f1f5f9);
  box-shadow: 0.1px 0 15px 6px rgba(1, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
}

h1 {
  font-size: 1.8rem;
  font-weight: bold;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 20px;
}

hr {
  border: 0;
  height: 1px;
  background: #ccc;
  margin-bottom: 20px;
}


form div {
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
  width: 95%;
  padding: 12px 15px;
  border: 1px solid #ccd1d9;
  border-radius: 6px;
  background-color: #ecf0f1;
  font-size: 1rem;
  color: #2c3e50;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input:focus {
  border-color: #007bff;
  box-shadow: 0 0 4px rgba(0, 123, 255, 0.5);
  outline: none;
}

button {
  width: 100%;
  padding: 12px;
  background: #308ff5;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

button:hover {
  background-color: #0056b3;
  transform: translateY(-1px);
}

button:active {
  background-color: #004085;
}

.login-button {
  font-size: 1rem;
}

p {
  margin-top: 20px;
  font-size: 0.9rem;
  text-align: center;
  color: #7f8c8d;
}

p a {
  color: #007bff;
  font-weight: bold;
  text-decoration: none;
}

p a:hover {
  text-decoration: underline;
}
</style>



  