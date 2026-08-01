import { IsString } from 'class-validator';

export class ValidateUserDto {
  @IsString()
  usuario: string;

  @IsString()
  password: string;
}
