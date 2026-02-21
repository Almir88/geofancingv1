import { Injectable, ConflictException, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const DEMO_EMAIL = 'demo@geocampaign.com';
const DEMO_PASSWORD = 'demo123';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name?: string;
}

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly users = new Map<string, User>();

  async onModuleInit(): Promise<void> {
    const existing = await this.findByEmail(DEMO_EMAIL);
    if (!existing) {
      await this.create(DEMO_EMAIL, DEMO_PASSWORD, 'Demo korisnik');
      console.log(`Demo korisnik kreiran: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
    }
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async create(email: string, password: string, name?: string): Promise<User> {
    const existing = await this.findByEmail(email);
    if (existing) {
      throw new ConflictException('Korisnik s ovom email adresom već postoji.');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const id = crypto.randomUUID();
    const user: User = {
      id,
      email: email.toLowerCase(),
      passwordHash,
      name: name?.trim() || undefined,
    };
    this.users.set(id, user);
    return user;
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
  }
}
