import { Injectable, CanActivate, ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolePermissionService } from 'src/core/role-permission/role-permission.service'; // Import RolePermissionService
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { RoleEnum } from '../utils/enums/role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rolePermissionService: RolePermissionService // Inject RolePermissionService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<(typeof RoleEnum[keyof typeof RoleEnum])[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || isPublic) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    // Fetch the role name based on the user's roleId
    const role = await this.rolePermissionService.findRoleById(user.roleId);

    if (!role || !role[0]?.name) {
      throw new InternalServerErrorException('Role not found for the user');
    }

    const userRoleName = role[0].name; // Assuming role[0] contains the role object and has a 'name' property

    // Check if the user's role matches any of the required roles
    return requiredRoles.some((role) => userRoleName === role);
  }
}
