import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { CryptoModule } from "../crypto/crypto.module";
import { LocalStrategy } from "./strategies/local.strategy";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt-access.strategy";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { EnvironmentVariables } from "src/config/env/configuration";
import { JwtRefreshStrategy } from "./strategies/jwt-refresh.strategy";
import { OtpModule } from "../otp/otp.module";


@Module({
    imports: [
        UserModule,
        CryptoModule,
        OtpModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService<EnvironmentVariables>) => ({
              secret: configService.get('jwtSecret'),
              signOptions: { expiresIn: '30m' },
            }),
          }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        JwtRefreshStrategy,
    ],
})
export class AuthModule { }