<script setup lang="ts">
import {DateTime} from "luxon";
import type {Task, TaskStatus, User} from 'src/ts/types'

defineProps({
  task: {
    type: Object as () => Task,
    required: true
  },
  status: {
    type: String as () => TaskStatus,
    required: false
  },
  admin: {
    type: Boolean,
    required: false
  },
  users: {
    type: Array as () => Array<User>,
    required: false
  }
})
</script>

<template>
  <div class="bg-white rounded-2xl shadow p-2.5 flex flex-col min-w-[320px] w-auto flex-grow">
    <span class="font-semibold text-gray-400 select-none">{{DateTime.fromISO(task.created_at).toLocaleString({day: 'numeric', month: 'long', year: 'numeric'})}}</span>
    <div class="px-6 py-2 border-b-2 border-gray-200 my-2 h-24">
      <h2 class="font-semibold text-xl text-gray-900 text-nowrap truncate">{{task.name}}</h2>
      <div class="flex flex-wrap gap-2">
        <p class="uppercase bg-primaryLightOpaque rounded-full px-2 select-none" v-for="role in task.roles">{{ role }}</p>
      </div>
      <p class="text-sm pt-2" v-if="admin && users">Assigned to: <span class="px-2 bg-primaryLight text-white rounded-full">{{(users.find(user => user.id === task.assigned_to))?.username || 'N/A'}}</span></p>
    </div>

    <!--  If it's a new task from messages and it's not expired  -->
    <div
        class="flex flex-wrap justify-end"
        v-if="!admin && task.assigned_to === null && DateTime.fromMillis((DateTime.fromISO(task.created_at).toMillis() + task.timeout) - DateTime.fromISO(DateTime.now().toISO()).toMillis()).toMillis() > 0"
    >
      <div class="self-end flex gap-2 flex-wrap px-2 py-1 select-none">
        <button class="btn btn-danger" @click="$emit('reactOnTask', task.id, 'decline', task.message_id)">Decline</button>
        <button v-if="status && status === 'new'" class="btn btn-warning" @click="$emit('reactOnTask', task.id, 'postpone')">Ask later</button>
        <button class="btn btn-success" @click="$emit('reactOnTask', task.id, 'accept', task.message_id)">Accept</button>
      </div>
      <span class="self-end bg-primary bg-opacity-50 rounded-full px-2 py-1 text-white font-semibold select-none">
        {{ DateTime.fromISO(task.created_at).plus({ milliseconds: task.timeout }).diffNow().toFormat('hh:mm') + ' left' }}
      </span>
    </div>

    <!--  If it's a new task at admin and it's not expired  -->
    <div
        class="flex flex-wrap justify-end"
        v-if="admin && task.assigned_to === null && DateTime.fromMillis((DateTime.fromISO(task.created_at).toMillis() + task.timeout) - DateTime.fromISO(DateTime.now().toISO()).toMillis()).toMillis() > 0"
    >
      <span class="self-end bg-primary bg-opacity-50 rounded-full px-2 py-1 text-white font-semibold select-none">
        {{ 'Expires in: ' + DateTime.fromISO(task.created_at).plus({ milliseconds: task.timeout }).diffNow().toFormat('hh:mm') }}
      </span>
    </div>

    <!--  If it's a new task from messages and it is expired  -->
    <div class="flex flex-col justify-end items-end gap-2" v-if="task.assigned_to === null && DateTime.fromMillis((DateTime.fromISO(task.created_at).toMillis() + task.timeout) - DateTime.fromISO(DateTime.now().toISO()).toMillis()).toMillis() <= 0">
      <button class="btn btn-secondary" @click="$emit('dismiss', task.message_id)">Dismiss</button>
      <span class="self-end bg-primary bg-opacity-50 rounded-full px-2 py-1 text-white font-semibold select-none">
        Expired
      </span>

    </div>

    <!--  If it's a task from user's tasks  -->
    <span
        class="self-end bg-primary bg-opacity-50 rounded-full px-2 py-1 text-white font-semibold select-none"
        v-if="task.assigned_to !== null">
      {{ DateTime.fromMillis((DateTime.fromISO(task.created_at).toMillis() + task.timeout) - DateTime.fromISO(DateTime.now().toISO()).toMillis()).toMillis() > 0
        ? DateTime.fromMillis((DateTime.fromISO(task.created_at).toMillis() + task.timeout) - DateTime.fromISO(DateTime.now().toISO()).toMillis()).toLocaleString({ hour: 'numeric' }) + ' hours left'
        : 'Past due' }}
    </span>
  </div>
</template>