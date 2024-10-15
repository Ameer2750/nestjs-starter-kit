import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const otpTable = pgTable('otp', {
    id: serial('id').primaryKey(),
    otp: varchar('otp', { length: 10 }),
    email: varchar('email', { length: 100 }).notNull(),
    expiresAt: timestamp('expires_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
})