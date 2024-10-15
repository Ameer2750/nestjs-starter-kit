import { Module } from "@nestjs/common";
import { OtpService } from "./otp.service";
import { UserModule } from "../user/user.module";
import { OtpController } from "./otp.controller";

@Module({
    imports: [UserModule],
    controllers: [OtpController],
    providers: [OtpService],
    exports: [OtpService]
})
export class OtpModule { }