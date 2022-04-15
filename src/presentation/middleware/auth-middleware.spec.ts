/* import { HttpRequest } from '../protocols' */
import { forbidden } from '../helpers'
import { AccessDeniedError } from '../errors'
import { AuthMiddleware } from './auth-middleware'

describe('Auth Middleware', () => {
  test('should return 403 if no x-access-token is provided in headers', async () => {
    const sut = new AuthMiddleware()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
})
