<template>
  <div class="chat">
    <h2>Chat de grupo</h2>
    <div class="messages" ref="messagesContainer">
      <div v-for="message in messages" :key="message.id" class="message" 
      :class="{ mine: message.sender === userId }"
      >
        <p><strong>{{ message.senderName }}:</strong> {{ message.text }}</p>
        <small>{{ new Date(message.timestamp?.seconds * 1000)
          .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</small>
      </div>
    </div>
    <form @submit.prevent="sendMessage">
      <input type="text" v-model="newMessage" placeholder="Escribe un mensaje..." required />
      <button type="submit">Enviar</button>
    </form>
  </div>
</template>

<script>
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export default {
  props: {
    groupId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      messages: [],
      newMessage: "",
      userId: auth.currentUser?.uid || "",
      userName: auth.currentUser?.displayName || "Usuario",
      unsubscribeMessages: null, // Guardar referencia al listener
    };
  },
  methods: {
    async sendMessage() {
      if (!this.newMessage.trim()) return;

      const messageData = {
        text: this.newMessage.trim(),
        sender: this.userId,
        senderName: this.userName,
        timestamp: new Date(),
      };

      try {
        await addDoc(collection(db, "groups", this.groupId, "messages"), messageData);
        this.newMessage = ""; // Limpiar el campo de entrada
      } catch (error) {
        console.error("Error enviando el mensaje: ", error);
      }
    },
    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },
  },
  mounted() {
    // Escuchar mensajes en tiempo real
    const messagesRef = collection(db, "groups", this.groupId, "messages");
    const q = query(messagesRef, orderBy("timestamp"));

    this.unsubscribeMessages = onSnapshot(q, (snapshot) => {
      this.messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      this.$nextTick(() => {
        this.scrollToBottom();
      });
    });
  },
  beforeUnmount() {
    // Limpiar listeners al desmontar el componente
    if (this.unsubscribeMessages) {
      this.unsubscribeMessages();
    }
  },
};
</script>


<style scoped>
.chat {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 200%;
  padding: 0;
  background: #f8f9fa;
  font-family: 'Segoe UI', sans-serif;
  border-left: 1px solid #ddd;
}

h2 {
  padding: 16px;
  margin: 0;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  font-size: 1.25rem;
  color: #333;
  text-align: left;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #ffffff;
}

.message {
  max-width: 75%;
  padding: 12px 16px;
  margin-bottom: 10px;
  border-radius: 12px;
  background: #ecf0f1;
  word-wrap: break-word;
}

.message.mine {
  margin-left: auto;
  background: #d1e7dd;
  text-align: right;
}

.message p {
  margin: 0;
  font-size: 0.95rem;
  color: #212529;
}

.message small {
  margin-top: 6px;
  display: block;
  font-size: 0.75rem;
  color: #6c757d;
}

form {
  display: flex;
  padding: 16px;
  background-color: #ffffff;
  border-top: 1px solid #e0e0e0;
  gap: 8px;
}

input {
  flex: 1;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #ced4da;
  font-size: 1rem;
}

button {
  padding: 10px 16px;
  border-radius: 8px;
  background-color: #0d6efd;
  border: none;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

button:hover {
  background-color: #0b5ed7;
}
</style>