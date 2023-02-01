import { User } from './user.entity';

export type PublicUserData = Omit<User, 'password' | 'salt'>;
