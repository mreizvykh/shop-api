import { Injectable } from '@nestjs/common';
import { promisify } from 'node:util';
import { pbkdf2, randomBytes } from 'node:crypto';
import { UsersService } from '../users/users.service';
import { PublicUserData } from '../users/users.types';

const pbkdf2Async = promisify(pbkdf2);

const PEPPER = 'whatever';
const ITERATIONS = 1000;
const KEY_LEN = 64;
const DIGEST = 'sha512';

@Injectable()
export class AuthService {
  private async encode(str: string, salt: string): Promise<string> {
    const buffer = await pbkdf2Async(
      `${str}_${PEPPER}`,
      salt,
      ITERATIONS,
      KEY_LEN,
      DIGEST,
    );

    return buffer.toString('hex');
  }

  constructor(private usersService: UsersService) {}

  async encodePassword(
    password: string,
  ): Promise<{ hash: string; salt: string }> {
    const salt = randomBytes(16).toString('hex');
    const hash = await this.encode(password, salt);

    return { salt, hash };
  }

  async validateUser(
    email: string,
    pass: string,
  ): Promise<PublicUserData | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }

    const { password, salt, ...userData } = user;
    const hash = await this.encode(pass, salt);
    if (hash !== password) {
      return null;
    }

    return userData;
  }
}
