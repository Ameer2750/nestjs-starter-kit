import { getTableName, sql, Table } from "drizzle-orm";
import { db } from "./db";
import * as schema from 'src/drizzle/schema';
import roleSeed from "./seeds/role.seed";
import userSeed from "./seeds/user.seed";

async function resetTable(dbInstance: typeof db, table: Table) {
    const tableName = getTableName(table);
    return dbInstance.execute(
        sql.raw(`TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE`)
    );
}

async function resetAndSeedTables() {
    for(const table of [
        schema.roleTable,
        schema.userTable,
    ]) {
        await resetTable(db, table);
    }

    await roleSeed(db);
    await userSeed(db);
}

resetAndSeedTables()
    .then(() => {
        console.log('Tables reset and seeded successfully.');
    })
    .catch((error) => {
        console.error('Error resetting and seeding tables:', error);
    });