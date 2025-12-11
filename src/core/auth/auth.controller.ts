import { Body, Controller, Get, Post, Request, Res, UseGuards } from "@nestjs/common";
import { Public } from "src/common/decorators/public.decorator";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { AuthService } from "./auth.service";
import { JwtRefreshAuthGuard } from "./guards/jwt-refresh.guard";
import { SignupDto } from "./dtos";
import { Response } from "express";

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

    @Post("login")
    @Public()
    @UseGuards(LocalAuthGuard)
    async login(
        @Request() req,
        @Res({ passthrough: true }) res: Response
    ) {
        const {
            accessToken,
            refreshToken,
            password,
            hashedRefreshToken,
            ...rest
        } = await this.authService.login(req.user);

        // ACCESS TOKEN
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            maxAge: 1000 * 60 * 60 * 24,
        });

        // REFRESH TOKEN
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });


        return { ...rest }; // no tokens in body
    }

    // @Public()
    // @UseGuards(JwtRefreshAuthGuard)
    // @Get('refresh')
    // public async refresh(@Request() req: any) {
    //     return this.authService.refresh(req.user);
    // }

    @Public()
    @UseGuards(JwtRefreshAuthGuard)
    @Post("refresh")
    async refresh(
        @Request() req: any,
        @Res({ passthrough: true }) res: Response
    ) {
        // This returns new access + refresh tokens
        const { accessToken, refreshToken } =
            await this.authService.refresh(req.user);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",   // <-- FIXED
            path: "/",
            maxAge: 1000 * 60 * 60 * 24,
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",   // <-- FIXED
            path: "/",
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });

        return { success: true };
    }


}