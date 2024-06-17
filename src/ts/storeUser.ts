import type {User} from "@/ts/types";

export const storeUser = (data: User): void => {
    localStorage.setItem('user', JSON.stringify(data));
}