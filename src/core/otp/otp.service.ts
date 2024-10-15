import { Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as moment from 'moment';
import { DRIZZLE_ORM } from "src/common/utils/constants/db.constant";
import { randomOtp } from "src/common/utils/helpers";
import * as schema from 'src/drizzle/schema';
import { UserService } from "../user/user.service";
@Injectable()
export class OtpService {
    constructor(
        @Inject(DRIZZLE_ORM) private readonly drizzle: PostgresJsDatabase<typeof schema>,
        private readonly userService: UserService
    ) { }


    public async generateOtp(email: string) {
        try {

            const otp = randomOtp();
            const expiresAt = moment().add(1, 'minutes').toDate();

            const payload: { email: string; otp: string; expiresAt: Date } = {
                email,
                otp,
                expiresAt
            }

            await this.drizzle
                .insert(schema.otpTable)
                .values(payload)

            console.log(payload);

        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    public async verifyOtp(email: string, otp: string) {
        try {
            const [otpTableData] = await this.drizzle
                .select()
                .from(schema.otpTable)
                .where(and(
                    eq(schema.otpTable.otp, otp),
                    eq(schema.otpTable.email, email)
                ))
                .limit(1)

            if (!otpTableData) {
                throw new NotFoundException(`please enter valid otp and email`)
            }

            const currentTime = moment().utc();
            const otpExpiresAt = moment(otpTableData.expiresAt).utc();

            console.log({ currentTime: currentTime.toISOString(), otpExpiresAt: otpExpiresAt.toISOString() });

            const isOtpValid = otpTableData.otp === otp && currentTime.isBefore(otpExpiresAt);

            if (!isOtpValid) {
                return {
                    message: 'Otp is expired'
                }
            }

            await this.userService.activateUser(otpTableData.email)


            await this.drizzle.delete(schema.otpTable).where(and(
                eq(schema.otpTable.otp, otp),
                eq(schema.otpTable.email, email)
            ));

            return {
                success: true,
                message: 'otp is valid ! Your account is verified successfully'
            }

        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

}