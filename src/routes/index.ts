import { createRouter, createWebHistory } from "vue-router";
import api from "../api/Common";
import { useUserStore } from "../store/User";

const routes = [
  {
    name: "Login",
    path: "/login",
    component: () => import("../components/Login.vue"),
  },
  {
    name: "Tasks",
    path: "/tasks",
    component: () => import("../components/Tasks.vue"),
  },
];

const router = createRouter({
  history: createWebHistory("/vue-tasks/"),
  routes,
});

router.beforeEach(async (to, _, next) => {
  try {
    const accessToken = localStorage.getItem("access");
    if (accessToken !== null) {
      api.session.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      const response = await api.session.get("me/");
      if (response.status === 200) {
        api.session.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        const user = response.data;
        const userStore = useUserStore();
        userStore.setUser(user);
        if (to.name === "Login") {
          next({ name: "Tasks" });
        } else {
          next();
        }
      } else {
        next();
      }
    } else if (to.name !== "Login") {
      next({ name: "Login" });
    } else {
      next();
    }
  } catch (error) {
    const refreshToken = localStorage.getItem("refresh");
    api.session.post("token/refresh/", { refresh: refreshToken }).then(
      async (response) => {
        if (response.status === 200) {
          const { access } = response.data;
          localStorage.setItem("access", access);
          api.session.defaults.headers.common["Authorization"] = `Bearer ${access}`;
          const user = await api.session.get("me/");
          const userStore = useUserStore();
          userStore.setUser(user.data);
          next({ name: "Tasks" });
        } else {
          next({ name: "Login" });
        }
      },
      () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        next({ name: "Login" });
      },
    );
  }
});

export default router;
