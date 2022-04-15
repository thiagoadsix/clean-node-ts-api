import {
  AccountModel, Decrypter, LoadAccountByToken
} from './db-load-account-by-token-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter
  ) {
    this.decrypter = decrypter
  }

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    await this.decrypter.decrypt(accessToken)
    return new Promise<AccountModel>((resolve) => resolve({
      id: 'any id',
      name: 'any name',
      email: 'any@email.com',
      password: 'any password'
    }))
  }
}
