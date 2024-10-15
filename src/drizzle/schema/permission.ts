import { pgTable, serial, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";

export const permissionTable = pgTable('permission', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }),
    description: varchar('description', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
}, table => {
    return {
        nameIndex: uniqueIndex('permission_name_idx').on(table.name) // Unique index for permission name
    }
})