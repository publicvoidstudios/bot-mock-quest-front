import { getUserData } from '@/ts/getUserData';
import type { User } from '../ts/types';

import {vi, describe, it, expect } from "vitest";

vi.mock('fetch', () => {
    const fetch = vi.fn();
    fetch.mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve({data: [{id: 1, name: 'CodeLlama'}]})
    }));
    return fetch;
});

describe('getUserData', () => {
    it('should fetch user data from the API and store it in local storage', async () => {
        const userId = 1;
        const userList: User[] = [
            {
                id: 1,
                username: 'user1',
                role: 'admin',
                hashed_password: '$2y$10$EftuHDC5meOtaLUatj1l7.DffJhQC9Y0ROemVbWBdeIzCJk3F5P5y',
                messages: [],
                tasks: []
            },
            {
                id: 2,
                username: 'user2',
                role: 'admin',
                hashed_password: '$2y$10$5zmTe5wlHM5Rex2MZ9G1Uu4q2KdojlzfQdDzBBSbnlmqxiNxNqujK',
                messages: [],
                tasks: []
            }
        ];
        const mockFetch = vi.fn();
        mockFetch.mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve(userList),
            }),
        );

        global.fetch = mockFetch;

        const expectedResult = userList[0];

        await getUserData(userId);

        const actualResult = localStorage.getItem('user');

        const userFromResult = JSON.parse(actualResult as string);

        expect(actualResult).toBeTypeOf('string');

        expect(userFromResult).toStrictEqual(expectedResult);
    });
});