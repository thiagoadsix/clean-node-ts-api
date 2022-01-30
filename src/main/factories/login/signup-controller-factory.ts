import env from '../../config/env'

import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { BCryptAdapter } from '../../../infra/cryptography/bcrypt/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { JwtAdapter } from '../../../infra/cryptography/jwt/jwt-adapter'
import { LoginController } from '../../../presentation/controllers/login/login-controller'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log/log-controller-decorator'

import { makeLoginValidationFactory } from './login-validation-factory'

export const makeLoginControllerFactory = (): Controller => {
  const SALT = 12

  const accountMongoRepository = new AccountMongoRepository()
  const bcryptAdapter = new BCryptAdapter(SALT)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const dbAuthentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
  const loginController = new LoginController(dbAuthentication, makeLoginValidationFactory())
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(loginController, logMongoRepository)
}
