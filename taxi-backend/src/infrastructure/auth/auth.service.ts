import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IPasswordHasher } from '../../application/interfaces/ipassword-hasher';

@Injectable()
export class AuthService implements IPasswordHasher {
	private readonly rounds = 10;

	async hash(value: string): Promise<string> {
		return bcrypt.hash(value, this.rounds);
	}

	async compare(value: string, hash: string): Promise<boolean> {
		return bcrypt.compare(value, hash);
	}
}
