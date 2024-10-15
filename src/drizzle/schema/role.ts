import { pgTable, serial, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";

export const roleTable = pgTable('role', {
    id: serial('id').primaryKey(),
    name: varchar('name', {length: 50}).notNull(),
    description: varchar('description', {length: 100}),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
}, table => {
    return {
        nameIndex: uniqueIndex('role_name_idx').on(table.name)
    }
})