import { Documento } from './documentos/documentos.entity';
import { DocumentoModule } from './documentos/documentos.module';
import { Talla } from './tallas/tallas.entity';
import { TallaModule } from './tallas/tallas.module';
import { TipoIva } from './tipo_iva/tipo_iva.entity';
import { TipoIvaModule } from './tipo_iva/tipo_iva.module';
import { Proveedor } from './proveedores/proveedores.entity';
import { ProveedorModule } from './proveedores/proveedores.module';
import { Item } from './items/items.entity';
import { ItemColor } from './items/items_colores.entity';
import { ItemTalla } from './items/items_tallas.entity';
import { ItemModule } from './items/items.module';
import { GrupoItem } from './grupos_items/grupos_items.entity';
import { GrupoItemModule } from './grupos_items/grupos_items.module';
import { Empleado } from './empleados/empleados.entity';
import { EmpleadoModule } from './empleados/empleados.module';
import { Color } from './colores/colores.entity';
import { ColorModule } from './colores/colores.module';
import { MedioPago } from './medios_pago/medios_pago.entity';
import { MedioPagoModule } from './medios_pago/medios_pago.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SalidasModule } from './salidas/salidas.module';
import { EntradasModule } from './entradas/entradas.module';
import { User } from './users/user.entity';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('POSTGRES_HOST', 'localhost'),
        port: config.get<number>('POSTGRES_PORT', 5432),
        username: config.get('POSTGRES_USER', 'postgres'),
        password: config.get('POSTGRES_PASSWORD', ''),
        database: config.get('POSTGRES_DB', 'wpos'),
        entities: [
        Documento,
        Talla,
        TipoIva,
        Proveedor,
        Item,
        ItemColor,
        ItemTalla,
        GrupoItem,
        Empleado,Color, MedioPago, User],
        synchronize: false,
        schema: 'public',
        logging: false,
      }),
    }),
    UsersModule,
    AuthModule,
    SalidasModule,
    DocumentoModule,
    TallaModule,
    TipoIvaModule,
    ProveedorModule,
    ItemModule,
    GrupoItemModule,
    EmpleadoModule,
    ColorModule,
    MedioPagoModule,
    EntradasModule,
    DashboardModule,
  ],
})
export class AppModule {}
