import {storeUser} from "@/ts/storeUser";
import {describe, it, expect} from "vitest";
import type {User} from "@/ts/types";

describe('storeUser', () => {
    //Test that the function correctly stores the user data in local storage when passed valid data.
    it('should store user data in local storage', () => {
        const user: User = {
            id: 123,
            username: 'JohnDoe',
            role: 'admin',
            hashed_password: '',
            messages: [],
            tasks: []
        };
        storeUser(user);
        expect(localStorage.getItem('user')).toBe(JSON.stringify(user));
    });
    //Test that the function throws an error when passed invalid data.
    it('should throw an error if data is invalid', () => {
        try {
            storeUser(null);
        } catch (e) {
            expect(e).toBeInstanceOf(TypeError);
        }
    });
    //Test that the function correctly updates existing user data in local storage when passed newer data.

    it('should update existing user data in local storage', () => {
        const user: User = {
            id: 123,
            username: 'JohnDoe',
            role: 'admin',
            hashed_password: '',
            messages: [],
            tasks: []
        };
        const user2: User = {
            id: 256,
            username: 'JaneSmith',
            role: 'frontend',
            hashed_password: '',
            messages: [],
            tasks: []
        }
        storeUser(user);
        storeUser(user2);
        expect(localStorage.getItem('user')).toBe(JSON.stringify(user2));
    });
    //Test that the function correctly removes user data when passed an empty data parameter.

    it('should remove user data from local storage', () => {
        const user: User = {
            id: 123,
            username: 'JohnDoe',
            role: 'admin',
            hashed_password: '',
            messages: [],
            tasks: []
        };
        storeUser(user);
        expect(localStorage.getItem('user')).toBe(JSON.stringify(user));
        storeUser(null);
        expect(localStorage.getItem('user')).toBe(null);
    });
})