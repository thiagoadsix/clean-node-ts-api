import { adaptMiddleware } from '../adapters/express/express-middleware.adapter'
import { makeAuthMiddlewareFactory } from '../factories/middleware/auth-middleware-controller-factory'

export const auth = adaptMiddleware(makeAuthMiddlewareFactory())
