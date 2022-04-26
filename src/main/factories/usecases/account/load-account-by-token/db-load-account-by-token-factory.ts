import env from '@/main/config/env'

import { DbLoadAccountByToken } from '@/data/usecases/account/load-account-by-token/db-load-account-by-token'

import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import { JwtAdapter } from '@/infra/cryptography/jwt/jwt-adapter'

export const makeLoadAccountByTokenFactory = (): DbLoadAccountByToken => {
  const accountMongoRepository = new AccountMongoRepository()
  const hasher = new JwtAdapter(env.jwtSecret)
  return new DbLoadAccountByToken(hasher, accountMongoRepository)
}
