import { integer, pgTable, serial, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { roleTable } from "./role";
import { permissionTable } from "./permission";

export const rolePermissionTable = pgTable('role_permission', {
    id: serial('id').primaryKey(),
    roleId: integer('role_id').references(() => roleTable.id),
    permissionId: integer('permission_id').references(() => permissionTable.id),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
}, table => {
    return {
        rolePermissionUniqueIndex: uniqueIndex('role_permission_unique_idx').on(table.roleId, table.permissionId)
        // Composite unique index to ensure a permission can be assigned to a role only once
    }
});