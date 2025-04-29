<script>
export default {
  props: {
    message: {
      type: String,
      required: false,
    },
  },
}
</script>

<template>
  <div class="container">
    <span class="loader"></span>
    <p class="message" v-if="message !== undefined">
      {{ message }}<span class="dots-blink">...</span>
    </p>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.message {
  font-size: 1.25rem;
  padding-top: 1rem;
  font-weight: bold;
}

.dots-blink {
  animation: blink 1s linear infinite;
}

@keyframes blink {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.loader {
  position: relative;
  width: 100px;
  height: 130px;
  background: var(--grisclaropastel);
  border-radius: 4px;
}
.loader:before {
  content: '';
  position: absolute;
  width: 54px;
  height: 25px;
  left: 50%;
  top: 0;
  background-image: radial-gradient(
      ellipse at center,
      #0000 24%,
      var(--rojopastel) 25%,
      var(--rojopastel) 64%,
      #0000 65%
    ),
    linear-gradient(to bottom, #0000 34%, var(--rojopastel) 35%);
  background-size:
    12px 12px,
    100% auto;
  background-repeat: no-repeat;
  background-position: center top;
  transform: translate(-50%, -65%);
  box-shadow: 0 -3px rgba(0, 0, 0, 0.25) inset;
}
.loader:after {
  content: '';
  position: absolute;
  left: 50%;
  top: 20%;
  transform: translateX(-50%);
  width: 66%;
  height: 60%;
  background: linear-gradient(to bottom, #f79577 30%, #0000 31%);
  background-size: 100% 16px;
  animation: writeDown 2s ease-out infinite;
}

@keyframes writeDown {
  0% {
    height: 0%;
    opacity: 0;
  }
  20% {
    height: 0%;
    opacity: 1;
  }
  80% {
    height: 65%;
    opacity: 1;
  }
  100% {
    height: 65%;
    opacity: 0;
  }
}
</style>
<script setup lang="ts"></script>