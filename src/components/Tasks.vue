<script setup lang="ts">
import { ref, computed } from "vue";
import TaskForm from "./TaskForm.vue";
import { TaskAPI } from "../api/Task";
import { LoginAPI } from "../api/Login";
import router from "../routes";

import { useUserStore } from "../store/User";
import { Task } from "../types";
import { onMounted } from "vue";

const userStore = useUserStore();

const showProfileDropdown = ref(false);
const api = new TaskAPI();
const loginApi = new LoginAPI();

const toggleProfileDropdown = () => {
  showProfileDropdown.value = !showProfileDropdown.value;
};

const closeProfileDropdown = (event: MouseEvent) => {
  if (!showProfileDropdown.value) return;

  const dropdownElement = document.querySelector(".profile-dropdown");
  const initialsButton = document.querySelector(".profile-button");

  if (dropdownElement && initialsButton) {
    if (!dropdownElement.contains(event.target as Node) && !initialsButton.contains(event.target as Node)) {
      showProfileDropdown.value = false;
    }
  }
};

onMounted(() => {
  document.addEventListener("click", closeProfileDropdown);
});

const logout = async () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");

  userStore.logout();
  await loginApi.logout();

  router.push({ path: "/login" });
};

const openDialog = ref(false);

const tasks = ref<Task[]>([]);

const getTasks = async () => {
  const fetchedTasks = await api.getTasks();
  tasks.value = fetchedTasks.map((task) => new Task(task));
};

onMounted(async () => {
  await getTasks();
});

const editingIndex = ref(-1);
const expandedTasks = ref<number[]>([]);

const editingTask = ref<Partial<Task>>({});
const editTitleField = ref<HTMLInputElement | null>(null);

const completedTasks = computed(() => tasks.value.filter((task) => task.completed).length);
const pendingTasks = computed(() => tasks.value.filter((task) => task.status === "pending").length);
const inProgressTasks = computed(() => tasks.value.filter((task) => task.status === "in_progress").length);

const addTask = async (data: any) => {
  const newTaskResponse = await api.post({
    title: data.title,
    description: data.description,
    due_date: data.dueDate || undefined,
    status: data.status,
    owner: userStore.id,
  });
  tasks.value.push(new Task(newTaskResponse));
  openDialog.value = false;
};

const deleteTask = async (index: number) => {
  const taskId = tasks.value[index].id;

  const expandedIndex = expandedTasks.value.indexOf(taskId);
  if (expandedIndex !== -1) {
    expandedTasks.value.splice(expandedIndex, 1);
  }

  await api.deleteTask(taskId);

  tasks.value.splice(index, 1);
};

const toggleTaskCompletion = async (index: number) => {
  const currentTask = tasks.value[index];
  const currentStatus = currentTask.status;
  if (currentStatus === "pending") {
    currentTask.status = "in_progress";
  } else if (currentStatus === "in_progress") {
    currentTask.status = "completed";
    currentTask.completedAt = new Date().toISOString();
  } else {
    currentTask.status = "pending";
    currentTask.completedAt = undefined;
  }

  const updatedTask = await api.editTask(currentTask.id, {
    title: currentTask.title,
    status: currentTask.status,
    owner: userStore.id,
  });
  tasks.value[index] = new Task(updatedTask);
};

const toggleTaskDetails = (taskId: number) => {
  const index = expandedTasks.value.indexOf(taskId);
  if (index === -1) {
    expandedTasks.value.push(taskId);
  } else {
    expandedTasks.value.splice(index, 1);
  }
};

const startEditing = (index: number) => {
  editingIndex.value = index;
  const task = tasks.value[index];

  editingTask.value = {
    title: task.title,
    description: task.description,
    dueDate: "",
  };
};

const saveEdit = async () => {
  if (!editingTask.value.title?.trim()) return;

  const task = tasks.value[editingIndex.value];
  task.title = editingTask.value.title.trim();
  task.description = editingTask.value.description?.trim() || "";
  task.dueDate = editingTask.value.dueDate || undefined;

  const newTaskEdited = await api.editTask(task.id, {
    title: task.title,
    description: task.description,
    due_date: task.dueDate,
    owner: userStore.id,
  });
  tasks.value[editingIndex.value] = new Task(newTaskEdited);

  editingIndex.value = -1;
};

const cancelEdit = () => {
  editingIndex.value = -1;
};

const clearCompleted = () => {
  const tasksToRemove = tasks.value.filter((task) => task.completed).map((task) => task.id);

  expandedTasks.value = expandedTasks.value.filter((id) => !tasksToRemove.includes(id));

  tasks.value = tasks.value.filter((task) => !task.completed);
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return "Not set";

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  return new Date(dateString).toLocaleDateString(undefined, options);
};

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <div class="bg-white rounded-xl shadow-xl overflow-hidden">
      <div
        class="bg-cover bg-center relative"
        style="
          background-image: url(&quot;https://datapoint.tech/wp-content/uploads/2022/07/background_new_header_4.jpg&quot;);
        "
      >
        <div class="absolute inset-0 bg-blue-500 bg-opacity-40"></div>

        <div class="relative p-6 z-10">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-2xl font-bold text-white">Task Manager</h1>
              <p class="text-blue-100 mt-1">Keep track of your daily tasks</p>
            </div>
            <div class="flex items-center space-x-2">
              <div class="bg-opacity-20 rounded-lg px-3 py-2 backdrop-blur-sm text-white text-sm">
                <span>Welcome, {{ userStore.name }}</span>
              </div>
              <div class="relative">
                <button
                  @click.stop="toggleProfileDropdown"
                  class="profile-button w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center border-2 border-white transition-all duration-200"
                  title="Profile options"
                >
                  <span class="text-white font-medium">{{ getInitials(userStore.name) }}</span>
                </button>
                <Transition name="dropdown">
                  <div
                    v-if="showProfileDropdown"
                    class="profile-dropdown absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 transform origin-top-right"
                  >
                    <div class="px-4 py-3 border-b border-gray-100">
                      <p class="text-sm leading-5 font-medium text-gray-900 truncate">{{ userStore.name }}</p>
                      <p class="text-xs leading-4 font-medium text-gray-500 truncate mt-1">{{ userStore.email }}</p>
                    </div>
                    <button
                      @click="logout"
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M3 3a1 1 0 011 1v12a1 1 0 01-1 1h8a1 1 0 001-1v-2a1 1 0 10-2 0v1H4V5h6v1a1 1 0 102 0V4a1 1 0 00-1-1H3zm12.293 5.293a1 1 0 011.414 0l2 2a1 1 0 010 1.414l-2 2a1 1 0 01-1.414-1.414L16.586 11H7a1 1 0 110-2h9.586l-1.293-1.293a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                </Transition>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TaskForm :is-open="openDialog" @close="openDialog = false" @add-task="addTask" />

      <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2">
            <span class="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
              {{ pendingTasks }} Pending
            </span>
            <span class="px-2 py-1 bg-amber-100 rounded-full text-xs font-medium text-amber-600">
              {{ inProgressTasks }} In Progress
            </span>
            <span class="px-2 py-1 bg-green-100 rounded-full text-xs font-medium text-green-600">
              {{ completedTasks }} Completed
            </span>
          </div>
          <button
            @click="openDialog = true"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clip-rule="evenodd"
              />
            </svg>
            <span class="ml-1">New Task</span>
          </button>
        </div>
      </div>

      <div class="p-6">
        <div v-if="tasks.length === 0" class="text-center py-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-16 w-16 mx-auto text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p class="mt-2 text-gray-500">No tasks yet. Add some tasks to get started!</p>
        </div>

        <transition-group name="task-list" tag="ul" class="space-y-4">
          <li
            v-for="(task, index) in tasks"
            :key="task.id"
            class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-4 transition-all duration-300"
            :class="{
              editing: editingIndex === index,
              completed: task.status === 'completed',
              pending: task.status === 'pending',
              in_progress: task.status === 'in_progress',
              overdue: task.isOverdue,
            }"
          >
            <div v-if="editingIndex !== index">
              <div class="p-4 flex items-center justify-between border-b border-gray-100">
                <div class="flex items-center gap-3">
                  <button
                    @click="toggleTaskCompletion(index)"
                    class="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center hover:scale-110 transition-transform"
                    :class="{
                      'bg-green-500 border-green-500': task.completed,
                      'border-gray-400 hover:border-gray-600': task.status === 'pending',
                      'bg-amber-100 border-amber-400': task.status === 'in_progress',
                    }"
                    :title="`Mark as ${task.status === 'pending' ? 'in progress' : task.status === 'in_progress' ? 'completed' : 'pending'}`"
                  >
                    <svg
                      v-if="task.status === 'in_progress'"
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 text-amber-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <svg
                      v-if="task.completed"
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                  <div class="flex items-center gap-2">
                    <h3
                      class="text-lg font-medium transition-all duration-200"
                      :class="{
                        'line-through text-gray-400': task.completed,
                        'text-orange-600': task.status === 'in_progress',
                      }"
                    >
                      {{ task.title }}
                    </h3>
                    <span
                      class="text-xs font-medium px-2 py-1 rounded-full"
                      :class="{
                        'bg-gray-100 text-gray-600': task.status === 'pending',
                        'bg-amber-100 text-amber-600': task.status === 'in_progress',
                        'bg-green-100 text-green-600': task.status === 'completed',
                      }"
                    >
                      {{
                        task.status === "in_progress"
                          ? "In Progress"
                          : task.status.charAt(0).toUpperCase() + task.status.slice(1)
                      }}
                    </span>
                  </div>
                </div>

                <div class="flex space-x-2">
                  <button
                    @click="toggleTaskDetails(task.id)"
                    class="text-gray-500 hover:text-blue-600 transition-colors p-1.5 hover:bg-blue-50 rounded-full"
                    title="Toggle details"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 transition-transform duration-200"
                      :class="{ 'rotate-180': expandedTasks.includes(task.id) }"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>

                  <button
                    @click="startEditing(index)"
                    class="text-gray-500 hover:text-blue-600 transition-colors p-1.5 hover:bg-blue-50 rounded-full"
                    :disabled="task.completed"
                    :class="{ 'opacity-50 cursor-not-allowed': task.completed }"
                    title="Edit task"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                      />
                    </svg>
                  </button>

                  <button
                    @click="deleteTask(index)"
                    class="text-gray-500 hover:text-red-600 transition-colors p-1.5 hover:bg-red-50 rounded-full"
                    title="Delete task"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fill-rule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div v-show="expandedTasks.includes(task.id)" class="p-4 bg-gray-50 space-y-3">
                <div v-if="task.description" class="space-y-1">
                  <h4 class="text-sm font-medium text-gray-500">Description</h4>
                  <p class="text-sm text-gray-700 whitespace-pre-line">{{ task.description }}</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div class="space-y-1">
                    <h4 class="font-medium text-gray-500">Created</h4>
                    <div class="flex items-center space-x-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <span>{{ formatDate(task.createdAt) }}</span>
                    </div>
                  </div>

                  <div v-if="task.dueDate" class="space-y-1">
                    <h4 class="font-medium text-gray-500">Due</h4>
                    <div class="flex items-center space-x-1" :class="{ 'text-red-600': task.isOverdue }">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        :class="{ 'text-red-600': task.isOverdue, 'text-gray-400': !task.isOverdue }"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <span>{{ formatDate(task.dueDate) }}</span>
                    </div>
                  </div>

                  <div class="space-y-1">
                    <h4 class="font-medium text-gray-500">Owner</h4>
                    <div class="flex items-center space-x-2">
                      <div class="bg-blue-600 h-6 w-6 rounded-full flex items-center justify-center text-white text-xs">
                        {{ getInitials(userStore.name) }}
                      </div>
                      <span>{{ userStore.name }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="p-4 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                <input
                  v-model="editingTask.title"
                  type="text"
                  class="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  ref="editTitleField"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  v-model="editingTask.description"
                  class="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  v-model="editingTask.dueDate"
                  type="date"
                  class="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div class="flex justify-end space-x-2 pt-2">
                <button
                  @click="saveEdit"
                  class="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Save
                </button>
                <button
                  @click="cancelEdit"
                  class="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Cancel
                </button>
              </div>
            </div>
          </li>
        </transition-group>

        <div v-if="completedTasks > 0" class="mt-6 flex justify-end">
          <button @click="clearCompleted" class="text-blue-600 hover:text-blue-800 transition-colors text-sm">
            Clear completed ({{ completedTasks }})
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
}
.task-list-enter-active,
.task-list-leave-active {
  transition: all 0.5s ease;
}

.task-list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.task-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.task-list-move {
  transition: transform 0.5s ease;
}

.editing {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}

.completed {
  opacity: 0.8;
  border-left: 4px solid #10b981;
}

.pending {
  border-left: 4px solid #6b7280;
}

.in_progress {
  border-left: 4px solid #f59e0b;
}

.overdue:not(.completed) {
  border-left: 4px solid #ef4444;
}

.task-list li:hover {
  transform: translateY(-2px);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}
</style>
