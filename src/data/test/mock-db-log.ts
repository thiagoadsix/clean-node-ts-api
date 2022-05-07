import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'

const mockLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (stack: string): Promise<void> {
      return Promise.resolve()
    }
  }

  return new LogErrorRepositoryStub()
}

export { mockLogErrorRepository }
