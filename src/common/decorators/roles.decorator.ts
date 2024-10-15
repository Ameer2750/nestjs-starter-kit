// roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from '../utils/enums/role.enum';


export const ROLES_KEY = 'roles';

// Use RoleEnum values directly
export const Roles = (...roles: (typeof RoleEnum[keyof typeof RoleEnum])[]) => 
    SetMetadata(ROLES_KEY, roles);