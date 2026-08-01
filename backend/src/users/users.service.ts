import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async findAllByEmpresa(empresaId: number): Promise<User[]> {
    return this.usersRepo.find({
      where: { empresaId },
      order: { createdAt: 'DESC' },
    });
  }

  async findAllByGrupo(grupoEmpresarial: number): Promise<any[]> {
    try {
      const result = await this.usersRepo.query(
        `SELECT u.id, u.empresa_id as "empresaId", u.name, u.email, u.created_at as "createdAt", 
                u.updated_at as "updatedAt", u.active, s.nombre as "empresaNombre"
         FROM usuarios u
         LEFT JOIN empresas s ON u.empresa_id = s.id
         WHERE s.grupo_empresarial = $1
         ORDER BY u.created_at DESC`,
        [grupoEmpresarial],
      );
      return result;
    } catch (error) {
      console.error(`[UsersService] Error en findAllByGrupo:`, error);
      return this.findAllByEmpresa(grupoEmpresarial);
    }
  }

  async findOneByIdAndEmpresa(id: number, empresaId: number): Promise<User> {
    const user = await this.usersRepo.findOne({
      where: { id, empresaId },
    });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  async create(dto: CreateUserDto, empresaId: number): Promise<User> {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const targetEmpresaIds =
      dto.empresaIds && dto.empresaIds.length > 0
        ? dto.empresaIds
        : [empresaId];

    let primaryUser: User | null = null;

    for (const targetId of targetEmpresaIds) {
      const existing = await this.usersRepo.findOne({
        where: [
          { email: dto.email.toLowerCase().trim(), empresaId: targetId },
          { usuario: dto.email.toLowerCase().trim(), empresaId: targetId },
        ],
      });

      if (!existing) {
        const newUser = this.usersRepo.create({
          name: dto.name,
          email: dto.email.toLowerCase().trim(),
          usuario: dto.email.toLowerCase().trim(),
          passwordHash,
          empresaId: targetId,
          roleId: 1,
          active: true,
        });
        const saved = await this.usersRepo.save(newUser);
        if (!primaryUser) primaryUser = saved;
      }
    }

    if (!primaryUser) {
      // If already existed in all requested companies, fetch existing
      primaryUser = await this.usersRepo.findOne({
        where: { email: dto.email.toLowerCase().trim() },
      }) as User;
    }

    return primaryUser;
  }

  async update(
    id: number,
    empresaId: number,
    dto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.findOneByIdAndEmpresa(id, empresaId);
    let passwordHash = user.passwordHash;

    if (dto.password) {
      passwordHash = await bcrypt.hash(dto.password, 10);
    }

    const email = dto.email !== undefined ? dto.email.toLowerCase().trim() : user.email;
    const name = dto.name !== undefined ? dto.name : user.name;

    user.name = name;
    user.email = email;
    user.usuario = email;
    user.passwordHash = passwordHash;
    user.updatedAt = new Date();

    const savedUser = await this.usersRepo.save(user);

    if (dto.empresaIds && dto.empresaIds.length > 0) {
      // Eliminar registros de empresas que hayan sido desmarcadas
      const existingEmpresas = await this.findUserEmpresasByEmail(email);
      for (const oldEmpId of existingEmpresas) {
        if (!dto.empresaIds.includes(oldEmpId)) {
          await this.usersRepo.query(
            `DELETE FROM usuarios WHERE (LOWER(email) = $1 OR LOWER(usuario) = $1) AND empresa_id = $2`,
            [email, oldEmpId],
          );
        }
      }

      for (const targetId of dto.empresaIds) {
        if (targetId === empresaId) continue;
        const empUser = await this.usersRepo.findOne({
          where: [
            { email: user.email, empresaId: targetId },
            { usuario: user.usuario, empresaId: targetId },
          ],
        });
        if (empUser) {
          empUser.name = name;
          empUser.email = email;
          empUser.usuario = email;
          empUser.passwordHash = passwordHash;
          empUser.updatedAt = new Date();
          await this.usersRepo.save(empUser);
        } else {
          const newUser = this.usersRepo.create({
            name,
            email,
            usuario: email,
            passwordHash,
            empresaId: targetId,
            roleId: user.roleId || 1,
            active: true,
          });
          await this.usersRepo.save(newUser);
        }
      }
    }

    return savedUser;
  }

  async findUserEmpresasByEmail(email: string): Promise<number[]> {
    try {
      const search = email.toLowerCase().trim();
      const rows = await this.usersRepo.query(
        `SELECT DISTINCT empresa_id FROM usuarios WHERE LOWER(email) = $1 OR LOWER(usuario) = $1`,
        [search],
      );
      return rows.map((r: any) => Number(r.empresa_id));
    } catch (error) {
      console.error(`[UsersService] Error en findUserEmpresasByEmail:`, error);
      return [];
    }
  }

  async remove(id: number, empresaId: number): Promise<void> {
    const result = await this.usersRepo.delete({ id, empresaId });
    if (result.affected === 0) {
      throw new NotFoundException('Usuario no encontrado');
    }
  }

  async getGrupoEmpresarialByEmpresaId(empresaId: number): Promise<number | null> {
    try {
      const result = await this.usersRepo.query(
        `SELECT grupo_empresarial FROM empresas WHERE id = $1 LIMIT 1`,
        [empresaId],
      );
      return result[0]?.grupo_empresarial ? Number(result[0].grupo_empresarial) : null;
    } catch (error) {
      console.error(`[UsersService] Error en getGrupoEmpresarialByEmpresaId:`, error);
      return null;
    }
  }

  async findEmpresasByGrupo(grupoEmpresarial: number) {
    try {
      const result = await this.usersRepo.query(
        `SELECT id, nombre, codigo, nit, ciudad 
         FROM empresas 
         WHERE grupo_empresarial = $1 
         ORDER BY nombre ASC`,
        [grupoEmpresarial],
      );
      return result;
    } catch (error) {
      console.error(`[UsersService] Error en findEmpresasByGrupo:`, error);
      throw error;
    }
  }

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

  async findValidEmpresasByUsuarioAndPassword(usuario: string, password: string) {
    const search = usuario.toLowerCase().trim();
    console.log(`[UsersService] Buscando empresas con clave para: "${search}"`);
    try {
      const rows = await this.usersRepo.query(
        `SELECT u.password_hash, s.id as id, s.nombre 
         FROM usuarios u
         LEFT JOIN empresas s ON u.empresa_id = s.id
         WHERE (LOWER(u.usuario) = $1 OR LOWER(u.email) = $1 OR LOWER(u.name) = $1)`,
        [search],
      );

      const empresas: { id: number; nombre: string }[] = [];
      const seenIds = new Set<number>();

      for (const row of rows) {
        if (!row.password_hash) continue;
        const valid = await bcrypt.compare(password, row.password_hash);
        if (valid && row.id && !seenIds.has(row.id)) {
          seenIds.add(row.id);
          empresas.push({ id: row.id, nombre: row.nombre });
        }
      }

      empresas.sort((a, b) => a.nombre.localeCompare(b.nombre));
      console.log(`[UsersService] Empresas válidas encontradas: ${empresas.length}`);
      return empresas;
    } catch (error) {
      console.error(`[UsersService] Error en findValidEmpresasByUsuarioAndPassword:`, error);
      throw error;
    }
  }
}
