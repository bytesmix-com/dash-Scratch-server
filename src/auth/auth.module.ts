import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthResolver } from './auth.resolver';
import { JwtRefreshStrategy } from './guards/gql-jwt-refresh.strategy';
import { GqlJwtStrategy } from './guards/gql-jwt.strategy';

@Global()
@Module({
  imports: [JwtModule.register({})],
  providers: [AuthResolver, GqlJwtStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
