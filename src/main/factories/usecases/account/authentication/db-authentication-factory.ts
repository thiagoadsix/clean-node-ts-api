import env from '@/main/config/env'

import { Authentication } from '@/domain/usecases/account/authentication'

import { DbAuthentication } from '@/data/usecases/authentication/db-authentication'

import { BCryptAdapter } from '@/infra/cryptography/bcrypt/bcrypt-adapter'
import { JwtAdapter } from '@/infra/cryptography/jwt/jwt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'

export const makeDbAuthenticationFactory = (): Authentication => {
  const SALT = 12

  const dbAddAccountRepository = new AccountMongoRepository()
  const hasher = new BCryptAdapter(SALT)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  return new DbAuthentication(dbAddAccountRepository, hasher, jwtAdapter, dbAddAccountRepository)
}
