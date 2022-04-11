import { LoginController } from '../../../../presentation/controllers/login/login-controller'
import { Controller } from '../../../../presentation/protocols'

import { makeLoginValidationFactory } from './login-validation-factory'
import { makeDbAuthenticationFactory } from '../../usecases/authentication/db-authentication-factory'
import { makeLogControllerDecoratorFactory } from '../../decorators/log-controller-decorator-factory'

export const makeLoginControllerFactory = (): Controller => {
  const loginController = new LoginController(makeDbAuthenticationFactory(), makeLoginValidationFactory())
  return makeLogControllerDecoratorFactory(loginController)
}
