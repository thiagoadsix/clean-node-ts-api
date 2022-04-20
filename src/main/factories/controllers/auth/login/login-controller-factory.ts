import { LoginController } from '@/presentation/controllers/auth/login/login-controller'
import { Controller } from '@/presentation/protocols'

import { makeDbAuthenticationFactory } from '@/main/factories/usecases/account/authentication/db-authentication-factory'
import { makeLogControllerDecoratorFactory } from '@/main/factories/decorators/log-controller-decorator-factory'

import { makeLoginValidationFactory } from './login-validation-factory'

export const makeLoginControllerFactory = (): Controller => {
  const loginController = new LoginController(makeDbAuthenticationFactory(), makeLoginValidationFactory())
  return makeLogControllerDecoratorFactory(loginController)
}
