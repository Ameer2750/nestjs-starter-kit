import { Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { CryptoService } from "../crypto/crypto.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { EnvironmentVariables } from "src/config/env/configuration";
import { OtpService } from "../otp/otp.service";


type SignupType = {
    firstName: string;
    lastName?: string;
    email: string;
    phone: string;
    password: string;
    roleId: number;
}

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly cryptoService: CryptoService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService<EnvironmentVariables>,
        private readonly otpService: OtpService
    ) { }

    public async validateUserForLocalStrategy(email: string, password: string) {
        try {
            const user = await this.userService.findOneByEmailOrPhone({ email });
            const isMatch = await this.cryptoService.compareHash(password, user.user.password);

            if (user.user && isMatch) {
                return user.user;
            }
            return null;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    public async generateTokens(id: number) {
        if (!id) return { message: 'please provide valid id' }

        const payload = { sub: id }
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('jwtRefreshSecret'),
            expiresIn: '7d'
        })

        const hashedRefreshToken = await this.cryptoService.generateArgonHash(refreshToken);
        await this.userService.updateRefreshToken(id, hashedRefreshToken)

        return {
            accessToken,
            refreshToken
        }
    }

    public async signup(signupType: SignupType) {
        try {
            const { user } = await this.userService.createUser(signupType);
            await this.otpService.generateOtp(user.email)

            return {
                success: true,
                message: `Otp Sent Successfully. please check your email`
            }

        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    public async login(user: any) {
        try {
            const { accessToken, refreshToken } = await this.generateTokens(user.id)

            return {
                ...user,
                accessToken,
                refreshToken
            }
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    public async refresh(user: any) {
        try {
            const { accessToken, refreshToken } = await this.generateTokens(user.id)

            return {
                accessToken,
                refreshToken
            }
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    public async validateRefreshToken(userId: number, refreshToken: string) {
        try {

            const user = await this.userService.findOneById(userId);

            if (!user.user || !user.user.hashedRefreshToken)
                throw new UnauthorizedException('Invalid Refresh Token');

            const isRefreshTokenMatch = await this.cryptoService.verifyArgonHash(user.user.hashedRefreshToken, refreshToken);

            if (!isRefreshTokenMatch)
                throw new UnauthorizedException('Invalid Refresh Token');

            return { id: userId, user: user.user }

        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    public async signOut(userId: number) {
        try {
            await this.userService.updateRefreshToken(userId, null)
            return 'logout successfully'
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }
}
