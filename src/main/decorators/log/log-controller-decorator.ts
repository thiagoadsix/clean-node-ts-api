import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'

import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols'

// We are using composition instead heritage
export class LogControllerDecorator implements Controller {
  // Who you want to decorate?
  constructor (
    private readonly controller: Controller,
    private readonly logErrorRepository: LogErrorRepository
  ) {
    this.controller = controller
    this.logErrorRepository = logErrorRepository
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)

    console.log('🎮', this.controller)

    console.log('🤖 Request', httpRequest)

    if (httpResponse.statusCode === 500) {
      console.error('💥 Server error', { body: httpResponse.body })
      await this.logErrorRepository.logError(httpResponse.body.stack)
    }

    httpResponse.statusCode === 200 && console.info('💎 Response', { body: httpResponse.body })

    return httpResponse
  }
}
