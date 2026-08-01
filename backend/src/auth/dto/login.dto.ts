import { IsString, IsNumber } from 'class-validator';

export class LoginDto {
  @IsString()
  usuario: string;

  @IsNumber()
  empresaId: number;

  @IsString()
  password: string;
}
