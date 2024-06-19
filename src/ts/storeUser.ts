import type {User} from "@/ts/types";

export const storeUser = (data: User | null): void => {
    if(data) {
        localStorage.setItem('user', JSON.stringify(data));
    } else {
        localStorage.removeItem('user');
    }

}