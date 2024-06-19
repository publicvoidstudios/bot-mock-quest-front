import { describe, it, expect } from 'vitest'
import { getUserFromStorage } from './getUserFromStorage'
import { storeUser} from "@/ts/storeUser";
import type {User} from "@/ts/types";

describe('getUserFromStorage', () => {
    it('should return a `User` object from localStorage', () => {
        const user: User = {
            id: 123,
            username: 'JohnDoe',
            role: 'admin',
            hashed_password: '',
            messages: [],
            tasks: []
        }
        storeUser(user);
        const returnedUser = getUserFromStorage()
        expect(returnedUser).toBeTypeOf('object')
        expect(returnedUser).toHaveProperty('hashed_password')
        expect(returnedUser.hashed_password).toBeTypeOf('string')
    })

    it('should return null if there is no user in localStorage', () => {
        localStorage.removeItem('user')
        const user = getUserFromStorage()
        expect(user).toBeNull()
    })
})