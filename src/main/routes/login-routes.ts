import { Router } from 'express'

import { adaptRoute } from '../adapters/express/express-routes.adapter'

import { makeLoginControllerFactory } from '../factories/controllers/login/login-controller-factory'
import { makeSignupControllerFactory } from '../factories/controllers/signup/signup-controller-factory'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignupControllerFactory()))
  router.post('/login', adaptRoute(makeLoginControllerFactory()))
}
