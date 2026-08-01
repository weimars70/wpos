import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async findByUsuarioAndEmpresa(
    usuario: string,
    empresaId: number,
  ): Promise<User | null> {
    const search = usuario.toLowerCase().trim();
    return this.usersRepo.findOne({
      where: [
        { usuario: search, empresaId },
        { email: search, empresaId },
      ],
    });
  }

  async updateLastLogin(id: number, empresaId: number): Promise<void> {
    await this.usersRepo.update(
      { id, empresaId },
      { lastLogin: new Date() },
    );
  }

  async findEmpresasByUsuario(usuario: string) {
    const search = usuario.toLowerCase().trim();
    console.log(`[UsersService] Buscando empresas para: "${search}"`);
    try {
      const result = await this.usersRepo.query(
        `SELECT DISTINCT s.id as id, s.nombre 
         FROM usuarios u
         LEFT JOIN empresas s ON u.empresa_id = s.id
         WHERE (LOWER(u.usuario) = $1 OR LOWER(u.email) = $1 OR LOWER(u.name) = $1)
         ORDER BY s.nombre ASC`,
        [search],
      );
      console.log(`[UsersService] Query exitosa. Encontradas: ${result.length}`);
      return result;
    } catch (error) {
      console.error(`[UsersService] Error en findEmpresasByUsuario:`, error);
      throw error;
    }
  }
}
