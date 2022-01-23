import { Controller, HttpRequest, HttpResponse, EmailValidator } from '../protocols'
import { MissingParamError, InvalidParamError } from '../errors'
import { badRequest } from '../helpers/http-helper'

export class SignUpController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
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
  }
}
