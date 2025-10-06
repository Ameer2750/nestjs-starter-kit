import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { Public } from "src/common/decorators/public.decorator";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { AuthService } from "./auth.service";
import { JwtRefreshAuthGuard } from "./guards/jwt-refresh.guard";
import { SignupDto } from "./dtos";

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) { }

    @Get('test')
    public async test(@Request() req: any) {
        return 'success';
    }

    @Public()
    @Post('signup')
    public async signup(@Body() signupDto: SignupDto) {
        return await this.authService.signup(signupDto);
    }

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    public async login(@Request() req: any) {
        const data = await this.authService.login(req.user);
        return data
    }

    @Public()
    @UseGuards(JwtRefreshAuthGuard)
    @Get('refresh')
    public async refresh(@Request() req: any) {
        return this.authService.refresh(req.user);
    }


}