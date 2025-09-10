<script setup lang="ts">
import { ref } from "vue";
import Login from "./components/Login.vue";
import Tasks from "./components/Tasks.vue";

const isLoggedIn = ref(false);

const handleLogin = () => {
  isLoggedIn.value = true;
};
</script>

<template>
  <div>
    <Login v-if="!isLoggedIn" @login="handleLogin" />
    <Tasks v-else />
  </div>
</template>

<style scoped></style>
