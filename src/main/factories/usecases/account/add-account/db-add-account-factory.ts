import { DbAddAccount } from '@/data/usecases/add-account/db-add-account'

import { BCryptAdapter } from '@/infra/cryptography/bcrypt/bcrypt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'

export const makeDbAddAccountFactory = (): DbAddAccount => {
  const SALT = 12

  const dbAddAccountRepository = new AccountMongoRepository()
  const hasher = new BCryptAdapter(SALT)
  return new DbAddAccount(hasher, dbAddAccountRepository, dbAddAccountRepository)
}
