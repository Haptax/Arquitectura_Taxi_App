import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from '../../application/dtos/login.dto';
import { AuthenticateUserUseCase } from '../../application/use-cases/authenticate-user.use-case';

@Controller('auth')
export class AuthController {
  constructor(private readonly authenticateUserUseCase: AuthenticateUserUseCase) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authenticateUserUseCase.execute(dto.email, dto.password);
  }
}
