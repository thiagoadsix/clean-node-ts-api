import {
  AccountModel, Decrypter, LoadAccountByToken
} from './db-load-account-by-token-protocols'

import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {
    this.decrypter = decrypter
    this.loadAccountByTokenRepository = loadAccountByTokenRepository
  }

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    const tokenDecrypted = await this.decrypter.decrypt(accessToken)

    if (tokenDecrypted) {
      return await this.loadAccountByTokenRepository.loadByToken(accessToken, role)
    }

    return null
  }
}
