<script setup lang="ts">
import { ref } from "vue";
import { LoginAPI } from "../api/Login";
import { useUserStore } from "../store/User";
import router from "../routes";

const { setUser } = useUserStore();

const username = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref("");
const shakeError = ref(false);

const handleSubmit = async () => {
  loading.value = true;

  errorMessage.value = ""; // Clear previous error messages

  try {
    const api = new LoginAPI();
    const user = await api.login(username.value, password.value);

    if (user) {
      setUser(user);
      router.push({ name: "Tasks" });
    } else {
      errorMessage.value = "Invalid username or password";
      shakeError.value = true;
      setTimeout(() => {
        shakeError.value = false;
      }, 500);
    }
  } catch (error) {
    errorMessage.value = "Login failed. Please check your credentials and try again.";
    shakeError.value = true;
    setTimeout(() => {
      shakeError.value = false;
    }, 500);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
      <div class="p-6 bg-gray-50">
        <div class="flex justify-center mb-2">
          <svg class="w-16 h-16 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm-1-5a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </div>
        <h2 class="text-center text-2xl font-bold text-gray-800">Welcome Back</h2>
        <p class="mt-2 text-center text-sm text-gray-600">Sign in to your account to continue</p>
      </div>

      <!-- Form -->
      <div class="p-6">
        <form @submit.prevent="handleSubmit" class="space-y-5">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
            <div class="mt-1">
              <input
                id="username"
                type="username"
                v-model="username"
                required
                :class="`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm ${errorMessage ? 'border-red-300' : 'border-gray-300'}`"
              />
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between">
              <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            </div>
            <div class="mt-1">
              <input
                id="password"
                type="password"
                v-model="password"
                required
                autocomplete="current-password"
                :class="`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm ${errorMessage ? 'border-red-300' : 'border-gray-300'}`"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div
            v-if="errorMessage"
            :class="{ 'shake-animation': shakeError }"
            class="p-3 rounded-md bg-red-50 border border-red-200"
          >
            <div class="flex">
              <div class="flex-shrink-0">
                <svg
                  class="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-700">{{ errorMessage }}</p>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              :disabled="loading"
            >
              <svg
                v-if="loading"
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>{{ loading ? "Signing in..." : "Sign in" }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shake-animation {
  animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-5px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(5px);
  }
}
</style>
