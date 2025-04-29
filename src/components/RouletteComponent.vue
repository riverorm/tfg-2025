<script>
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'
import Spinner from '@/components/Spinner.vue'

const cheeseDegreeRange = 60
const circleDegreeOffset = cheeseDegreeRange / 2

let totalSpinDegrees = 0

export default {
  components: { Spinner },
  emits: ['success'],
  data() {
    return {
      loading: true,
      userName: '',
      userId: '',
      groupId: '',
      cheeses: ['Cocinar', 'Baño', 'Basura', 'Cocina', 'Salón', 'Comprar'],
    }
  },
  mounted() {
    onAuthStateChanged(getAuth(), async (user) => {
      if (user) {
        this.userName = user.displayName || 'Usuario'
        this.userId = user.uid

        const db = getFirestore()
        const userDoc = await getDoc(doc(db, 'users', this.userId))
        if (userDoc.exists()) {
          this.groupId = userDoc.data().groupId
          this.loadCheesesFromFirestore()
        } else {
          console.error('User document not found in Firestore.')
        }
      } else {
        console.error('No authenticated user.')
      }
    })
  },
  methods: {
    async saveCheesesToFirestore() {
      if (!this.groupId) return

      const db = getFirestore()
      try {
        await setDoc(
          doc(db, 'groupAvailableTasks', this.groupId),
          { cheeses: this.cheeses },
          { merge: true },
        )
        console.log('Cheeses saved to Firestore successfully.')
      } catch (error) {
        console.error('Error saving cheeses to Firestore:', error)
      }
    },
    async loadCheesesFromFirestore() {
      if (!this.groupId) return

      const db = getFirestore()
      try {
        const docSnap = await getDoc(doc(db, 'groupAvailableTasks', this.groupId))
        if (docSnap.exists()) {
          const data = docSnap.data()
          if (data.cheeses) {
            this.cheeses = data.cheeses
            this.loading = false
            console.log('Cheeses loaded from Firestore successfully.')
          }
        } else {
          this.cheeses = ['Cocinar', 'Baño', 'Basura', 'Cocina', 'Salón', 'Comprar'];
          this.loading = false;
        }
      } catch (error) {
        console.error('Error loading cheeses from Firestore:', error)
      }
    },
    spinRoulette() {
      const degree = Math.floor(Math.random() * 360)
      const completeTurnsDegrees = 360 * 5 + degree
      const rouletteTable = this.$refs.rouletteTable

      rouletteTable.style.transition = 'transform ease-in-out 2.5s'
      rouletteTable.style.transform = `rotate(-${totalSpinDegrees + completeTurnsDegrees}deg)`
      totalSpinDegrees += completeTurnsDegrees

      setTimeout(() => {
        const degreesRoulette = (totalSpinDegrees + circleDegreeOffset) % 360
        const cheeseGradesRoulette = Math.ceil(degreesRoulette / cheeseDegreeRange)
        const selectedCheese = this.cheeses[cheeseGradesRoulette - 1]

        this.$emit('success', selectedCheese)
      }, 2500)
    },
    reset() {
      totalSpinDegrees = 0
      const rouletteTable = this.$refs.rouletteTable

      rouletteTable.style.transition = 'transform ease-in-out 0.1s'
      rouletteTable.style.transform = 'rotate(0deg)'
    },
  },
}
</script>

<template>
  <Spinner v-if="loading" message="Cargando tus tareas disponibles" />

  <div v-else>
    <div class="animate-appear" id="roulette">
      <div ref="rouletteTable" id="roulette-table" class="roulette-container">
        <div class="roulette-container cheese-container cook-container">
          <input type="text" class="cheese-input" v-model="cheeses[0]" @blur="saveCheesesToFirestore" />
        </div>
        <div class="roulette-container cheese-container bath-container">
          <input type="text" class="cheese-input" v-model="cheeses[1]" @blur="saveCheesesToFirestore" />
        </div>
        <div class="roulette-container cheese-container trash-container">
          <input type="text" class="cheese-input" v-model="cheeses[2]" @blur="saveCheesesToFirestore" />
        </div>
        <div class="roulette-container cheese-container kitchen-container">
          <input type="text" class="cheese-input" v-model="cheeses[3]" @blur="saveCheesesToFirestore" />
        </div>
        <div class="roulette-container cheese-container lounge-container">
          <input type="text" class="cheese-input" v-model="cheeses[4]" @blur="saveCheesesToFirestore" />
        </div>
        <div class="roulette-container cheese-container buy-container">
          <input type="text" class="cheese-input" v-model="cheeses[5]" @blur="saveCheesesToFirestore" />
        </div>
      </div>

      <img @click="spinRoulette" id="spinbutton" class="tap" src="../../public/tap.svg" alt="" />

      <img class="arrow" src="../../public/arrow.svg" alt="" />
    </div>

    <div class="container-tasksAssignment">
      <p>Usuario actual: {{ userName }}</p>
      <button @click="reset" class="reset">Reiniciar</button>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap');

body {
  background-color: #e8e8e8;
  margin: 0;
  padding: 0;
  font-family: Nunito, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.roulette-container {
  width: 100%;
  aspect-ratio: 1 / 1;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}


#roulette {
  width: 100%;
  max-width: 550px;
  aspect-ratio: 1 / 1;
  position: relative;
  overflow: hidden;
  border-radius: 50%;
  border: 8px solid #2c3e50; /* azul oscuro elegante */
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  background-color: #f4f4f4;
  margin-top: 20px;
}


.cheese-container {
  width: 13.25rem;
  height: 11.25rem;
  position: absolute;
  font-family: Nunito, sans-serif;
  font-weight: bold;
}

.cheese-container>.cheese-input {
  writing-mode: vertical-lr;
  max-height: 5rem;
  font-size: 1rem;
  background-color: transparent;
  border: none;
  font-weight: bold;
}

.cheese-container>.cheese-input:focus {
  outline: none;
}

.cook-container {
  background: conic-gradient(from 0deg, #27ae60, #2ecc71);
  clip-path: polygon(100% 0, 50% 100%, 0% 0%);
  transform: translateY(-50%);
  transform-origin: bottom;
}

.bath-container {
  background: conic-gradient(from 60deg, #2980b9, #3498db);
  clip-path: polygon(100% 0, 50% 100%, 0% 0%);
  transform: translateY(-50%) rotateZ(60deg);
  transform-origin: bottom;
}

.trash-container {
  background: conic-gradient(from 120deg, #8e44ad, #9b59b6);
  clip-path: polygon(100% 0, 50% 100%, 0% 0%);
  transform: translateY(-50%) rotateZ(120deg);
  transform-origin: bottom;
}

.kitchen-container {
  background: conic-gradient(from 180deg, #e74c3c, #e67e22);
  clip-path: polygon(100% 0, 50% 100%, 0% 0%);
  transform: translateY(-50%) rotateZ(180deg);
  transform-origin: bottom;
}

.lounge-container {
  background: conic-gradient(from 240deg, #f39c12, #f1c40f);
  clip-path: polygon(100% 0, 50% 100%, 0% 0%);
  transform: translateY(-50%) rotateZ(240deg);
  transform-origin: bottom;
}

.buy-container {
  background: conic-gradient(from 300deg, #1abc9c, #16a085);
  clip-path: polygon(100% 0, 50% 100%, 0% 0%);
  transform: translateY(-50%) rotateZ(300deg);
  transform-origin: bottom;
}


.tap {
  width: 50px;
  height: 50px;
  background-color: #e4b67017;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  animation: pulse 1s infinite ease-in-out alternate;
  box-shadow: 0 0 10px rgba(44, 62, 80, 0.5);
}


@keyframes pulse {
  from {
    transform: translate(-50%, -50%) scale(1);
  }

  to {
    transform: translate(-50%, -50%) scale(1.2);
  }
}

.arrow {
  width: 100px;
  height: 25px;
  z-index: 1;
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
}

.container-tasksAssignment {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  width: 100%;
}



#name {
  height: 3.75rem;
  font-size: 1rem;
  padding: 0.5rem;
  border: 0.125rem solid hsl(180deg 4% 24%);
  border-radius: 0.25rem;
  box-shadow: 0 0 0.625rem hsl(180deg 4% 24%);
  font-family: Questrial, sans-serif;
  transition: all 0.3s ease;
}

#name:hover {
  border-color: var(--rojopastel);
  box-shadow: 0 2px 3px hsl(180deg 4% 24%);
  background-color: #fefefe;
}

#name:focus {
  outline: none;
  border-color: var(--rojopastel);
  box-shadow: 0 2px 0.625rem hsl(180deg 4% 24%);
  background-color: #fff;
}

.reset {
  height: 3.75rem;
  font-size: 1rem;
  cursor: pointer;
  color: rgb(54, 53, 53);
  border-radius: 0.25rem;
  background-color: rgba(133, 133, 133, 0.486);
  box-shadow: 0 2px 0.625rem hsl(180deg 4% 24%);
  font-family: Questrial, sans-serif;
  border: 1px solid hsl(180deg 4% 24%);
  font-weight: bold;
  text-align: center;
  padding: 0 1.5rem;
  margin-top: 10px;
}

.link:hover,
button:hover {
  background-color: rgba(226, 160, 74, 0.719);
  color: var(--rojopastel);
}
</style>