import env from '../../../config/env'

import { BCryptAdapter } from '../../../../infra/cryptography/bcrypt/bcrypt-adapter'
import { JwtAdapter } from '../../../../infra/cryptography/jwt/jwt-adapter'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository'
import { DbAuthentication } from '../../../../data/usecases/authentication/db-authentication'
import { Authentication } from '../../../../domain/usecases/authentication'

export const makeDbAuthenticationFactory = (): Authentication => {
  const SALT = 12

  const dbAddAccountRepository = new AccountMongoRepository()
  const hasher = new BCryptAdapter(SALT)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  return new DbAuthentication(dbAddAccountRepository, hasher, jwtAdapter, dbAddAccountRepository)
}
