import { LogControllerDecorator } from '../../decorators/log/log-controller-decorator'
import { Controller } from '../../../presentation/protocols/controller'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'

export const makeLogControllerDecoratorFactory = (controller: Controller): LogControllerDecorator => {
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(controller, logMongoRepository)
}
