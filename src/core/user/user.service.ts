import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { DRIZZLE_ORM } from "src/common/utils/constants/db.constant";
import * as schema from 'src/drizzle/schema';
import { CryptoService } from "../crypto/crypto.service";
import { eq, or } from "drizzle-orm";
import { validateEmailFormat, validatePhoneFormat } from "src/common/utils/helpers";

type FindOneByMailOrPhoneType = {
    email?: string;
    phone?: string;
}

type CreateUserType = {
    firstName: string;
    lastName?: string;
    roleId: number;
    hashedRefreshToken?: string;
    email: string;
    phone: string;
    password: string;
}

type UpdateUserType = {
    firstName?: string;
    lastName?: string;
    roleId?: number;
    hashedRefreshToken?: string;
    email?: string;
    phone?: string;
    password?: string;
}

@Injectable()
export class UserService {
    constructor(
        @Inject(DRIZZLE_ORM) private readonly drizzle: PostgresJsDatabase<typeof schema>,
        private readonly cryptoService: CryptoService
    ) { }



    public async findOneByEmailOrPhone(findOneByMailOrPhoneType: FindOneByMailOrPhoneType) {
        try {
            const { email, phone } = findOneByMailOrPhoneType;

            // If both email and phone are missing, throw an error
            if (!email && !phone) {
                throw new BadRequestException(`Please provide either an email or phone number.`);
            }

            // Optional: Validate email and phone formats
            if (email && !validateEmailFormat(email)) {
                throw new BadRequestException('Invalid email format.');
            }

            if (phone && !validatePhoneFormat(phone)) {
                throw new BadRequestException('Invalid phone number format.');
            }

            // Build the conditions dynamically
            let conditions = [];
            if (email) {
                conditions.push(eq(schema.userTable.email, email));
            }
            if (phone) {
                conditions.push(eq(schema.userTable.phone, phone));
            }

            // Query based on email or phone
            const [user] = await this.drizzle
                .select()
                .from(schema.userTable)
                .where(conditions.length > 1 ? or(...conditions) : conditions[0]);
            // If no user is found, return null
            if (!user) {
                throw new NotFoundException(`User Not Found`)
            }


            if (!user.accountStatus) {
                return {
                    success: false,
                    message: `Please activate user account. `
                }
            }

            if (user.isDeleted) {
                return {
                    success: false,
                    message: `User Has Deleted. Please Contact Admin`
                }
            }

            // Return the found user
            return {
                success: true,
                user
            };  // Assuming you want the first match in case of multiple records

        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }


    public async findOneById(id: number) {
        try {
            if (!id) {
                throw new BadRequestException(`Please Provide Valid Id`)
            }

            const [user] = await this.drizzle
                .select()
                .from(schema.userTable)
                .where(eq(schema.userTable.id, id))

            if (!user) {
                throw new NotFoundException(`User Not Found`)
            };

            if (user.isDeleted) {
                return {
                    success: false,
                    message: `User has deleted . please contact admin`
                }
            }

            return {
                success: true,
                user
            };
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    public async isUserActive(id: number) {
        try {

            if (!id) {
                throw new BadRequestException(`Please provide valid id`)
            }

            const [user] = await this.drizzle
                .select({
                    id: schema.userTable.id,
                    firstName: schema.userTable.firstName,
                    lastName: schema.userTable.lastName,
                    accountStatus: schema.userTable.accountStatus,
                    email: schema.userTable.email,
                    phone: schema.userTable.phone,
                    isDeleted: schema.userTable.isDeleted,
                    hashedRefreshToken: schema.userTable.hashedRefreshToken,
                })
                .from(schema.userTable)
                .where(eq(schema.userTable.id, id));

            if (!user) {
                throw new NotFoundException(`User Not Found`)
            }

            if (!user.accountStatus) {
                return {
                    success: false,
                    message: `User is Not Active Please activate user account`
                }
            }

            return {
                success: true,
                user
            };

        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    public async createUser(createUserType: CreateUserType) {
        try {

            const {
                email,
                phone,
                firstName,
                password,
                roleId,
                hashedRefreshToken,
                lastName
            } = createUserType;


            if (email && !validateEmailFormat(email)) {
                throw new BadRequestException('Invalid email format.');
            }

            if (phone && !validatePhoneFormat(phone)) {
                throw new BadRequestException('Invalid phone number format.');
            }

            const payload = {
                firstName,
                lastName,
                email,
                phone,
                password,
                roleId,
                hashedRefreshToken
            }

            const [insertUser] = await this.drizzle
                .insert(schema.userTable)
                .values(payload)
                .returning({
                    id: schema.userTable.id,
                    email: schema.userTable.email,
                    phone: schema.userTable.phone
                });

            return {
                success: true,
                user: insertUser
            }

        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    public async updateUser(id: number, updateUserType: UpdateUserType) {
        try {
            // Validate if ID is provided
            if (!id) {
                throw new BadRequestException('Please provide a valid ID');
            }

            // Validate if the update object has any fields to update
            if (Object.keys(updateUserType).length === 0) {
                throw new BadRequestException('No fields provided to update');
            }

            // Extract the fields to be updated
            const { email, phone, firstName, lastName, roleId, hashedRefreshToken, password } = updateUserType;

            // Optional: Validate email format
            if (email && !validateEmailFormat(email)) {
                throw new BadRequestException('Invalid email format.');
            }

            // Optional: Validate phone format
            if (phone && !validatePhoneFormat(phone)) {
                throw new BadRequestException('Invalid phone number format.');
            }

            // Check if the user exists
            await this.findOneById(id);  // Assuming this method throws an error if the user is not found

            // Prepare the update payload
            const payload: UpdateUserType = {};
            if (email) payload.email = email;
            if (phone) payload.phone = phone;
            if (firstName) payload.firstName = firstName;
            if (lastName) payload.lastName = lastName;
            if (roleId) payload.roleId = roleId;
            if (hashedRefreshToken) payload.hashedRefreshToken = hashedRefreshToken;
            if (password) {
                // If password is provided, hash it using the cryptoService
                payload.password = await this.cryptoService.generateHash(password);
            }

            // Update the user in the database
            const [updatedUser] = await this.drizzle
                .update(schema.userTable)
                .set(payload)
                .where(eq(schema.userTable.id, id))
                .returning({
                    id: schema.userTable.id,
                    firstName: schema.userTable.firstName,
                    lastName: schema.userTable.lastName,
                    email: schema.userTable.email,
                    phone: schema.userTable.phone,
                    roleId: schema.userTable.roleId,
                });

            if (!updatedUser) {
                throw new NotFoundException('User not found or no changes were made.');
            }

            // Return the updated user
            return {
                success: true,
                user: updatedUser
            };

        } catch (error) {
            // Log and handle any unexpected errors
            throw new InternalServerErrorException(error);
        }
    }


    public async deleteUser(id: number) {
        try {
            if (!id) {
                throw new BadRequestException(`Please Provide valid Id`)
            }

            const findUser = await this.findOneById(id)

            const payload = { ...findUser.user, isDeleted: true }

            await this.drizzle
                .update(schema.userTable)
                .set(payload)
                .where(eq(schema.userTable.id, id));

            return {
                success: true,
                message: `User Deleted Successfully`
            }

        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    public async hardDelete(id: number) {
        try {
            if (!id) {
                throw new BadRequestException(`Please Provide valid Id`)
            }

            await this.drizzle
                .delete(schema.userTable)
                .where(eq(schema.userTable.id, id))

            return {
                success: true,
                message: `User Has removed from the database`
            }

        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }


    public async updateRefreshToken(id: number, hashedRefreshToken: string | null) {
        try {
            const user = await this.findOneById(id);

            const payload = {
                ...user.user,
                hashedRefreshToken
            }

            await this.drizzle
                .update(schema.userTable)
                .set(payload)

            return 'hashed refresh token updated successfully'

        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    public async activateUser(email: string) {
        try {

            const { user } = await this.findOneByEmailOrPhone({ email });

            const payload = {
                ...user,
                accountStatus: true
            }

            await this.drizzle
                .update(schema.userTable)
                .set(payload)

            return {
                success: true,
                message: 'Account Activated Successfully'
            }

        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

}
