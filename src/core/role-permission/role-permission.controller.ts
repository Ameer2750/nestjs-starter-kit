import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';

@Controller('role-permission')
export class RolePermissionController {
    constructor(private readonly rolePermissionService: RolePermissionService) {}

    // Role Endpoints
    @Post('role')
    async createRole(@Body() roleData: { name: string; description?: string }) {
        return this.rolePermissionService.createRole(roleData);
    }

    @Patch('role/:id')
    async updateRole(@Param('id') id: number, @Body() roleData: { name?: string; description?: string }) {
        return this.rolePermissionService.updateRole(id, roleData);
    }

    @Delete('role/:id')
    async deleteRole(@Param('id') id: number) {
        return this.rolePermissionService.deleteRole(id);
    }

    @Get('role/:id')
    async findRoleById(@Param('id') id: number) {
        return this.rolePermissionService.findRoleById(id);
    }

    @Get('roles')
    async findAllRole() {
        return this.rolePermissionService.findAllRole();
    }

    // Permission Endpoints
    @Post('permission')
    async createPermission(@Body() permissionData: { name: string; description?: string }) {
        return this.rolePermissionService.createPermission(permissionData);
    }

    @Patch('permission/:id')
    async updatePermission(@Param('id') id: number, @Body() permissionData: { name?: string; description?: string }) {
        return this.rolePermissionService.updatePermission(id, permissionData);
    }

    @Delete('permission/:id')
    async deletePermission(@Param('id') id: number) {
        return this.rolePermissionService.deletePermission(id);
    }

    @Get('permission/:id')
    async findPermissionById(@Param('id') id: number) {
        return this.rolePermissionService.findPermissionById(id);
    }

    @Get('permissions')
    async findAllPermission() {
        return this.rolePermissionService.findAllPermission();
    }

    // Role-Permission Assignment Endpoints
    @Post('role/:roleId/permission')
    async assignPermissionToRole(@Param('roleId') roleId: number, @Body('permissionId') permissionId: number) {
        return this.rolePermissionService.assignPermissionToRole(roleId, permissionId);
    }

    @Post('role/:roleId/permissions')
    async bulkAssignPermissionToRole(@Param('roleId') roleId: number, @Body('permissionIds') permissionIds: number[]) {
        return this.rolePermissionService.bulkAssignPermissionToRole(roleId, permissionIds);
    }

    @Patch('role/:roleId/permissions')
    async updateAssignPermissionToRole(@Param('roleId') roleId: number, @Body('permissionIds') permissionIds: number[]) {
        return this.rolePermissionService.updateAssignPermissionToRole(roleId, permissionIds);
    }

    @Delete('role/:roleId/permissions')
    async bulkDeletePermissionToRole(@Param('roleId') roleId: number, @Body('permissionIds') permissionIds: number[]) {
        return this.rolePermissionService.bulkDeletePermissionToRole(roleId, permissionIds);
    }

    @Delete('role/:roleId/permission/:permissionId')
    async deleteAssignedRoleAndPermission(@Param('roleId') roleId: number, @Param('permissionId') permissionId: number) {
        return this.rolePermissionService.deleteAssignedRoleAndPermission(roleId, permissionId);
    }

    @Get('role/:roleId/permissions')
    async findAllPermissionByRoleId(@Param('roleId') roleId: number) {
        return this.rolePermissionService.findAllPermissionByRoleId(roleId);
    }

    @Get('role/:roleId/permission/:permissionId')
    async checkTheRoleHavePermission(@Param('roleId') roleId: number, @Param('permissionId') permissionId: number) {
        return this.rolePermissionService.checkTheRoleHavePermission(roleId, permissionId);
    }
}
