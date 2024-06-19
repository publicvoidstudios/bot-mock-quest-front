import type { User } from 'src/ts/types'
import bcrypt from "bcryptjs";

export const authUser = (users: User[], username: string, password: string) => {

    const user = users.find(user => user.username === username);

    //If user found
    if(user !== undefined) {
        //Compare hashed password and input password
        if(bcrypt.compareSync(password, user.hashed_password)) {
            return user;
        } else {
            return null;
        }
    } else {
        //Reject
        return null;
    }
}