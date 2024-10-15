import { db } from "../db";
import * as schema from 'src/drizzle/schema';
import roleData from './data/role.json';

export const roleSeed = async (dbInstance: typeof db) => {
    try {
        // Loop through each role in the role.json file
        for (const role of roleData) {
            // Insert the role data into the database
            const payload = {
                name: role.name,
                description: role.description
            }
            await dbInstance.insert(schema.roleTable).values(payload);
        }

        console.log('Role seed data has been inserted successfully.');

    } catch (error) {
        console.error('Error seeding role data:', error);
    }
};

// Export roleSeed by default
export default roleSeed;
