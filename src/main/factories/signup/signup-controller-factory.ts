import env from '../../config/env'

import { BCryptAdapter } from '../../../infra/cryptography/bcrypt/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { SignUpController } from '../../../presentation/controllers/signup/signup-controller'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log/log-controller-decorator'
import { makeSignupValidationFactory } from './signup-validation-factory'
import { JwtAdapter } from '../../../infra/cryptography/jwt/jwt-adapter'
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'

export const makeSignupControllerFactory = (): Controller => {
  const SALT = 12

  const dbAddAccountRepository = new AccountMongoRepository()
  const hasher = new BCryptAdapter(SALT)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const addAccount = new DbAddAccount(hasher, dbAddAccountRepository)
  const dbAuthentication = new DbAuthentication(dbAddAccountRepository, hasher, jwtAdapter, dbAddAccountRepository)
  const signupController = new SignUpController(addAccount, makeSignupValidationFactory(), dbAuthentication)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signupController, logMongoRepository)
}
