import { IsString, IsEmail, IsNotEmpty, IsPhoneNumber, MinLength, IsInt } from 'class-validator';
import { IsIndianPhoneNumber } from 'src/common/decorators/is-indian-phone-number.decorator';

export class SignupDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsIndianPhoneNumber()  // 'null' allows it to accept any country code.
    @IsNotEmpty()
    phone: string;

    @IsString()
    @MinLength(6)  // Set minimum length for password security.
    @IsNotEmpty()
    password: string;

    @IsInt()
    @IsNotEmpty()
    roleId: number;
}
