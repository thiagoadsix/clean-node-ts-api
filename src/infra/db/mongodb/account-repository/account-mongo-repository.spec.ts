import { MongoHelper } from '../../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

describe('Account MongoDB Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(String(process.env.MONGO_URL))
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  test('should return an account on success', async () => {
    const sut = makeSut()
    const account = await sut.add({
      name: 'name',
      email: 'email@example.com',
      password: 'password'
    })

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('name')
    expect(account.email).toBe('email@example.com')
    expect(account.password).toBe('password')
  })
})
