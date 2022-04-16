import { Middleware } from '../../../presentation/protocols'
import { AuthMiddleware } from '../../../presentation/middleware/auth-middleware'
import { makeLoadAccountByTokenFactory } from '../usecases/account/load-account-by-token/db-load-account-by-token-factory'

export const makeAuthMiddlewareFactory = (role?: string): Middleware => {
  return new AuthMiddleware(makeLoadAccountByTokenFactory(), role)
}
