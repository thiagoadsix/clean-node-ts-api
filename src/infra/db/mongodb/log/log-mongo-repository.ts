import { MongoHelper } from '@/infra/db/helpers/mongo-helper'

import { LogErrorRepository } from './log-mongo-repository-protocols'

export class LogMongoRepository implements LogErrorRepository {
  async logError (error: string): Promise<void> {
    const errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.insertOne({
      stack: error,
      date: new Date()
    })
  }
}
