import { db } from "../db";
import * as bcrypt from 'bcrypt';
import user from './data/user.json';
import * as schema from 'src/drizzle/schema';

export const userSeed = async (dbInstance: typeof db) => {
    try {
        // Loop through each user in the user.json file
        for (const u of user) {
            // Hash the user's password before seeding
            const hashedPassword = await bcrypt.hash(u.password, 10);

            const payload = {
                firstName: u.firstName,
                lastName: u.lastName,
                email: u.email,
                phone: u.phone, // You'll need to add phone numbers in the user JSON
                password: hashedPassword,  // Save the hashed password
                roleId: u.roleId,
                isEmailVerified: u.isEmailVerified,
                isPhoneVerified: u.isPhoneVerified,
                accountStatus: u.accountStatus,
            }
            // Insert the user data into the database
            await dbInstance.insert(schema.userTable).values(payload);
        }

        console.log('User seed data has been inserted successfully.');

    } catch (error) {
        console.error('Error seeding user data:', error);
    }
};

// Export userSeed by default
export default userSeed;
