import { AddAccount, AddAccountParams } from '@/domain/usecases/account/add-account'
import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token'
import { AccountModel } from '@/domain/models/account'
import { Authentication, AuthenticationParams } from '@/domain/usecases/account/authentication'

import { mockAccountResponse } from '@/domain/test'

const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationParams): Promise<string> {
      return await Promise.resolve('token')
    }
  }

  return new AuthenticationStub()
}
const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountParams): Promise<AccountModel> {
      return await Promise.resolve(mockAccountResponse())
    }
  }

  return new AddAccountStub()
}

const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string, role?: string): Promise<AccountModel> {
      return Promise.resolve(mockAccountResponse())
    }
  }

  return new LoadAccountByTokenStub()
}

export { mockAddAccount, mockAuthentication, mockLoadAccountByToken }
