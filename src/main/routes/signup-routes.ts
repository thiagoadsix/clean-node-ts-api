import { Router } from 'express'
import { adaptRoute } from '../adapters/express/express-routes.adapter'
import { makeSignupControllerFactory } from '../factories/signup/signup-controller-factory'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignupControllerFactory()))
}
