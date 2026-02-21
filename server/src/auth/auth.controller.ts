import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Public } from './decorators/public.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from './decorators/current-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Registracija korisnika' })
  @ApiResponse({ status: 201, description: 'Korisnik registriran, vraća JWT.' })
  @ApiResponse({ status: 400, description: 'Nevaljani podaci.' })
  @ApiResponse({ status: 409, description: 'Email već postoji.' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Prijava korisnika' })
  @ApiResponse({ status: 201, description: 'Uspješna prijava, vraća JWT.' })
  @ApiResponse({ status: 401, description: 'Neispravan email ili lozinka.' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Profil ulogiranog korisnika' })
  @ApiResponse({ status: 200, description: 'Podaci korisnika.' })
  @ApiResponse({ status: 401, description: 'Nedostaje ili nevaljani token.' })
  getProfile(@CurrentUser() user: CurrentUserPayload) {
    return user;
  }
}
