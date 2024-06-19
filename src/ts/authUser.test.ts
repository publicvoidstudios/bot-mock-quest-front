import { authUser } from "./authUser";
import { describe, it, expect } from 'vitest'
import type {User} from "@/ts/types";

describe("authUser", () => {
    const users: User[] = [
        {
            id: 0,
            username: 'user1',
            role: 'admin',
            hashed_password: '$2y$10$EftuHDC5meOtaLUatj1l7.DffJhQC9Y0ROemVbWBdeIzCJk3F5P5y',
            messages: [],
            tasks: []
        },
        {
            id: 0,
            username: 'user2',
            role: 'admin',
            hashed_password: '$2y$10$5zmTe5wlHM5Rex2MZ9G1Uu4q2KdojlzfQdDzBBSbnlmqxiNxNqujK',
            messages: [],
            tasks: []
        }
    ];

    it("should return the user when valid username and password are provided", () => {
        const username = "user1";
        const password = "password1";

        const result = authUser(users, username, password);

        expect(result).toEqual(users[0]);
    });

    it("should return null when invalid password is provided", () => {
        const username = "user1";
        const password = "wrongpassword";

        const result = authUser(users, username, password);

        expect(result).toBeNull();
    });

    it("should return null when invalid username is provided", () => {
        const username = "nonexistentuser";
        const password = "password1";

        const result = authUser(users, username, password);

        expect(result).toBeNull();
    });
});