import { Router } from 'express'

import { adaptRoute } from '@/main/adapters/express/express-routes.adapter'
import { makeLoginControllerFactory } from '@/main/factories/controllers/auth/login/login-controller-factory'
import { makeSignupControllerFactory } from '@/main/factories/controllers/auth/signup/signup-controller-factory'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignupControllerFactory()))
  router.post('/login', adaptRoute(makeLoginControllerFactory()))
}
