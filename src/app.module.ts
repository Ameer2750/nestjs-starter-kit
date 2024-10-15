import { Module } from '@nestjs/common';
import { NestDrizzleModule } from './drizzle/drizzle.module';
import * as schema from 'src/drizzle/schema';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/env/configuration';
import { CoreModule } from './core/core.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './core/auth/guards/jwt-auth.guard';
import { RoleGuard } from './common/guards/roles.guard';
import { RolePermissionModule } from './core/role-permission/role-permission.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
    }),
    NestDrizzleModule.forRootAsync({
      useFactory: () => {
        return {
          driver: 'postgres-js',
          url: process.env.DATABASE_URL,
          options: { schema },
          migrationOptions: { migrationsFolder: './src/drizzle/migrations' },
        };
      },
    }),
    CoreModule,
    RolePermissionModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard
    }
  ]
})
export class AppModule {}
