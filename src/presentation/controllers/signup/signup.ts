import {
  AddAccount,
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse
} from './signup-protocols'
import {
  badRequest,
  serverError,
  ok
} from '../../helpers'
import { MissingParamError, InvalidParamError } from '../../errors'

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
  ) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { name, email, password, passwordConfirmation } = httpRequest.body

      const requiredFields = ['email', 'name', 'password', 'passwordConfirmation']

      for (const field of requiredFields) {
        if (!(httpRequest.body[field])) {
          return badRequest(new MissingParamError(field))
        }
      }

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'))
      }

      return ok(await this.addAccount.add({ name, email, password }))
    } catch (error) {
      return serverError()
    }
  }
}
