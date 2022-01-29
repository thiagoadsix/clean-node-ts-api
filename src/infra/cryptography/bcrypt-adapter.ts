import bcrypt from 'bcrypt'

import { HashComparer } from '../../data/protocols/cryptography/hash-comparer'
import { Hasher } from '../../data/protocols/cryptography/hasher'

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
