import { Body, Controller, Post } from "@nestjs/common";
import { OtpService } from "./otp.service";
import { Public } from "src/common/decorators/public.decorator";

@Controller('otp')
export class OtpController {
    constructor(
        private readonly otpService: OtpService
    ) { }

    @Public()
    @Post('request-otp')
    public async requestOtp(@Body() data: { email: string }) {
        return this.otpService.generateOtp(data.email)
    }

    @Public()
    @Post('verify-otp')
    public async verifyOtp(@Body() data: { email: string, otp: string }) {
        return this.otpService.verifyOtp(data.email, data.otp)
    }
}