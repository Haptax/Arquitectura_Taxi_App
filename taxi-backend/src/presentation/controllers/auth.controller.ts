import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../../application/dtos/login.dto';
import { AuthenticateUserUseCase } from '../../application/use-cases/authenticate-user.use-case';

@Controller('auth')
export class AuthController {
  constructor(private readonly authenticateUserUseCase: AuthenticateUserUseCase) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    try {
      return await this.authenticateUserUseCase.execute(dto.email, dto.password);
    } catch (error: any) {
      throw new UnauthorizedException(error.message || 'Credenciales inválidas');
    }
  }
}

