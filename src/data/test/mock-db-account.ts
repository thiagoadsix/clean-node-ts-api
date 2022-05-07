import { AccountModel } from '@/domain/models/account'
import { AddAccountParams } from '@/domain/usecases/account/add-account'

import { mockAccountResponse } from '@/domain/test'

import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository'
import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository'
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'
import { UpdateAccessTokenRepository } from '@/data/usecases/authentication/db-authentication-protocols'

const mockAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AddAccountParams): Promise<AccountModel> {
      return await Promise.resolve(mockAccountResponse())
    }
  }

  return new AddAccountRepositoryStub()
}

const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel | null> {
      return await Promise.resolve(mockAccountResponse())
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

const mockLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (token: string, role?: string): Promise<AccountModel> {
      return Promise.resolve(mockAccountResponse())
    }
  }

  return new LoadAccountByTokenRepositoryStub()
}

const mockUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (id: string, token: string): Promise<void> {
      return await Promise.resolve()
    }
  }

  return new UpdateAccessTokenRepositoryStub()
}

export { mockAddAccountRepository, mockLoadAccountByEmailRepository, mockLoadAccountByTokenRepository, mockUpdateAccessTokenRepository }
