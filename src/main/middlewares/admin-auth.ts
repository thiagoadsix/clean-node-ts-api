import { adaptMiddleware } from '@/main/adapters/express/express-middleware.adapter'
import { makeAuthMiddlewareFactory } from '@/main/factories/middleware/auth-middleware-controller-factory'

export const adminAuth = adaptMiddleware(makeAuthMiddlewareFactory('admin'))
