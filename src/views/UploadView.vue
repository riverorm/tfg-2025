<template>
  <div class="document-page">
    <h2 class="page-title">Gestión de Documentos</h2>

    <div class="content-grid">
      <!-- Subida de archivos -->
      <div class="upload-panel">
        <h3>Subir Documentos</h3>
        <input type="file" multiple @change="handleFiles" />
        <button @click="uploadFiles">Subir</button>
      </div>

      <!-- Historial de documentos -->
      <div class="history-panel">
        <h3>Historial</h3>
        <input type="text" v-model="searchQuery" placeholder="Buscar por nombre..." />
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(doc, index) in filteredDocs" :key="index">
              <td>{{ doc.name }}</td>
              <td>{{ doc.user }}</td>
              <td>{{ doc.date }}</td>
              <td>
                <button @click="download(doc)">📥</button>
                <button @click="remove(index)">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const files = ref([])
const documents = ref([])
const searchQuery = ref('')

function handleFiles(event) {
  files.value = Array.from(event.target.files)
}

function uploadFiles() {
  const user = 'Usuario actual' // Sustituye con lógica real
  const date = new Date().toLocaleDateString()
  files.value.forEach(file => {
    documents.value.push({
      name: file.name,
      user,
      date,
      file
    })
  })
  files.value = []
}

function download(doc) {
  const url = URL.createObjectURL(doc.file)
  const a = document.createElement('a')
  a.href = url
  a.download = doc.name
  a.click()
  URL.revokeObjectURL(url)
}

function remove(index) {
  documents.value.splice(index, 1)
}

const filteredDocs = computed(() =>
  documents.value.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)
</script>

<style scoped>
.document-page {
  padding: 2rem;
  max-width: 1200px;
  margin: auto;
}

.page-title {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  color: #2c3e50;
}

.content-grid {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.upload-panel,
.history-panel {
  background: #fff;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  flex: 1;
}

.upload-panel input[type="file"] {
  margin: 1rem 0;
}

button {
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  border: none;
  background-color: #3498db;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #2980b9;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th, td {
  text-align: left;
  padding: 0.75rem;
  border-bottom: 1px solid #ccc;
}

input[type="text"] {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
}
</style>



