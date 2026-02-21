import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Unesite ispravnu email adresu.' })
  email: string;

  @ApiProperty({ example: 'lozinka123', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'Lozinka mora imati najmanje 6 znakova.' })
  password: string;
}
