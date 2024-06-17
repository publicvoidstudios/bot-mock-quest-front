import { defineStore } from "pinia";
import type {Message, User, Task} from "@/ts/types";

export const useAuthStore = defineStore("AuthStore", {
    state: () => ({
        id: -1,
        username: '',
        hashed_password: '',
        role: '',
        messages: [] as Message[],
        tasks: [] as Task[],
    }),
    actions: {
        login(user: User):void {
            this.id = user.id;
            this.username = user.username;
            this.hashed_password = user.hashed_password;
            this.role = user.role;
            this.messages = user.messages;
            this.tasks = user.tasks;
        },
        logout():void {
            this.id = -1;
            this.hashed_password = '';
            this.role = '';
            this.messages = [];
            this.tasks = [];
        }
    }
})