import { HttpRequest, HttpResponse } from '../../protocols'
import { badRequest } from '../../helpers'
import { LoginController } from './login'
import { MissingParamError } from '../../errors'

const makeSut = (): LoginController => {
  return new LoginController()
}

describe('Login Controller', () => {
  test('should return 400 if no email is provided', async () => {
    const sut = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        password: 'password'
      }
    }
    const httpResponse: HttpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })
})
