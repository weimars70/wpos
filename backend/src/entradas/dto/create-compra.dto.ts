import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class EncCompraDto {
  @IsString()
  @Type(() => String)
  ident: string;

  @IsNumber()
  @Type(() => Number)
  empresa_id: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  sucursal?: number;

  @IsString()
  @Type(() => String)
  nombre: string;

  @IsString()
  @IsOptional()
  @Type(() => String)
  direccion?: string;

  @IsNumber()
  @Type(() => Number)
  forma_pago: number;

  @IsNumber()
  @Type(() => Number)
  plazo: number;

  @IsNumber()
  @Type(() => Number)
  tipo: number;

  @IsNumber()
  @Type(() => Number)
  total: number;

  @IsNumber()
  @Type(() => Number)
  subtotal: number;

  @IsNumber()
  @Type(() => Number)
  iva: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  descuento?: number;

  @IsString()
  @IsOptional()
  @Type(() => String)
  vendedor?: string;

  @IsString()
  @IsOptional()
  @Type(() => String)
  observaciones?: string;

  @IsString()
  @IsOptional()
  @Type(() => String)
  fecha?: string;

  @IsString()
  @IsOptional()
  @Type(() => String)
  factura?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  cantidad_total?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  valor_abono?: number;
}

export class DetRowCompraDto {
  @IsString()
  @Type(() => String)
  item: string;

  @IsString()
  @Type(() => String)
  nombre: string;

  @IsString()
  @Type(() => String)
  talla: string;

  @IsNumber()
  @Type(() => Number)
  color: number;

  @IsNumber()
  @Type(() => Number)
  cantidad: number;

  @IsNumber()
  @Type(() => Number)
  pcompra: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pventa?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pdesc?: number;

  @IsNumber()
  @Type(() => Number)
  por_iva: number;

  @IsNumber()
  @Type(() => Number)
  subtotal: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pcfinal?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pcfinaliva?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pfinaliva?: number;
}

export class CreateCompraDto {
  @ValidateNested()
  @Type(() => EncCompraDto)
  enc: EncCompraDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetRowCompraDto)
  det: DetRowCompraDto[];
}
