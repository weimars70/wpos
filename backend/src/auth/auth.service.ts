import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateCredentialsAndGetEmpresas(usuario: string, password: string) {
    const empresas = await this.usersService.findValidEmpresasByUsuarioAndPassword(
      usuario,
      password,
    );
    if (!empresas || empresas.length === 0) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }
    return empresas;
  }

  async validateUser(
    usuario: string,
    empresaId: number,
    password: string,
  ): Promise<Omit<User, 'passwordHash'> | null> {
    console.log(`[AuthService] Validando usuario: "${usuario}" en empresa: ${empresaId}`);
    
    const user = await this.usersService.findByUsuarioAndEmpresa(usuario, empresaId);
    
    if (!user) {
      console.warn(`[AuthService] Usuario "${usuario}" no encontrado en la empresa ${empresaId}.`);
      return null;
    }
    
    console.log(`[AuthService] Usuario encontrado. Validando password...`);
    const valid = await bcrypt.compare(password, user.passwordHash);
    
    if (!valid) {
      console.warn(`[AuthService] Password INCORRECTA para el usuario "${usuario}".`);
      return null;
    }
    
    console.log(`[AuthService] Login EXITOSO para "${usuario}".`);
    const { passwordHash, ...result } = user;
    return result as Omit<User, 'passwordHash'>;
  }

  async login(user: Omit<User, 'passwordHash'>) {
    await this.usersService.updateLastLogin(
      (user as User).id,
      (user as User).empresaId,
    );
    const grupoEmpresarial = await this.usersService.getGrupoEmpresarialByEmpresaId(
      (user as User).empresaId,
    );
    const payload = {
      sub: (user as User).id,
      empresaId: (user as User).empresaId,
      roleId: (user as User).roleId,
      name: user.name,
      grupoEmpresarial: grupoEmpresarial ?? 1,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
