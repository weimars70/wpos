import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('empresas-grupo')
  getEmpresasGrupo(@Req() req: any) {
    const grupo = req.user.grupoEmpresarial;
    if (grupo) {
      return this.usersService.findEmpresasByGrupo(Number(grupo));
    }
    return this.usersService.findEmpresasByGrupo(1);
  }

  @Get('user-empresas')
  getUserEmpresas(@Query('email') email: string) {
    return this.usersService.findUserEmpresasByEmail(email || '');
  }

  @Get()
  findAll(@Req() req: any) {
    if (req.user.grupoEmpresarial) {
      return this.usersService.findAllByGrupo(Number(req.user.grupoEmpresarial));
    }
    return this.usersService.findAllByEmpresa(Number(req.user.empresaId));
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.usersService.findOneByIdAndEmpresa(
      +id,
      Number(req.user.empresaId),
    );
  }

  @Post()
  create(@Body() dto: CreateUserDto, @Req() req: any) {
    return this.usersService.create(dto, Number(req.user.empresaId));
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Req() req: any,
  ) {
    return this.usersService.update(+id, Number(req.user.empresaId), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.usersService.remove(+id, Number(req.user.empresaId));
  }
}
