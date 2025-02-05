import { Injectable } from "@nestjs/common";
import * as argon2 from 'argon2';

@Injectable()
export class CryptoService {
    public async generateHash(password: string): Promise<string> {
        const hash = await argon2.hash(password);
        return hash;
    }

    public async compareHash(password: string, hash: string): Promise<boolean> {
        return argon2.verify(password, hash);
    }

    public async generateArgonHash(token: string): Promise<string> {
        return await argon2.hash(token);
    }

    public async verifyArgonHash(hash: string, token: string): Promise<boolean> {
        return await argon2.verify(hash, token);;
    }
}
