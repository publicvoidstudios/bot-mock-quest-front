import type {User} from "@/ts/types";

export const getUserData = async (user_id: number) => {
    let userList: User[] = [];

    await fetch('http://localhost:3000/api/v1/get/users')
        .then(res => res.json())
        .then(users => {
            userList = users
        })

    if(userList){
        const user: User | undefined = userList.find(user => user.id === user_id);
        if(user) {
            localStorage.setItem('user', JSON.stringify(user));
        }
    }
}