import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class EncDto {
  @IsString()
  ident: string;

  @IsNumber()
  empresa_id: number;

  @IsString()
  nombre: string;

  @IsString()
  @IsOptional()
  direccion?: string;

  @IsNumber()
  forma_pago: number;

  @IsNumber()
  plazo: number;

  @IsNumber()
  tipo: number;

  @IsNumber()
  total: number;

  @IsNumber()
  subtotal: number;

  @IsNumber()
  iva: number;

  @IsNumber()
  @IsOptional()
  descuento?: number;

  @IsString()
  @IsOptional()
  vendedor?: string;

  @IsNumber()
  @IsOptional()
  efectivo?: number;

  @IsNumber()
  @IsOptional()
  cambio?: number;
}

export class DetRowDto {
  @IsString()
  item: string;

  @IsString()
  nombre: string;

  @IsString()
  talla: string;

  @IsNumber()
  color: number;

  @IsNumber()
  cantidad: number;

  @IsNumber()
  pventa: number;

  @IsNumber()
  pdesc: number;

  @IsNumber()
  pvfinal: number;

  @IsNumber()
  pvfinaliva: number;

  @IsNumber()
  por_iva: number;

  @IsNumber()
  subtotal: number;
}

export class DetDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetRowDto)
  rows: DetRowDto[];
}

export class CreateFacturaDto {
  @ValidateNested()
  @Type(() => EncDto)
  enc: EncDto;

  @ValidateNested()
  @Type(() => DetDto)
  det: DetDto;

  @IsArray()
  @IsOptional()
  detotrospagos?: any[];
}
