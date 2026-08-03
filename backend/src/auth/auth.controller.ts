import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  Get,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { ValidateUserDto } from './dto/validate-user.dto';

@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  async validateCredentials(@Body() dto: ValidateUserDto) {
    return this.authService.validateCredentialsAndGetEmpresas(
      dto.usuario,
      dto.password,
    );
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(
      dto.usuario,
      dto.empresaId,
      dto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return this.authService.login(user);
  }

  @Get('empresas/:usuario')
  async getEmpresas(@Param('usuario') usuario: string) {
    console.log(`[AuthController] GET /auth/empresas/${usuario} solicitado.`);
    return this.usersService.findEmpresasByUsuario(usuario);
  }
}
