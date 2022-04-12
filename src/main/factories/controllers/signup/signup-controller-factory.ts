import { SignUpController } from '../../../../presentation/controllers/auth/signup/signup-controller'
import { Controller } from '../../../../presentation/protocols'
import { makeSignupValidationFactory } from './signup-validation-factory'
import { makeDbAuthenticationFactory } from '../../usecases/authentication/db-authentication-factory'
import { makeDbAddAccountFactory } from '../../usecases/add-account/db-add-account-factory'
import { makeLogControllerDecoratorFactory } from '../../decorators/log-controller-decorator-factory'

export const makeSignupControllerFactory = (): Controller => {
  const signupController = new SignUpController(makeDbAddAccountFactory(), makeSignupValidationFactory(), makeDbAuthenticationFactory())
  return makeLogControllerDecoratorFactory(signupController)
}
