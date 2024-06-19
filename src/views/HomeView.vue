<template>
  <NavBar :user="user"></NavBar>
  <div class="container mx-auto mt-7 text-fontSecondary bg-white rounded-2xl p-4">
    <h1 class="text-2xl">Welcome, <span class="font-bold text-primaryLight">{{user.username}}</span>!</h1>

    <div v-if="user.role === 'guest'" class="mx-auto flex flex-col items-center mt-7 bg-white shadow-lg rounded-lg p-4">
      <p class="text-lg">Please login to get access to assign-o-bot features!</p>
      <br>
      <router-link to="/login" class="bg-primary text-white text-2xl font-bold p-4 m-4 rounded-lg shadow-md hover:bg-opacity-75">Login</router-link>
    </div>
    <div v-else-if="user.role === 'admin'">
      <button class="btn btn-primary mt-7" @click="toggleModal">Create new task</button>
      <div v-if="unassignedTasks.length" class="mt-7">
        <h2 class="font-semibold mb-2">Unassigned tasks:</h2>
        <div class="flex flex-wrap mb-4 gap-2 justify-start items-start">
          <task-element :task="task" :admin="true" v-for="task in unassignedTasks"></task-element>
        </div>
      </div>
      <div v-if="assignedTasks.length" class="mt-7">
        <h2 class="font-semibold mb-2">Assigned tasks:</h2>
        <div class="flex flex-wrap mb-4 gap-2 justify-start items-start">
          <task-element :task="task" :admin="true" :users="users" v-for="task in assignedTasks"></task-element>
        </div>
      </div>

    </div>
    <div v-else>
      <p class="mt-2">You have {{user.tasks?.length || 0}} task(s).</p>
      <div class="bg-secondary mt-7 p-4 rounded-2xl">
        <div v-if="user.tasks?.length">
          <h2 class="mb-4 font-bold text-3xl">Your tasks:</h2>
          <div class="flex flex-wrap mb-4 gap-2 justify-center items-start">
            <task-element :task="task" v-for="task in user.tasks"></task-element>
          </div>
        </div>
        <div v-if="tasksFromMessages?.length">
          <h2 class="mb-4 font-bold text-3xl">New tasks:</h2>
          <div class="flex flex-wrap gap-2 justify-center items-start">
            <task-element @dismiss="removeMessage" @reactOnTask="reactOnTask" :task="task" :status="task.status" v-for="task in tasksFromMessages"></task-element>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Task Creation Modal -->
  <modal-window @toggleModal="toggleModal" :visible="modalVisible">
    <template v-slot:header>
      <h2>Create new task</h2>
    </template>
    <template v-slot:body>
      <div class="input-container">
        <label for="name" class="input-label">Task name:</label>
        <input class="form-input" id="name" type="text" v-model="name" placeholder="Type a sensible name for a task...">
      </div>
      <div class="input-container">
        <label for="description" class="text-lg">Task description:</label>
        <textarea class="form-input" id="description" type="text"  v-model="description" placeholder="Describe your task"/>
      </div>
      <div class="input-container">
        <label for="roles" class="text-lg">Possible roles:</label>
        <input class="form-input" id="roles" type="text" @input="convertInputToArray" v-model="roles"  placeholder="Task Roles, comma separated list of roles.">
        <p>Possible values:
          <span @click.prevent="roles += 'frontend, '">frontend</span>,
          <span @click.prevent="roles += 'backend, '">backend</span>,
          <span @click.prevent="roles += 'fullstack, '">fullstack</span>,
          <span @click.prevent="roles += 'designer, '">designer</span>,
          <span @click.prevent="roles += 'qa, '">qa</span>.</p>
      </div>
      <div class="input-container">
        <label for="name" class="text-lg">Expires in (mins):</label>
        <input class="form-input" id="name" type="number" v-model="timeout" placeholder="How many minutes till expiration">
        <p>Please note: 1 hour is always reserved for all tasks as a minimum</p>
      </div>
    </template>
    <template v-slot:footer>
      <button class="btn btn-secondary" @click="toggleModal">Close</button>
      <button class="btn btn-primary" @click="createNewTask">Create Task</button>
    </template>
  </modal-window>
</template>

<script setup lang="ts">
import {onMounted, type Ref, ref} from 'vue';
import axios from 'axios';
import {getUserFromStorage} from "@/ts/getUserFromStorage";
import NavBar from "@/components/NavBar.vue";
import { DateTime } from 'luxon'
import type {User, Role, Task} from 'src/ts/types'
import {getUserData} from "@/ts/getUserData";
import ModalWindow from "@/components/ModalWindow.vue";
import TaskElement from "@/components/TaskElement.vue";

const name: Ref<string> = ref('');
const description: Ref<string> = ref('');
const roles: Ref<string> = ref('');
const rolesArray: Ref<Array<string>> = ref([]);
const author: Ref<number> = ref(-1);
const timeout: Ref<number> = ref(1);

const modalVisible = ref(false);

const tasks = ref([])

const assignedTasks = ref([])
const unassignedTasks = ref([])

const users = ref([])

let user = getUserFromStorage();
getUserData(user.id)

const tasksFromMessages: Task[] = [];
user.messages?.forEach(message => {
  const msg = JSON.parse(message.body)
  msg.status = message.status;
  msg.message_id = message.id;
  tasksFromMessages.push(msg);
});

const removeMessage = async (message_id: number) => {
  await axios.delete('http://localhost:3000/api/v1/delete/messages', {
    data: {
      message_id: message_id,
      user_id: user.id
    }
  })

  await getUserData(user.id)
  user = getUserFromStorage();
}

const toggleModal = () => {
  modalVisible.value = !modalVisible.value;
}

const reactOnTask = async (task_id: number, action: 'accept' | 'decline' | 'postpone', message_id?: number) => {
  await axios.put('http://localhost:3000/api/v1/put/tasks', {
    user_id: user.id,
    task_id: task_id,
    action: action,
    message_id: message_id || null
  })

  await getUserData(user.id)
  user = getUserFromStorage();
}

const convertInputToArray = () => {
  rolesArray.value = roles.value.split(',').map(value => value.trim());
};

const createNewTask = async () => {
  try {
    convertInputToArray();

    const response = await axios.post('http://localhost:3000/api/v1/post/task', {
      name: name.value,
      description: description.value,
      roles: rolesArray.value,
      author_id: user.id,
      timeout: (timeout.value * 60000)
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200) {
      console.log('Task created successfully!');
      name.value = '';
      description.value = '';
      roles.value = '';
      author.value = -1;
      timeout.value = 1;
      convertInputToArray();
    } else {
      console.error('Failed to create task.');
    }
  } catch (error) {
    console.error('Error creating task:', error?.message, error?.response?.data?.message);
  }
}

const fetchTasks = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/v1/get/tasks');
    tasks.value = response.data;
    assignedTasks.value = tasks.value.filter(task => task.assigned_to !== null);
    unassignedTasks.value = tasks.value.filter(task => task.assigned_to === null);
  } catch (e) {
    console.error('Failed to fetch tasks:', e);
  }
}

const fetchUsers = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/v1/get/users');
    users.value = response.data;
  } catch (e) {
    console.error('Failed to fetch tasks:', e);
  }
}

onMounted(() => {
  fetchTasks()
  fetchUsers()
})

</script>

