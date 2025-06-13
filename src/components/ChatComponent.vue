<template>
  <div class="chat">
    <h2>Chat de grupo</h2>
    <div class="messages" ref="messagesContainer">
      <div v-for="message in messages" :key="message.id" class="message-wrapper"
        :class="{ mine: message.sender === userId }">
        <div class="message-bubble">
          <div class="photo-wrapper">
            <img :src="message.senderPhoto || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'"
              alt="Foto de usuario" class="user-photo" />
          </div>
          <div class="message-content">
            <strong class="sender-name">{{ message.senderName }}</strong>
            <p class="text">{{ message.text }}</p>
            <small class="time">
              {{
                new Date(message.timestamp?.seconds * 1000).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })
              }}
            </small>
          </div>
        </div>
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

      const userPhoto = auth.currentUser?.photoURL || "URL_DE_FOTO_POR_DEFECTO";

      const messageData = {
        text: this.newMessage.trim(),
        sender: this.userId,
        senderName: this.userName,
        senderPhoto: userPhoto, // ← NUEVO CAMPO
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
  height: 100%;
  max-height: 100%;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  background: #f8f9fa;
  font-family: 'Segoe UI', sans-serif;
  border-left: 1px solid #ddd;
  box-sizing: border-box;
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
  min-height: 0; /* ← Este es crucial para que funcione con flexbox */
}


/* NUEVO DISEÑO DE MENSAJES */

.message-wrapper {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 12px;
}

.message-wrapper.mine {
  justify-content: flex-end;
}

.message-bubble {
  display: flex;
  align-items: flex-start;
  max-width: 75%;
  background-color: #ecf0f1;
  border-radius: 16px;
  padding: 10px 14px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.message-wrapper.mine .message-bubble {
  background-color: #d1e7dd;
  flex-direction: row-reverse;
}

.photo-wrapper {
  flex-shrink: 0;
  margin-right: 10px;
}

.message-wrapper.mine .photo-wrapper {
  margin-left: 10px;
  margin-right: 0;
}

.user-photo {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #ccc;
}

.message-content {
  display: flex;
  flex-direction: column;
}

.sender-name {
  font-size: 0.85rem;
  color: #2c3e50;
  margin-bottom: 2px;
}

.text {
  margin: 0;
  font-size: 0.95rem;
  color: #212529;
}

.time {
  font-size: 0.7rem;
  color: #6c757d;
  margin-top: 4px;
  align-self: flex-end;
}

/* FORMULARIO DE ENVÍO */

form {
  display: flex;
  padding: 16px;
  background-color: #ffffff;
  border-top: 1px solid #e0e0e0;
  gap: 8px;
  flex-shrink: 0;
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