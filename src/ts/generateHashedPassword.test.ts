import { generateHashedPassword } from './generateHashedPassword';
import { describe, it, expect } from 'vitest'

describe('generateHashedPassword', () => {
    it('should generate a hashed password if passwords match', async () => {
        const password = 'password123';
        const passwordRepeat = 'password123';

        const hashedPassword = await generateHashedPassword(password, passwordRepeat);
        expect(hashedPassword).toBeTypeOf('string');
    });

    it('should not generate a hashed password with different passwords', async () => {
        const password = 'password123';
        const passwordRepeat = 'password456';

        const hashedPassword = await generateHashedPassword(password, passwordRepeat);
        expect(hashedPassword).toBeNull();
    });
});