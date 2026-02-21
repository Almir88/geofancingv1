import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Unesite ispravnu email adresu.' })
  email: string;

  @ApiProperty({ example: 'lozinka123', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'Lozinka mora imati najmanje 6 znakova.' })
  password: string;

  @ApiPropertyOptional({ example: 'Ime Prezime' })
  @IsOptional()
  @IsString()
  name?: string;
}
