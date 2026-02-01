import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly jwtService: JwtService;

  constructor(private readonly configService: ConfigService) {
    this.jwtService = new JwtService({
      secret: this.configService.get<string>('JWT_SECRET') || 'dev_secret',
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'] as string | undefined;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token requerido');
    }

    const token = authHeader.replace('Bearer ', '').trim();
    try {
      const payload = await this.jwtService.verifyAsync(token);
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
  }
}
