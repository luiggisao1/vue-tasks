import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { User } from "../types";

export const useUserStore = defineStore("user", () => {
  const username = ref("");
  const name = ref("");
  const email = ref("");
  const id = ref("");

  function setUser(user: User) {
    username.value = user.username;
    name.value = `${user.first_name} ${user.last_name}`;
    email.value = user.email;
    id.value = user.id;
  }

  function logout() {
    username.value = "";
    name.value = "";
    email.value = "";
    id.value = "";
  }

  const user = computed(() => {
    return {
      username: username.value,
      name: name.value,
      email: email.value,
    };
  });

  return { id, username, name, email, setUser, logout, user };
});
