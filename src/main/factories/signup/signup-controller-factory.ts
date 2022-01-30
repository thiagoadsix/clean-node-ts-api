import { BCryptAdapter } from '../../../infra/cryptography/bcrypt/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { SignUpController } from '../../../presentation/controllers/signup/signup-controller'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log/log-controller-decorator'
import { makeSignupValidationFactory } from './signup-validation-factory'

export const makeSignupControllerFactory = (): Controller => {
  const SALT = 12
  const hasher = new BCryptAdapter(SALT)
  const dbAddAccountRepository = new AccountMongoRepository()
  const addAccount = new DbAddAccount(hasher, dbAddAccountRepository)
  const signupController = new SignUpController(addAccount, makeSignupValidationFactory())
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signupController, logMongoRepository)
}
