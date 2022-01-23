import { Controller, HttpRequest, HttpResponse, EmailValidator } from '../protocols'
import { MissingParamError, InvalidParamError, ServerError } from '../errors'
import { badRequest } from '../helpers/http-helper'

export class SignUpController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const { email } = httpRequest.body

      const requiredFields = ['email', 'name', 'password', 'passwordConfirmation']

      for (const field of requiredFields) {
        if (!(httpRequest.body[field])) {
          return badRequest(new MissingParamError(field))
        }
      }

      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'))
      }

      return {
        body: undefined,
        statusCode: 200
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: new ServerError()
      }
    }
  }
}
