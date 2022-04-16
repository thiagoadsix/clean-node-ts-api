import jwt from 'jsonwebtoken'

import { Decrypter } from '../../../data/protocols/cryptography/decrypter'
import { Encrypter } from '../../../data/protocols/cryptography/encrypter'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (
    private readonly secret: string
  ) {
    this.secret = secret
  }

  async decrypt (token: string): Promise<string> {
    return jwt.verify(token, this.secret) as any
  }

  async encrypt (value: string): Promise<string> {
    return jwt.sign({ id: value }, this.secret)
  }
}
