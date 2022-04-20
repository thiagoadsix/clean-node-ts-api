import { LogMongoRepository } from '@/infra/db/mongodb/log/log-mongo-repository'

import { Controller } from '@/presentation/protocols/controller'

import { LogControllerDecorator } from '@/main/decorators/log/log-controller-decorator'

export const makeLogControllerDecoratorFactory = (controller: Controller): LogControllerDecorator => {
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(controller, logMongoRepository)
}
