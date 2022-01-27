import { BCryptAdapter } from '../../infra/cryptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account-mongo-repository'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log-mongo-repository'
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { Controller } from '../../presentation/protocols'
import { LogControllerDecorator } from '../decorators/log'
import { makeSignupValidation } from './signup-validation'

export const makeSignupController = (): Controller => {
  const SALT = 12
  const emailValidator = new EmailValidatorAdapter()
  const encrypter = new BCryptAdapter(SALT)
  const dbAddAccountRepository = new AccountMongoRepository()
  const addAccount = new DbAddAccount(encrypter, dbAddAccountRepository)
  const signupController = new SignUpController(emailValidator, addAccount, makeSignupValidation())
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signupController, logMongoRepository)
}
