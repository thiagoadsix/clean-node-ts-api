import bcrypt from 'bcrypt'
import { Hasher } from '../../data/protocols/cryptography/hasher'

export class BCryptAdapter implements Hasher {
  constructor (private readonly SALT: number) {
    this.SALT = SALT
  }

  async hash (value: string): Promise<string> {
    return await bcrypt.hash(value, this.SALT)
  }
}
