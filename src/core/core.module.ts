import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { CryptoModule } from "./crypto/crypto.module";
import { AuthModule } from "./auth/auth.module";
import { OtpModule } from "./otp/otp.module";

@Module({
    imports: [
        CryptoModule,
        UserModule,
        AuthModule,
        OtpModule,
    ]
})
export class CoreModule {}  