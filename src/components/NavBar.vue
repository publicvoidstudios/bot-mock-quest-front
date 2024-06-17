  <script setup lang="ts">
  import type { User } from 'src/ts/types'
  import {storeUser} from "@/ts/storeUser";

  defineProps({
    user: {
      type: Object as () => User,
    }
  })

  const logout = () => {
    storeUser({
      hashed_password: "",
      id: -1,
      messages: [],
      role: "guest",
      tasks: [],
      username: "guest"
    });
  }
  </script>

  <template>
  <nav class=" bg-primary text-white p-4">
    <ul class="flex justify-between items-center">
      <li>
        <router-link to="/" class="font-bold text-2xl drop-shadow-md hover:text-gray-700">ASSIGN-O-BOT</router-link>
      </li>
      <li class="bg-primaryLight p-2 rounded hover:bg-opacity-50" v-if="user?.id !== -1">
        <router-link to="/login" class="drop-shadow" @click="logout">Logout</router-link>
      </li>
      <li class="bg-primaryLight p-2 rounded hover:bg-opacity-50" v-if="user?.id === -1">
        <router-link to="/login" class="drop-shadow">Login</router-link>
      </li>
    </ul>
  </nav>
  </template>