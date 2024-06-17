import type {User} from "@/ts/types";

export const getUserFromStorage = (): User => {
    return JSON.parse(localStorage.getItem('user') as string) as User
}