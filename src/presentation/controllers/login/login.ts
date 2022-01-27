import {
  badRequest,
  serverError,
  unauthorized
} from '../../helpers'
import {
  Authentication,
  EmailValidator,
  Controller,
  HttpRequest,
  HttpResponse
} from './login-protocols'
import { InvalidParamError, MissingParamError } from '../../errors'

export class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body

      const requiredFields = ['email', 'password']

      for (const field of requiredFields) {
        if (!(httpRequest.body[field])) {
          return badRequest(new MissingParamError(field))
        }
      }

      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'))
      }

      const token = await this.authentication.auth(email, password)

      if (!token) {
        return unauthorized()
      }

      return {
        statusCode: 200,
        body: {}
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
