import { boolean, index, integer, pgTable, serial, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { roleTable } from "./role";

export const userTable = pgTable('user', {
    id: serial('id').primaryKey(),
    firstName: varchar('first_name', { length: 255 }).notNull(),
    lastName: varchar('last_name', { length: 255 }),
    email: varchar('email', { length: 255 }).unique().notNull(),
    phone: varchar('phone', { length: 255 }).unique().notNull(),
    password: varchar('password', {length: 255}).notNull(),
    roleId: integer('role_id').references(() => roleTable.id),
    hashedRefreshToken: varchar('hashed_refresh_token', {length: 255}),
    isEmailVerified: boolean('is_email_verified').default(false).notNull(),
    isPhoneVerified: boolean('is_phone_verified').default(false).notNull(),
    isDeleted: boolean('is_deleted').default(false).notNull(),
    accountStatus: boolean('account_status').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
}, (table) => {
    return {
        nameIndex: index('name_idx').on(table.firstName),
        emailIndex: uniqueIndex('email_idx').on(table.email),
        phoneIndex: uniqueIndex('phone_idx').on(table.phone)
    }
})