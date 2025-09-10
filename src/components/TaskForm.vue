<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "../store/User";

const userStore = useUserStore();

const emit = defineEmits<{
  "add-task": [task: { title: string; description: string; dueDate: string; status: string; owner: string }];
  close: [];
}>();

// Already imported via script setup

defineProps<{
  isOpen: boolean;
}>();

const close = () => {
  resetForm();
  emit("close");
};

const resetForm = () => {
  newTask.value.title = "";
  newTask.value.description = "";
  newTask.value.dueDate = "";
  newTask.value.status = "pending";
  validationErrors.value.title = false;
};

const newTask = ref({
  title: "",
  description: "",
  dueDate: "",
  status: "pending",
  owner: userStore.id,
});

const validationErrors = ref({
  title: false,
});

const addTask = () => {
  validationErrors.value.title = false;

  if (!newTask.value.title.trim()) {
    validationErrors.value.title = true;
    return;
  }

  emit("add-task", { ...newTask.value });
  resetForm();
};
</script>

<template>
  <Teleport to="body">
    <Transition>
      <div v-if="isOpen" class="modal-backdrop" @click="close">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2 class="text-xl font-semibold text-gray-800">Add a new Task</h2>
            <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="p-6">
            <form @submit.prevent="addTask" class="space-y-4">
              <div>
                <label for="taskTitle" class="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                <input
                  id="taskTitle"
                  v-model="newTask.title"
                  type="text"
                  placeholder="Enter task title..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-500': validationErrors.title }"
                />
                <p v-if="validationErrors.title" class="text-red-500 text-sm mt-1">Please enter a task title</p>
              </div>

              <div>
                <label for="taskDescription" class="block text-sm font-medium text-gray-700 mb-1"
                  >Description (optional)</label
                >
                <textarea
                  id="taskDescription"
                  v-model="newTask.description"
                  placeholder="Add more details about this task..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
                ></textarea>
              </div>

              <div>
                <label for="taskDueDate" class="block text-sm font-medium text-gray-700 mb-1"
                  >Due Date (optional)</label
                >
                <input
                  id="taskDueDate"
                  v-model="newTask.dueDate"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <input type="hidden" v-model="newTask.owner" />

              <div class="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  @click="resetForm"
                  class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Clear
                </button>
                <button
                  type="button"
                  @click="close"
                  class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span class="ml-1">Add Task</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
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
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 500px;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.v-enter-active,
.v-leave-active {
  transition:
    opacity 0.3s,
    transform 0.3s;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
