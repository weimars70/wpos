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

  @IsString()
  @IsOptional()
  observaciones?: string;
}

export class DetRowCompraDto {
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
  pcompra: number;

  @IsNumber()
  pdesc: number;

  @IsNumber()
  por_iva: number;

  @IsNumber()
  subtotal: number;

  @IsNumber()
  @IsOptional()
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
