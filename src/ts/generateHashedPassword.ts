import bcrypt from 'bcryptjs'

export const generateHashedPassword = async (password: string, password_repeat: string) => {
    if(password.length && password_repeat.length) {

        if(password === password_repeat) {

            const saltRounds = 10;
            const generateHashedPassword = (plaintextPassword: string, saltRounds: number) => {
                return new Promise((resolve, reject) => {
                    bcrypt.genSalt(saltRounds, (err, salt) => {
                        bcrypt.hash(plaintextPassword, salt, (err, hash) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(hash);
                            }
                        });
                    });
                });
            };

            let hashed_password: string | unknown;
            await generateHashedPassword(password, saltRounds)
                .then((hashedPassword) => {
                    hashed_password = hashedPassword;
                })
                .catch((error) => {
                    console.error(error);
                });
            return hashed_password as string;

        } else {
            return null;
        }
    } else {
        return null;
    }
}