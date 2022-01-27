import {
  AddAccount,
  Controller,
  HttpRequest,
  HttpResponse,
  Validation
} from './signup-protocols'
import {
  badRequest,
  serverError,
  ok
} from '../../helpers'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) {
    this.addAccount = addAccount
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      const { name, email, password } = httpRequest.body

      return ok(await this.addAccount.add({ name, email, password }))
    } catch (error) {
      return serverError(error)
    }
  }
}
