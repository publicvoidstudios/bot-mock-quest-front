<template>
  <NavBar :user="user"></NavBar>
  <div class="container mx-auto mt-7 text-fontSecondary">
    <h1 class="text-2xl">Welcome, <span class="font-bold text-primaryLight">{{user.username}}</span>!</h1>

    <div v-if="user.role === 'guest'" class="mx-auto flex flex-col items-center mt-7 bg-white shadow-lg rounded-lg p-4">
      <p class="text-lg">Please login to get access to assign-o-bot features!</p>
      <br>
      <router-link to="/login" class="bg-primary text-white text-2xl font-bold p-4 m-4 rounded-lg shadow-md hover:bg-opacity-75">Login</router-link>
    </div>
    <div v-else-if="user.role !== 'guest' && user.role !== 'admin'">
      <p>You have {{user.tasks?.length || 0}} tasks.</p>
      <div class="bg-white mt-7 p-4 rounded">
        <h1 class="mb-4 font-bold text-3xl">Tasks:</h1>
        <div class="bg-primaryLightOpaque p-4 rounded" v-for="task in user.tasks">
          <h2 class="font-bold">{{task.name}}</h2>
          <p class="mt-2">{{task.description}}</p>
          <p class="italic mt-2">Created at: {{DateTime.fromISO(task.created_at).toLocaleString()}}</p>
        </div>
      </div>
      <div class="absolute bottom-[30px] right-[30px] w-[60px] h-[60px] bg-primary rounded-full flex items-center justify-center cursor-pointer" @click="toggleMessages">
        <img class="w-[30px] filter invert" src="../assets/chat-svgrepo-com.svg" alt="">
        <span v-if="user.messages?.length" class="absolute top-[-10px] right-[-10px] bg-red-600 p-1 px-3 rounded-full text-white font-semibold">
          {{user.messages?.length}}
        </span>
      </div>
      <div v-if="showMessages" class="absolute bottom-[20px] right-[20px] bg-white h-[80vh] w-[300px] rounded-lg shadow-lg p-4 pt-8 overflow-auto">
        <span class="absolute top-0 right-0 bg-primary text-white w-5 h-5 flex justify-center items-center rounded-lg font-bold cursor-pointer" @click="toggleMessages">&times;</span>
        <div v-for="msg in messages" class="bg-primaryLightOpaque p-2 rounded shadow">
          <p class="text-sm">A new task is available:</p>
          <p class="font-bold text-xl">{{msg.name}}</p>
          <p>{{msg.description}}</p>
          <div class="flex flex-wrap gap-1 justify-center text-white drop-shadow">
            <button class="bg-green-500 p-2 rounded my-2" @click="reactOnTask(msg.id, 'accept')">Accept</button>
            <button class="bg-red-500 p-2 rounded my-2" @click="reactOnTask(msg.id, 'decline')">Decline</button>
            <button class="bg-amber-500 p-2 rounded my-2" @click="reactOnTask(msg.id, 'postpone')">Ask me later</button>
          </div>
        </div>

      </div>
    </div>
    <div v-else>
      <form class="flex flex-col items-center mt-7 bg-white rounded-2xl p-4 text-primary ">
        <h2 class="text-xl uppercase font-bold">Create new task</h2>
        <div>
          <label for=""></label>

        </div>
        <div class="flex flex-col items-start my-4">
          <label for="name" class="text-lg">Task name:</label>
          <input class="form-input form-input--no-image ps-0" id="name" type="text" v-model="name" placeholder="Type a sensible name for a task...">
        </div>

        <div class="flex flex-col items-start my-4">
          <label for="description" class="text-lg">Task description:</label>
          <textarea class="form-input form-input--no-image ps-0" id="description" type="text"  v-model="description" placeholder="Describe your task"/>
        </div>

        <div class="flex flex-col items-start my-4">
          <label for="roles" class="text-lg">Possible roles:</label>
          <input class="form-input form-input--no-image ps-0" id="roles" type="text" @input="convertInputToArray" v-model="roles"  placeholder="Task Roles, comma separated list of roles.">
          <p>Possible values:
            <span @click.prevent="roles += 'frontend, '">frontend</span>,
            <span @click.prevent="roles += 'backend, '">backend</span>,
            <span @click.prevent="roles += 'fullstack, '">fullstack</span>,
            <span @click.prevent="roles += 'designer, '">designer</span>,
            <span @click.prevent="roles += 'qa, '">qa</span>.</p>
        </div>

        <div class="flex flex-col items-start my-4">
          <label for="name" class="text-lg">Expires in (mins):</label>
          <input class="form-input form-input--no-image ps-0" id="name" type="number" v-model="timeout" placeholder="How many minutes till expiration">
          <p>Please note: 1 hour is always reserved for all tasks as a minimum</p>
        </div>
        <button class="bg-primary text-secondary font-bold p-4 text-2xl rounded-lg shadow hover:bg-opacity-85" @click="createNewTask">Create Task</button>
      </form>

    </div>
  </div>


</template>

<script setup lang="ts">
import {type Ref, ref} from 'vue';
import axios from 'axios';
import {getUserFromStorage} from "@/ts/getUserFromStorage";
import NavBar from "@/components/NavBar.vue";
import { DateTime } from 'luxon'

const name: Ref<string> = ref('');
const description: Ref<string> = ref('');
const roles: Ref<string> = ref('');
const rolesArray: Ref<Array<string>> = ref([]);
const author: Ref<number> = ref(-1);
const timeout: Ref<number> = ref(1);

import type {User} from 'src/ts/types'
import {getUserData} from "@/ts/getUserData";

const showMessages = ref(false);

let user = getUserFromStorage();
getUserData(user.id)

const messages: Object[] = [];

user.messages?.forEach(message => {
  const msg = JSON.parse(message.body)
  messages.push(msg);
});

const toggleMessages = () => {
  showMessages.value = !showMessages.value;
}

const reactOnTask = async (task_id: number, action: 'accept' | 'decline' | 'postpone') => {
  await axios.put('http://localhost:3000/api/v1/put/tasks', {
    user_id: user.id,
    task_id: task_id,
    action: action
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
</script>

