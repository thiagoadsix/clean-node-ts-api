import { Authentication } from '../../../domain/usecases/authentication'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers'
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '../../protocols'
import { EmailValidator } from '../signup/signup-protocols'

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

      await this.authentication.auth(email, password)

      return {
        statusCode: 200,
        body: {}
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
