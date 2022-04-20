import bcrypt from 'bcrypt'

import {
  HashComparer,
  Hasher
} from './bcrypt-adapter-protocols'

export class BCryptAdapter implements Hasher, HashComparer {
  constructor (private readonly SALT: number) {
    this.SALT = SALT
  }

  async hash (value: string): Promise<string> {
    return await bcrypt.hash(value, this.SALT)
  }

  async compare (value: string, password: string): Promise<boolean> {
    return await bcrypt.compare(value, password)
  }
}
