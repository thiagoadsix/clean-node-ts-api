import { SignUpController } from '@/presentation/controllers/auth/signup/signup-controller'
import { Controller } from '@/presentation/protocols'

import { makeDbAuthenticationFactory } from '@/main/factories/usecases/account/authentication/db-authentication-factory'
import { makeDbAddAccountFactory } from '@/main/factories/usecases/account/add-account/db-add-account-factory'
import { makeLogControllerDecoratorFactory } from '@/main/factories/decorators/log-controller-decorator-factory'

import { makeSignupValidationFactory } from './signup-validation-factory'

export const makeSignupControllerFactory = (): Controller => {
  const signupController = new SignUpController(makeDbAddAccountFactory(), makeSignupValidationFactory(), makeDbAuthenticationFactory())
  return makeLogControllerDecoratorFactory(signupController)
}
