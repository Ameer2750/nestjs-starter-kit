import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { DRIZZLE_ORM } from "src/common/utils/constants/db.constant";
import { UserService } from "../user/user.service";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from 'src/drizzle/schema';
import { and, eq, inArray } from "drizzle-orm";

type CreateObjectType = {
    name: string;
    description?: string;
}

type UpdateObjectType = {
    name?: string;
    description?: string;
}

@Injectable()
export class RolePermissionService {
    constructor(
        @Inject(DRIZZLE_ORM) private readonly drizzle: PostgresJsDatabase<typeof schema>,
        private readonly userService: UserService
    ) { }

    public async createRole(roleData: CreateObjectType) {
        try {
            const newRole = await this.drizzle
                .insert(schema.roleTable)
                .values(roleData)
                .returning();
            return newRole;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }


    public async updateRole(id: number, roleData: UpdateObjectType) {
        try {
            const updatedRole = await this.drizzle
                .update(schema.roleTable)
                .set(roleData)
                .where(eq(schema.roleTable.id, id))
                .returning();
            return updatedRole;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }


    public async deleteRole(id: number) {
        try {
            await this.drizzle
                .delete(schema.roleTable)
                .where(eq(schema.roleTable.id, id))
            return { message: 'Role deleted successfully' };
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }


    public async findRoleById(id: number) {
        try {
            const role = await this.drizzle
                .select()
                .from(schema.roleTable)
                .where(eq(schema.roleTable.id, id))
            return role;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }


    public async findAllRole() {
        try {
            const roles = await this.drizzle
                .select()
                .from(schema.roleTable);
            return roles;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }


    public async createPermission(permissionData: CreateObjectType) {
        try {
            const newPermission = await this.drizzle
                .insert(schema.permissionTable)
                .values(permissionData)
                .returning();
            return newPermission;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }


    public async updatePermission(id: number, permissionData: UpdateObjectType) {
        try {
            const updatedPermission = await this.drizzle
                .update(schema.permissionTable)
                .set(permissionData)
                .where(eq(schema.permissionTable.id, id))
                .returning();
            return updatedPermission;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }


    public async deletePermission(id: number) {
        try {
            await this.drizzle
                .delete(schema.permissionTable)
                .where(eq(schema.permissionTable.id, id));
            return { message: 'Permission deleted successfully' };
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    public async findPermissionById(id: number) {
        try {
            const permission = await this.drizzle
                .select()
                .from(schema.permissionTable)
                .where(eq(schema.permissionTable.id, id));
            return permission;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    public async findAllPermission() {
        try {
            const permissions = await this.drizzle
                .select()
                .from(schema.permissionTable);
            return permissions;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }


    public async bulkAssignPermissionToRole(roleId: number, permissionIds: number[]) {
        try {
            const assignments = permissionIds.map(permissionId => ({
                roleId,
                permissionId,
            }));
            await this.drizzle
                .insert(schema.rolePermissionTable)
                .values(assignments);
            return { message: 'Permissions assigned successfully' };
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }


    public async assignPermissionToRole(roleId: number, permissionId: number) {
        try {
            await this.drizzle
                .insert(schema.rolePermissionTable)
                .values({ roleId, permissionId });
            return { message: 'Permission assigned to role' };
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }


    public async updateAssignPermissionToRole(roleId: number, permissionIds: number[]) {
        try {
            await this.drizzle
                .delete(schema.rolePermissionTable)
                .where(eq(schema.rolePermissionTable.roleId, roleId));
            await this.bulkAssignPermissionToRole(roleId, permissionIds);
            return { message: 'Role permissions updated successfully' };
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }


    public async bulkDeletePermissionToRole(roleId: number, permissionIds: number[]) {
        try {
            await this.drizzle
                .delete(schema.rolePermissionTable)
                .where(and(
                    eq(schema.rolePermissionTable.roleId, roleId),
                    inArray(schema.rolePermissionTable.permissionId, permissionIds)
                ))
            return { message: 'Permissions removed successfully' };
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    public async deleteAssignedRoleAndPermission(roleId: number, permissionId: number) {
        try {
            await this.drizzle
                .delete(schema.rolePermissionTable)
                .where(and(
                    eq(schema.rolePermissionTable.roleId, roleId),
                    eq(schema.rolePermissionTable.permissionId, permissionId)
                ))
            return { message: 'Permission removed from role' };
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }


    public async findAssignedRoleAndPermission(roleId: number) {
        try {
            const assignedPermissions = await this.drizzle
                .select()
                .from(schema.rolePermissionTable)
                .where(eq(schema.rolePermissionTable.roleId, roleId));
            return assignedPermissions;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }


    public async findAllPermissionByRoleId(roleId: number) {
        try {
            const permissions = await this.drizzle
                .select()
                .from(schema.permissionTable)
                .leftJoin(
                    schema.rolePermissionTable,
                    eq(
                        schema.rolePermissionTable.permissionId,
                        schema.permissionTable.id
                    )
                )
                .where(eq(schema.rolePermissionTable.roleId, roleId));
            return permissions;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }


    public async checkTheRoleHavePermission(roleId: number, permissionId: number) {
        try {
            const exists = await this.drizzle
                .select()
                .from(schema.rolePermissionTable)
                .where(and(
                    eq(schema.rolePermissionTable.roleId, roleId),
                    eq(schema.rolePermissionTable.permissionId, permissionId)
                ))
            return exists.length > 0;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

}