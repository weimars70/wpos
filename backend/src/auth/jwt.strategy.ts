import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_SECRET', 'secret'),
    });
  }

  validate(payload: {
    sub: number;
    empresaId: number;
    roleId: number;
    name: string;
    grupoEmpresarial?: number;
  }) {
    return {
      id: payload.sub,
      empresaId: payload.empresaId,
      roleId: payload.roleId,
      name: payload.name,
      grupoEmpresarial: payload.grupoEmpresarial ?? null,
    };
  }
}
