import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers'
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '../../protocols'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body

    if (!email) {
      return badRequest(new MissingParamError('email'))
    }

    if (!password) {
      return badRequest(new MissingParamError('password'))
    }

    return {
      statusCode: 200,
      body: {}
    }
  }
}
