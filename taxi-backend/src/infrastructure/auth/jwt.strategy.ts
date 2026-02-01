import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ITokenService } from '../../application/interfaces/itoken-service';

@Injectable()
export class JwtTokenService implements ITokenService {
	private readonly jwtService: JwtService;

	constructor(private readonly configService: ConfigService) {
		this.jwtService = new JwtService({
			secret: this.configService.get<string>('JWT_SECRET') || 'dev_secret',
			signOptions: { expiresIn: '1d' },
		});
	}

	async sign(payload: Record<string, unknown>): Promise<string> {
		return this.jwtService.signAsync(payload);
	}
}
