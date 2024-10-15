import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import * as argon2 from 'argon2';

@Injectable()
export class CryptoService {
    public async generateHash(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }

    public async compareHash(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    public async generateArgonHash(token: string): Promise<string> {
        const hash = await argon2.hash(token);
        return hash;
    }

    public async verifyArgonHash(hash: string, token: string): Promise<boolean> {
        const verify = argon2.verify(hash, token);
        return verify;
    }
}
