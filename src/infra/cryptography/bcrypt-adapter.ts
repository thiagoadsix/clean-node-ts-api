import bcrypt from 'bcrypt'
import { Encrypter } from '../../data/protocols/cryptography/encrypter'

export class BCryptAdapter implements Encrypter {
  constructor (private readonly SALT: number) {
    this.SALT = SALT
  }

  async encrypt (value: string): Promise<string> {
    return await bcrypt.hash(value, this.SALT)
  }
}
