import { Module } from "@nestjs/common";
import { RolePermissionService } from "./role-permission.service";
import { RolePermissionController } from "./role-permission.controller";
import { UserModule } from "../user/user.module";

@Module({
    imports: [UserModule],
    controllers: [RolePermissionController],
    providers: [RolePermissionService],
    exports: [RolePermissionService]
})
export class RolePermissionModule { }